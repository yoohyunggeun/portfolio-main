import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminNav } from "@/components/access/admin-nav";
import { db, now, sessionExpiry } from "@/server/access/local";
import { formatKst } from "@/server/access/time";

export const metadata = { title: "운영 대시보드" };

export default async function AdminDashboard() {
  if (!await sessionExpiry("admin")) redirect("/admin/login");
  const { list, springAccess } = await import("@/server/access/backend");
  if (springAccess()) {
    const collections = [
      ["열람 요청", "requests", "access-requests", "pending"],
      ["초대 링크", "invitations", "invitations", "active"],
      ["열람 세션", "sessions", "sessions", "active"],
    ];
    const counts = await Promise.all(collections.map(async ([, apiName, , status]) =>
      (await list<{ status: string }>(apiName)).filter(row => row.status === status).length));
    return <section className="page-section"><AdminNav current="dashboard" /><h1>운영 대시보드</h1>
      <div className="concept-grid three">{collections.map(([title, , route], index) =>
        <Link key={route} className="panel concept-card" href={"/admin/" + route}><h2>{title}</h2><strong>{counts[index]}</strong></Link>
      )}</div></section>;
  }
  const store = db();
  const time = now();
  const pending = store.prepare("SELECT COUNT(*) AS count FROM requests WHERE status = 'pending'").get();
  const invites = store.prepare(`SELECT COUNT(*) AS count FROM requests WHERE status = 'approved' AND invite IS NOT NULL
    AND cancelled IS NULL AND invite_until > ? AND (used IS NULL OR reusable = 1)`).get(time);
  const sessions = store.prepare("SELECT COUNT(*) AS count FROM sessions WHERE role = 'reader' AND ended IS NULL AND expires > ?").get(time);
  const recent = store.prepare(`SELECT s.id, s.recent, s.expires, s.ended, COALESCE(t.company, r.company) AS company
    FROM sessions s LEFT JOIN requests r ON r.id = s.request_id LEFT JOIN recipients t ON t.id = r.recipient_id
    WHERE s.role = 'reader' AND s.recent IS NOT NULL ORDER BY s.recent DESC, s.rowid DESC LIMIT 5`).all();

  const cards = [
    { label: "ACCESS REQUESTS", count: `${pending?.count ?? 0}건`, description: "검토 대기 중인 열람 요청", href: "/admin/access-requests" },
    { label: "INVITATIONS", count: `${invites?.count ?? 0}개`, description: "유효한 초대 링크", href: "/admin/invitations" },
    { label: "SESSIONS", count: `${sessions?.count ?? 0}개`, description: "현재 유효한 열람 세션", href: "/admin/sessions" },
  ];

  return <section className="page-section">
    <AdminNav current="dashboard" />
    <p className="eyebrow">ADMIN CONSOLE</p><h1>운영 대시보드</h1>
    <p className="lede">열람 요청, 초대 링크, 세션 상태를 확인합니다.</p>
    <div className="concept-grid three">
      {cards.map((card) => <Link className="panel concept-card dashboard-card" key={card.href} href={card.href}>
        <p className="eyebrow">{card.label}</p><strong>{card.count}</strong><p className="muted">{card.description} →</p>
      </Link>)}
    </div>
    <section className="panel concept-card dashboard-recent">
      <div className="section-heading"><h2>최근 열람 기록</h2><Link className="text-link" href="/admin/sessions">열람 세션 관리 →</Link></div>
      {recent.length ? <div className="dashboard-table">
        <table><thead><tr><th scope="col">초대 대상</th><th scope="col">최근 요청 (KST)</th><th scope="col">세션 만료 (KST)</th><th scope="col">상태</th></tr></thead>
          <tbody>{recent.map((row) => <tr key={String(row.id)}>
            <th scope="row">{row.company ? String(row.company) : "이전 열람 세션"}</th>
            <td>{formatKst(Number(row.recent))}</td><td>{formatKst(Number(row.expires))}</td>
            <td>{row.ended ? "종료" : Number(row.expires) <= time ? "만료" : "열람 가능"}</td>
          </tr>)}</tbody>
        </table>
      </div> : <p className="muted">아직 기록된 보호 자료 요청이 없습니다.</p>}
    </section>
    <Link className="text-link" href="/admin/access-requests">열람 요청 확인 →</Link>
  </section>;
}
