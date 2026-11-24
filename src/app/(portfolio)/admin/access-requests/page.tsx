import Link from "next/link";
import { AdminNav } from "@/components/access/admin-nav";
import { redirect } from "next/navigation";
import { FocusHeading } from "@/components/access/focus-heading";
import { DecisionForm, InviteLink } from "@/components/access/forms";
import { RecipientForm } from "@/components/access/recipient-form";
import { RecipientLifecycle } from "@/components/access/recipient-lifecycle";
import { CompanyGroups } from "@/components/access/company-groups";
import { db, resource, sessionExpiry } from "@/server/access/local";
type Row = {
  id: string;
  company: string;
  email: string;
  status: "pending" | "approved" | "rejected";
  created: number;
  invite: string | null;
  used: number | null;
  invite_until: number | null;
  cancelled: number | null;
  reusable: number;
  approvedRecipientId?: string | null;
  consent_version?: string | null;
  consent_received_at?: string | null;
  approvedRecipientRevokedAt?: string | null;
};
const labels = {
  pending: "검토 대기",
  approved: "승인 완료",
  rejected: "거절 완료",
};
const date = (epoch: number) =>
  new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Seoul",
  }).format(epoch * 1000);
export default async function Requests({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; request?: string; q?: string }>;
}) {
  if (!(await sessionExpiry("admin"))) redirect("/admin/login");
  const query = await searchParams,
    status =
      ["pending","approved","rejected","processed"].includes(query.status ?? "") ? query.status! : "all",
    term = (query.q ?? "").trim().slice(0, 100);
  const { list, springAccess, epoch } = await import("@/server/access/backend");
  const remote = springAccess();
  const rows: Row[] = remote
    ? (await list<import("@/server/access/backend").RequestRow>("requests"))
        .map((row) => ({
          ...row,
          created: epoch(row.created_at),
          invite: null,
          used: null,
          invite_until: null,
          cancelled: null,
          reusable: 0,
        }))
        .sort((a, b) => b.created - a.created || b.id.localeCompare(a.id))
    : (db()
        .prepare("SELECT * FROM requests ORDER BY created DESC,rowid DESC")
        .all() as unknown as Row[]);
  const shown = rows.filter(
    (row) =>
      (status === "all" ||
        (status === "processed" ? row.status !== "pending" : row.status === status)) &&
      [row.company, row.email].some((x) =>
        x.toLocaleLowerCase().includes(term.toLocaleLowerCase()),
      ),
  );
  const selected = rows.find((row) => row.id === query.request);
  const recipients = remote ? await list<import("@/server/access/backend").RecipientRow>("recipients") : [];
  const approvedTarget =
    remote && selected?.status === "approved" && selected.approvedRecipientId
      ? recipients.find((row) => row.id === selected.approvedRecipientId)
      : undefined;
  function href(nextStatus = status, id = "") {
    const p = new URLSearchParams({ status: nextStatus });
    if (term) p.set("q", term);
    if (id) p.set("request", id);
    return "/admin/access-requests?" + p;
  }
  return (
    <section className="page-section request-workspace">
      <AdminNav current="access-requests" />
      <p className="eyebrow">ADMIN WORKSPACE</p>
      {selected ? (
        <FocusHeading key={selected.id + selected.status}>
          요청 상세
        </FocusHeading>
      ) : (
        <h1>열람 요청 관리</h1>
      )}
      <div
        className={"request-master-detail" + (selected ? " has-selected" : "")}
      >
        <div className="request-list">
          <div className="request-counts">
            {(["pending", "approved", "rejected"] as const).map((s) => (
              <div className="panel concept-card" key={s}>
                <span className="muted">{labels[s]}</span>
                <strong>{rows.filter((r) => r.status === s).length}</strong>
              </div>
            ))}
          </div>
          <div className="request-filters">
            <nav className="concept-tabs" aria-label="요청 상태">
              {[
                ["all", "전체"],
                ["pending", "검토 대기"],
                ["approved", "승인 완료"],
                ["rejected", "거절 완료"],
              ].map(([s, label]) => (
                <Link
                  key={s}
                  href={href(s)}
                  aria-current={status === s ? "page" : undefined}
                >
                  {label}
                </Link>
              ))}
            </nav>
            <form role="search" action="/admin/access-requests">
              <input type="hidden" name="status" value={status} />
              <input
                name="q"
                type="search"
                maxLength={100}
                aria-label="회사명 또는 이메일 검색"
                placeholder="회사명·이메일 검색"
                defaultValue={term}
              />
              <button className="button" type="submit">
                검색
              </button>
            </form>
          </div>
          {!shown.length ? (
            <div className="panel concept-card">
              <h2>
                {rows.length
                  ? "조건에 맞는 요청이 없습니다."
                  : "아직 열람 요청이 없습니다."}
              </h2>
              <Link className="text-link" href="/admin/access-requests">
                목록 새로 확인 →
              </Link>
            </div>
          ) : (
            <>
              <CompanyGroups rows={shown} created={r=>r.created} render={row=><Link className="recipient-choice request-select" href={href(status,row.id)} aria-current={row.id === selected?.id ? "page" : undefined}>
                <strong>{row.email}</strong><span>{labels[row.status]} · {date(row.created)}</span>
                <span>{recipients.find(t=>t.id===row.approvedRecipientId)?.application || "지원 건 미등록"}</span>
                <small>요청 {row.id.slice(0,8)} · 대상 {row.approvedRecipientId?.slice(0,8) ?? "승인 전·연결 미확인"}</small>
                {row.approvedRecipientRevokedAt && <span>현재 대상 접근 취소됨 · 원승인 이력 보존</span>}
              </Link>} />

            </>
          )}
        </div>
        {selected ? (
          <article
            key={selected.id}
            className="panel concept-card request-detail access-transition"
          >
            <p className="eyebrow">{labels[selected.status]}</p>
            <h2>{selected.company}</h2>
            <p className="muted">{selected.email}</p>
            {selected.status === "approved" && (
              <section className="access-card approved-recipient-management">
                <h3>승인 대상 정보와 권한 관리</h3>
                <p className="muted">
                  위 회사명·이메일은 원접수 기록입니다. 아래 수정은 연결된 대상
                  정보에만 적용하며 원접수·동의 증적은 덮어쓰지 않습니다.
                </p>
                {approvedTarget ? (
                  <>
                    <Link
                      className="button"
                      href={`/admin/recipients/${approvedTarget.id}`}
                    >
                      승인 대상 상세 →
                    </Link>
                    <Link
                      className="text-link"
                      href={`/admin/invitations?recipient=${approvedTarget.id}`}
                    >
                      이 대상의 링크 생성·관리 →
                    </Link>
                    <Link
                      className="text-link"
                      href={`/admin/sessions?recipient=${approvedTarget.id}`}
                    >
                      이 대상의 기기별 세션 관리 →
                    </Link>
                    <details>
                      <summary>승인 대상 정보 수정</summary>
                      <RecipientForm
                        remote
                        recipient={{
                          id: approvedTarget.id,
                          company: approvedTarget.company,
                          email: approvedTarget.email ?? "",
                          application: approvedTarget.application ?? "",
                          contact: approvedTarget.contact ?? "",
                          posting: approvedTarget.posting_url ?? "",
                          memo: approvedTarget.memo ?? "",
                        }}
                      />
                    </details>
                    <p role="status">현재 접근: {approvedTarget.status === "revoked" ? "취소됨" : "허용 대상"} · 원승인 기록은 유지됩니다.</p>
                    <RecipientLifecycle id={approvedTarget.id} company={approvedTarget.company} mode="revoke" />
                  </>
                ) : (
                  <p>
                    이 요청과 대상의 정확한 연결이 확인되지 않아 여기서 수정할
                    수 없습니다. 회사명·이메일로 임의 연결하지 않습니다.
                  </p>
                )}
              </section>
            )}
            <dl>
              <dt>요청 범위</dt>
              <dd>{remote ? "전체 보호 자료 열람" : resource.title}</dd>
              <dt>접수 시각 (한국 시간)</dt>
              <dd>{date(selected.created)}</dd>
              <dt>개인정보 동의</dt>
              <dd>
                {selected.consent_version && selected.consent_received_at && Number.isFinite(Date.parse(selected.consent_received_at)) ? <>
                  접수 당시 명시 동의 기록 · 버전 {selected.consent_version}<br />서버 수신 {date(Date.parse(selected.consent_received_at)/1000)} (KST)
                </> : "접수 당시 동의 증적 미확인 · 현재 폼의 필수 동의와 이 요청의 과거 증적은 구분합니다."}
              </dd>
            </dl>
            {selected.status === "pending" && (
              <>
                <p className="muted">최초 열람 · 시작 후 1시간</p>
              </>
            )}
            <DecisionForm
              key={selected.id}
              id={selected.id}
              status={selected.status}
            />
            {selected.status === "approved" &&
              selected.invite &&
              (selected.cancelled ||
              (selected.used && !selected.reusable) ||
              (selected.invite_until ?? 0) <= Date.now() / 1000 ? (
                <p role="status">
                  {selected.cancelled
                    ? "초대 링크가 취소되었습니다."
                    : selected.used && !selected.reusable
                      ? "초대 링크를 사용했습니다."
                      : "초대 링크가 만료되었습니다."}
                </p>
              ) : (
                <InviteLink path={"/invite/" + selected.invite} />
              ))}
            <Link className="text-link" href={href()}>
              ← 요청 목록
            </Link>
          </article>
        ) : (
          <aside className="request-detail empty-detail">
            <p>요청을 선택해 주세요</p>
            <p className="muted">
              목록에서 요청을 선택하면 상세 내용과 처리할 수 있는 작업이
              표시됩니다.
            </p>
          </aside>
        )}
      </div>
    </section>
  );
}
