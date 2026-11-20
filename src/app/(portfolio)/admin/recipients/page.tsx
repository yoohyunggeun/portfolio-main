import { redirect } from "next/navigation";
import { AdminNav } from "@/components/access/admin-nav";
import { RecipientList } from "@/components/access/recipient-list";
import { RecipientForm } from "@/components/access/recipient-form";
import { sessionExpiry } from "@/server/access/local";

export default async function Recipients() {
  if (!await sessionExpiry("admin")) redirect("/admin/login");
  return <section className="page-section">
    <AdminNav current="recipients" />
    <p className="eyebrow">ADMIN CONSOLE</p><h1>초대 대상 관리</h1>
    <p className="lede">회사·지원 건별로 연결된 링크와 세션을 확인합니다.</p>
    <div className="recipient-grid">
      <RecipientList />
      <section className="panel concept-card access-card"><h2>새 대상 등록</h2><RecipientForm remote={Boolean(process.env.PORTFOLIO_ACCESS_URL)} /></section>
    </div>
  </section>;
}
