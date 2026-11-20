import Link from "next/link"; import { redirect } from "next/navigation";
import { AdminNav } from "@/components/access/admin-nav";
import { ManageForm } from "@/components/access/management";
import { db, now, sessionExpiry } from "@/server/access/local";
import { formatKst } from "@/server/access/time";

type Session = { id: string | null; company: string | null; started: number | null; recent: number | null; expires: number; ended: number | null };

export default async function Sessions({ searchParams }: { searchParams: Promise<{ recipient?: string }> }) {
  if (!await sessionExpiry("admin")) redirect("/admin/login");
  const { recipient } = await searchParams;
  const { springAccess } = await import("@/server/access/backend");
  const remote = springAccess() ? await (await import("@/server/access/views")).accessLists() : null;
  const target = recipient ? remote ? remote.targets.find(row => row.id === recipient)
    : db().prepare("SELECT company FROM recipients WHERE id = ?").get(recipient) : undefined;
  if (recipient && !target) redirect("/admin/recipients");
  const rows = remote ? remote.readers.filter(row => !recipient || row.recipient_id === recipient) : db().prepare(`SELECT s.id, r.company, s.started, s.recent, s.expires, s.ended
    FROM sessions s LEFT JOIN requests r ON s.request_id = r.id
    WHERE s.role = 'reader' AND (? IS NULL OR r.recipient_id = ?) ORDER BY s.started DESC, s.rowid DESC`).all(recipient ?? null, recipient ?? null) as unknown as Session[];

  return <section className="page-section">
    <AdminNav current="sessions" />
    <p className="eyebrow">ADMIN CONSOLE</p><h1>열람 세션 관리</h1>
    <p className="lede">최초 접속, 최근 보호 자료 요청과 만료 시각을 확인합니다. 종료는 다음 보호 요청부터 적용됩니다.</p>
    {target && <Link className="text-link" href={`/admin/recipients/${recipient}`}>← {String(target.company)} 대상 상세</Link>}<ul className="access-card">
      {!rows.length && <li className="panel concept-card">발급된 열람 세션이 없습니다.</li>}
      {rows.map((row, index) => {
        const status = row.ended ? "종료" : row.expires <= now() ? "만료" : "유효";
        return <li id={`session-${row.id}`} className="panel concept-card access-card" key={row.id ?? index}>
          <h2>{row.company ?? "이전 열람 세션"}</h2>
          <dl><dt>최초 접속</dt><dd>{formatKst(row.started)}</dd><dt>최근 요청</dt><dd>{formatKst(row.recent)}</dd><dt>만료 (KST)</dt><dd>{formatKst(row.expires)}</dd><dt>상태</dt><dd>{status}</dd></dl>
          {status === "유효" && row.id && <>
            <details><summary>세션 연장</summary>
              <ManageForm operation="extend-session" id={row.id} label="연장 저장">
                {remote ? <label>추가 시간<input type="number" name="hours" min={1} max={719} required /></label> : <label>새 만료 시각 (KST)<input type="datetime-local" name="expiry" required /></label>}
              </ManageForm>
            </details>
            <ManageForm operation="end-session" id={row.id} label="세션 종료" />
          </>}
        </li>;
      })}
    </ul>
  </section>;
}
