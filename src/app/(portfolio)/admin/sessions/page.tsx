import { ManagementNotice } from "@/components/access/management-notice";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminNav } from "@/components/access/admin-nav";
import { ManageForm } from "@/components/access/management";
import { GroupedAccessList } from "@/components/access/grouped-access-list";
import { db, now, sessionExpiry } from "@/server/access/local";
import { formatKst } from "@/server/access/time";
type Session = {
  id: string;
  recipient_id?: string;
  invitation_id?: string;
  company: string | null;
  started: number | null;
  recent: number | null;
  expires: number;
  ended: number | null;
};
export default async function Sessions({
  searchParams,
}: {
  searchParams: Promise<{
    recipient?: string;
    state?: string;
    result?: string;
    invitation?: string;
    group?: string;
  }>;
}) {
  if (!(await sessionExpiry("admin"))) redirect("/admin/login");
  const {
    recipient,
    state = "all",
    result,
    invitation,
    group,
  } = await searchParams;
  const { springAccess } = await import("@/server/access/backend");
  const remote = springAccess()
    ? await (await import("@/server/access/views")).accessLists()
    : null;
  const target = recipient
    ? remote
      ? remote.targets.find((t) => t.id === recipient)
      : db().prepare("SELECT company FROM recipients WHERE id=?").get(recipient)
    : undefined;
  if (recipient && !target) redirect("/admin/recipients");
  const allRows: Session[] = remote
    ? remote.readers.filter((r) => !recipient || r.recipient_id === recipient)
    : (db()
        .prepare(
          "SELECT s.id,r.id AS invitation_id,r.recipient_id,r.company,s.started,s.recent,s.expires,s.ended FROM sessions s LEFT JOIN requests r ON s.request_id=r.id WHERE s.role='reader' AND (? IS NULL OR r.recipient_id=?) ORDER BY s.started DESC,s.rowid DESC",
        )
        .all(recipient ?? null, recipient ?? null) as unknown as Session[]);
  const rows = invitation
    ? allRows.filter((row) => row.invitation_id === invitation)
    : allRows;
  const href = (s: string) =>
    "/admin/sessions?" +
    new URLSearchParams({
      state: s,
      ...(recipient ? { recipient } : {}),
      ...(invitation ? { invitation } : {}),
    });
  return (
    <section className="page-section">
      <AdminNav current="sessions" />
      <p className="eyebrow">ADMIN CONSOLE</p>
      <h1>열람 세션 관리</h1>
      {invitation && (
        <p className="muted">선택한 링크에 연결된 세션만 표시합니다.</p>
      )}
      <p className="lede">
        대상별 한 행으로 묶어 보되 기기별 세션과 권한은 각각 유지합니다. 종료는
        다음 보호 요청부터 적용됩니다.
      </p>
      {target && (
        <Link className="text-link" href={`/admin/recipients/${recipient}`}>
          ← {String(target.company)} 대상 상세
        </Link>
      )}
      {(result === "deleted" || result === "updated") && (
        <ManagementNotice kind={result} />
      )}
      <GroupedAccessList
        openGroupId={group}
        state={state}
        href={href}
        rows={rows.map((row) => {
          const validClock = Number.isFinite(row.expires);
            const targetBlocked = remote?.targets.find(t=>t.id===row.recipient_id)?.cancelled === true;
          const status = row.ended
            ? "종료"
            : !validClock
              ? "시각 확인 필요"
              : row.expires <= now()
                ? "만료"
                : "유효";
          return {
            id: row.id,
            recipientId: row.recipient_id,
            company: row.company ?? "연결 대상 확인 필요",
            email: remote?.targets.find(t=>t.id===row.recipient_id)?.email,
            application: remote?.targets.find(t=>t.id===row.recipient_id)?.application,
            created: remote?.targets.find(t=>t.id===row.recipient_id)?.created_at ? Date.parse(remote.targets.find(t=>t.id===row.recipient_id)!.created_at!)/1000 : 0,
            active: !targetBlocked && status === "유효",
            node: (
              <article
                id={`session-${row.id}`}
                className="panel concept-card access-card"
              >
                <h2>기기별 열람 세션</h2>
                <dl>
                  <dt>최초 접속</dt>
                  <dd>{formatKst(row.started)}</dd>
                  <dt>최근 요청</dt>
                  <dd>{formatKst(row.recent)}</dd>
                  <dt>만료 (KST)</dt>
                  <dd>{validClock ? formatKst(row.expires) : "확인 필요"}</dd>
                  <dt>상태</dt>
                  <dd>{status}{targetBlocked ? " · 상위 대상 접근 취소로 열람 차단" : ""}</dd>
                </dl>
                {status === "유효" && (
                  <>
                    <details>
                      <summary>세션 연장</summary>
                      <ManageForm
                        operation="extend-session"
                        id={row.id}
                        returnRecipient={row.recipient_id}
                        label="연장 저장"
                      >
                        {remote ? (
                          <label>
                            추가 시간
                            <input
                              type="number"
                              name="hours"
                              min={1}
                              max={719}
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
                    <ManageForm
                      operation="end-session"
                      id={row.id}
                      returnRecipient={row.recipient_id}
                      label="세션 종료"
                    />
                  </>
                )}
                {remote && validClock && status !== "유효" && (
                  <details>
                    <summary>이 세션 영구 삭제</summary>
                    <p className="muted">
                      종료·만료된 이 세션 기록만 물리 삭제합니다. 다른 기기의
                      세션은 유지됩니다.
                    </p>
                    <ManageForm
                      operation="delete-session"
                      id={row.id}
                      returnRecipient={row.recipient_id}
                      label="확인한 세션 영구 삭제"
                    >
                      <label>
                        <input
                          type="checkbox"
                          name="confirmDeletion"
                          required
                        />{" "}
                        이 세션 기록의 영구 삭제를 확인합니다
                      </label>
                    </ManageForm>
                  </details>
                )}
              </article>
            ),
          };
        })}
      />
    </section>
  );
}
