import Link from "next/link";
import { ManageForm } from "./management";
import { formatKst } from "@/server/access/time";
type LinkedSession = {
  id: string;
  started: number;
  recent: number;
  expires: number;
  ended: number | null;
};
export function InvitationSessions({
  invitationId,
  recipientId,
  rows,
  at,
}: {
  invitationId: string;
  recipientId?: string;
  rows: LinkedSession[];
  at: number;
}) {
  const status = (row: LinkedSession) =>
    !Number.isFinite(row.expires)
      ? "시각 확인 필요"
      : row.ended
        ? "종료"
        : row.expires <= at
          ? "만료"
          : "활성";
  const active = rows.filter((r) => status(r) === "활성").length,
    ended = rows.filter((r) => ["종료", "만료"].includes(status(r))).length;
  const query = new URLSearchParams({
    state: "all",
    invitation: invitationId,
    ...(recipientId ? { recipient: recipientId } : {}),
  });
  return (
    <section
      className="access-card invitation-sessions"
      aria-label="이 링크의 연결 세션"
    >
      <h3>연결된 세션 {rows.length}개</h3>
      <p className="muted">
        활성 {active}개 · 종료·만료 {ended}개
        {rows.length - active - ended > 0
          ? ` · 시각 확인 필요 ${rows.length - active - ended}개`
          : ""}
      </p>
      {rows.length > 0 ? (
        <>
          <p role="status">
            링크를 삭제하려면 연결된 세션 기록을 먼저 각각 정리해야 합니다. 링크
            취소만으로 이미 발급된 활성 세션이 종료되지는 않습니다.
          </p>
          <Link className="text-link" href={`/admin/sessions?${query}`}>
            연결된 세션만 따로 보기 →
          </Link>
          <ol className="access-card">
            {rows.map((row) => {
              const current = status(row);
              return (
                <li
                  key={row.id}
                  className="panel concept-card access-card linked-session"
                  data-linked-session-id={row.id}
                >
                  <h4>
                    세션 {row.id.slice(0, 8)} · {current}
                  </h4>
                  <dl>
                    <dt>최초 접속</dt>
                    <dd>{formatKst(row.started)}</dd>
                    <dt>최근 요청</dt>
                    <dd>{formatKst(row.recent)}</dd>
                    <dt>만료 (KST)</dt>
                    <dd>
                      {Number.isFinite(row.expires)
                        ? formatKst(row.expires)
                        : "확인 필요"}
                    </dd>
                  </dl>
                  {current === "활성" ? (
                    <ManageForm
                      operation="end-session"
                      id={row.id}
                      returnRecipient={recipientId}
                      returnInvitation={invitationId}
                      label="이 세션 종료"
                    />
                  ) : current === "종료" || current === "만료" ? (
                    <ManageForm
                      operation="delete-session"
                      id={row.id}
                      returnRecipient={recipientId}
                      returnInvitation={invitationId}
                      label="이 종료 세션 영구 삭제"
                    >
                      <label>
                        <input
                          type="checkbox"
                          name="confirmDeletion"
                          required
                        />{" "}
                        세션 {row.id.slice(0, 8)} 기록의 영구 삭제를 확인합니다
                      </label>
                    </ManageForm>
                  ) : (
                    <p>정확한 시각을 확인할 수 없어 삭제할 수 없습니다.</p>
                  )}
                </li>
              );
            })}
          </ol>
        </>
      ) : (
        <p>남아 있는 연결 세션이 없습니다.</p>
      )}
    </section>
  );
}
