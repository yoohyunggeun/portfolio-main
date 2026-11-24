import { ManagementNotice } from "@/components/access/management-notice";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminNav } from "@/components/access/admin-nav";
import { ManageForm } from "@/components/access/management";
import { IssueInvitation } from "@/components/access/issue-invitation";
import { GroupedAccessList } from "@/components/access/grouped-access-list";
import { db, now, sessionExpiry } from "@/server/access/local";
import { formatKst } from "@/server/access/time";
type Invite = {
  id: string;
  recipient_id?: string;
  company: string;
  invite_until: number;
  used: number | null;
  reusable: number;
  cancelled: number | boolean | null;
};
export default async function Invitations({
  searchParams,
}: {
  searchParams: Promise<{
    recipient?: string;
    state?: string;
    result?: string;
  }>;
}) {
  if (!(await sessionExpiry("admin"))) redirect("/admin/login");
  const { recipient, state = "active", result } = await searchParams;
  const { springAccess } = await import("@/server/access/backend");
  const remote = springAccess()
    ? await (await import("@/server/access/views")).accessLists()
    : null;
  const targets = remote
    ? remote.targets
    : (db().prepare("SELECT id,company,cancelled FROM recipients").all() as {
        id: string;
        company: string;
        cancelled: number | null;
      }[]);
  const target = recipient
    ? targets.find((t) => t.id === recipient)
    : undefined;
  if (recipient && !target) redirect("/admin/recipients");
  const rows: Invite[] = remote
    ? remote.invitations.filter(
        (r) => !recipient || r.recipient_id === recipient,
      )
    : (db()
        .prepare(
          "SELECT id,recipient_id,company,invite_until,used,reusable,cancelled FROM requests WHERE invite IS NOT NULL AND (? IS NULL OR recipient_id=?) ORDER BY created DESC,rowid DESC",
        )
        .all(recipient ?? null, recipient ?? null) as unknown as Invite[]);
  const href = (s: string) =>
    "/admin/invitations?" +
    new URLSearchParams({ state: s, ...(recipient ? { recipient } : {}) });
  return (
    <section className="page-section">
      <AdminNav current="invitations" />
      <p className="eyebrow">ADMIN CONSOLE</p>
      <h1>초대 링크 관리</h1>
      <p className="lede">
        대상별 링크를 펼쳐 관리합니다. 링크 취소와 영구 삭제는 서로 다른
        작업입니다.
      </p>
      {target && (
        <Link className="text-link" href={`/admin/recipients/${recipient}`}>
          ← {target.company} 대상 상세
        </Link>
      )}
      <div className="admin-columns">
        {(result === "deleted" || result === "updated") && (
          <ManagementNotice kind={result} />
        )}
        <GroupedAccessList
          state={state}
          href={href}
          rows={rows.map((row) => {
            const validClock = Number.isFinite(row.invite_until);
            const status = row.cancelled
              ? "취소됨"
              : row.used && !row.reusable
                ? "사용됨"
                : !validClock
                  ? "시각 확인 필요"
                  : row.invite_until <= now()
                    ? "만료"
                    : "활성";
            return {
              id: row.id,
              recipientId: row.recipient_id,
              company: row.company,
              active: status === "활성",
              node: (
                <article
                  id={`invite-${row.id}`}
                  className="panel concept-card access-card"
                >
                  <h2>초대 링크</h2>
                  <dl>
                    <dt>만료 (KST)</dt>
                    <dd>
                      {validClock ? formatKst(row.invite_until) : "확인 필요"}
                    </dd>
                    <dt>정책</dt>
                    <dd>{row.reusable ? "재사용 허용" : "1회 사용"}</dd>
                    <dt>상태</dt>
                    <dd>{status}</dd>
                  </dl>
                  <p className="muted">
                    원문 URL은 발급 직후에만 표시되며 목록에서 복원할 수
                    없습니다.
                  </p>
                  {status === "활성" && (
                    <details>
                      <summary>기한 변경</summary>
                      <ManageForm
                        operation="extend-invite"
                        id={row.id}
                        returnRecipient={row.recipient_id}
                        label="링크 기한 연장"
                      >
                        {remote ? (
                          <label>
                            추가 일수
                            <input
                              type="number"
                              name="days"
                              min={1}
                              max={30}
                              required
                            />
                          </label>
                        ) : (
                          <label>
                            새 만료 시각 (KST)
                            <input
                              type="datetime-local"
                              name="expiry"
                              required
                            />
                          </label>
                        )}
                      </ManageForm>
                    </details>
                  )}
                  {!row.cancelled && (
                    <ManageForm
                      operation="cancel-invite"
                      id={row.id}
                      returnRecipient={row.recipient_id}
                      label="링크 취소"
                    />
                  )}
                  {remote &&
                    validClock &&
                    (row.cancelled || row.invite_until <= now()) && (
                      <details>
                        <summary>이 링크 영구 삭제</summary>
                        <p className="muted">
                          숨김이 아닌 물리 삭제입니다. 연결된 세션 기록이 남아
                          있으면 먼저 해당 종료 세션을 개별 삭제해야 합니다.
                        </p>
                        <ManageForm
                          operation="delete-invite"
                          id={row.id}
                          returnRecipient={row.recipient_id}
                          label="확인한 링크 영구 삭제"
                        >
                          <label>
                            <input
                              type="checkbox"
                              name="confirmDeletion"
                              required
                            />{" "}
                            이 링크 기록의 영구 삭제를 확인합니다
                          </label>
                        </ManageForm>
                      </details>
                    )}
                </article>
              ),
            };
          })}
        />
        <aside className="panel concept-card access-card">
          <h2>새 초대 링크</h2>
          <p className="muted">지정된 열람 범위 · 최초 열람 1시간</p>
          {target?.cancelled ? (
            <p>접근이 취소된 대상입니다.</p>
          ) : (
            <IssueInvitation
              remote={!!remote}
              selected={recipient}
              targets={targets.filter((t) => !t.cancelled)}
            />
          )}
        </aside>
      </div>
    </section>
  );
}
