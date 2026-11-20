import Link from "next/link";
import { WorkRecordGrid } from "@/components/projects/work-record-grid";
import { representativeWork, workRecordCount, workRoles } from "@/content/projects/work-records";
import { sessionExpiry } from "@/server/access/local";

export const metadata = { title: "실무 프로젝트" };

export default async function WorkPage() {
  const admin = Boolean(await sessionExpiry("admin"));
  return <section className="page-section">
    <h1>실무 프로젝트</h1>
    <p className="lede">개발·연동부터 구축·이관, 문서 보안, 보고서, 개발자 교육까지 담당한 업무를 살펴봅니다.</p>
    <div className="section-heading work-list-heading">
      <h2>대표 사례</h2>
      <Link className="button primary" href="/work/all">전체 실무 기록 {workRecordCount}개 →</Link>
    </div>
    <WorkRecordGrid records={await representativeWork(admin)} featured />
    <section className="panel concept-card work-role">
      <h2>역할로 찾아보기</h2>
      <nav className="concept-tabs" aria-label="실무 역할">
        {workRoles.map(({ id, label }) => <Link key={id} href={`/work/all?type=${id}`}>{label}</Link>)}
      </nav>
      <p className="muted">전체 목록에서 사업명을 검색하거나, 한 사업을 여러 역할로 찾아볼 수 있습니다.</p>
    </section>
  </section>;
}
