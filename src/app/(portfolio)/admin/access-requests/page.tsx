import Link from "next/link";
import { AdminNav } from "@/components/access/admin-nav";
import { redirect } from "next/navigation";
import { FocusHeading } from "@/components/access/focus-heading";
import { DecisionForm, InviteLink } from "@/components/access/forms";
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
      query.status === "processed"
        ? "processed"
        : query.status === "all"
          ? "all"
          : "pending",
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
        .sort((a, b) => b.created - a.created)
    : (db()
        .prepare("SELECT * FROM requests ORDER BY created DESC,rowid DESC")
        .all() as unknown as Row[]);
  const shown = rows.filter(
    (row) =>
      (status === "all" ||
        (row.status === "pending") === (status === "pending")) &&
      [row.company, row.email].some((x) =>
        x.toLocaleLowerCase().includes(term.toLocaleLowerCase()),
      ),
  );
  const selected = shown.find((row) => row.id === query.request);
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
                ["pending", "검토 대기"],
                ["processed", "처리 완료"],
                ["all", "전체"],
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
              <div className="panel request-table">
                <table>
                  <thead>
                    <tr>
                      <th scope="col">회사명</th>
                      <th scope="col">이메일</th>
                      <th scope="col">접수일</th>
                      <th scope="col">상태</th>
                    </tr>
                  </thead>
                  <tbody>
                    {shown.map((row) => (
                      <tr key={row.id} data-selected={row.id === selected?.id}>
                        <th scope="row">
                          <Link
                            className="request-select"
                            aria-current={
                              row.id === selected?.id ? "true" : undefined
                            }
                            href={href(status, row.id)}
                          >
                            {row.company}
                            <span className="sr-only"> 요청 상세 보기</span>
                          </Link>
                        </th>
                        <td>{row.email}</td>
                        <td>{date(row.created)}</td>
                        <td>
                          <span className="log-status">
                            {labels[row.status]}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <ul className="request-mobile-cards">
                {shown.map((row) => (
                  <li className="panel concept-card" key={row.id}>
                    <h2>{row.company}</h2>
                    <p className="muted">
                      {date(row.created)} · {labels[row.status]}
                    </p>
                    <Link className="text-link" href={href(status, row.id)}>
                      요청 상세 보기 →
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
        {selected ? (
          <article
            key={selected.id + selected.status}
            className="panel concept-card request-detail access-transition"
          >
            <p className="eyebrow">{labels[selected.status]}</p>
            <h2>{selected.company}</h2>
            <p className="muted">{selected.email}</p>
            <dl>
              <dt>요청 범위</dt>
              <dd>{remote ? "전체 보호 자료 열람" : resource.title}</dd>
              <dt>접수 시각 (한국 시간)</dt>
              <dd>{date(selected.created)}</dd>
              <dt>개인정보 동의</dt>
              <dd>
                현재 요청 폼은 개인정보 수집·이용 동의를 필수 검증합니다. 개별
                동의 버전·수신 시각은 서버 기록에 보관됩니다.
              </dd>
            </dl>
            {selected.status === "pending" && (
              <>
                <p className="muted">최초 열람 · 시작 후 1시간</p>
                <DecisionForm id={selected.id} />
              </>
            )}
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
          <aside className="panel concept-card request-detail empty-detail">
            <h2>요청을 선택해 주세요</h2>
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
