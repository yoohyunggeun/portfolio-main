import Link from "next/link";
import { db } from "@/server/access/local";

export async function RecipientList({ current }: { current?: string }) {
  const { springAccess } = await import("@/server/access/backend");
  const rows = springAccess() ? (await (await import("@/server/access/views")).accessLists()).targets : db().prepare("SELECT id, company, application, cancelled FROM recipients ORDER BY created DESC, rowid DESC").all();
  return <section className="panel concept-card access-card">
    <h2>대상 목록</h2>
    {!rows.length && <p className="muted">등록된 초대 대상이 없습니다.</p>}
    <ul className="access-card">
      {rows.map((row) => <li key={String(row.id)}>
        <Link className="recipient-choice" href={`/admin/recipients/${row.id}`} aria-current={current === row.id ? "page" : undefined}>
          <strong>{String(row.company)}</strong>
          <span className="muted">{String(row.application)}{row.cancelled ? " · 접근 취소됨" : ""}</span>
        </Link>
      </li>)}
    </ul>
  </section>;
}
