import { redirect } from "next/navigation";
import { AdminNav } from "@/components/access/admin-nav";
import { RecipientList } from "@/components/access/recipient-list";
import { RecipientForm } from "@/components/access/recipient-form";
import { sessionExpiry } from "@/server/access/local";
import { FocusHeading } from "@/components/access/focus-heading";

export default async function Recipients({searchParams}:{searchParams:Promise<{state?:string;result?:string}>}) {
  if (!await sessionExpiry("admin")) redirect("/admin/login");
  const {state,result}=await searchParams;
  return <section className="page-section">
    <AdminNav current="recipients" />
    <p className="eyebrow">ADMIN CONSOLE</p><h1>초대 대상 관리</h1>
    <p className="lede">회사·지원 건별로 연결된 링크와 세션을 확인합니다.</p>
    {result === "deleted" && <div role="status" className="panel concept-card"><FocusHeading>확인한 대상과 원접수 사본을 삭제했습니다</FocusHeading><p>최신 목록을 확인해 주세요. 다른 대상은 유지됩니다.</p></div>}
    <div className="recipient-grid">
      <RecipientList state={state} />
      <section className="panel concept-card access-card"><h2>새 대상 등록</h2><RecipientForm remote={Boolean(process.env.PORTFOLIO_ACCESS_URL)} /></section>
    </div>
  </section>;
}
