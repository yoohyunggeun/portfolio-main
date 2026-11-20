import Link from "next/link";
import { labAreas } from "@/content/projects/lab-areas";
import { personalProjects } from "@/content/projects/personal";

export const metadata = { title: "개인 프로젝트" };

export default function Lab() {
  return <section className="page-section">
    <h1>개인 프로젝트</h1>
    <p className="lede">화면 인터랙션, API, 서버 운영, AI 기능을 분야별로 살펴볼 수 있습니다.</p>
    <div className="concept-grid two lab-intro">
      {labAreas.map(({ slug, title, description, summary, examples, status }) => <Link key={slug} href={`/lab/${slug}`} className="panel concept-card">
        <p className="eyebrow lab-label">{title}</p>
        <h2>{description}</h2>
        <p className="muted">{summary}</p>
        <p>{examples}</p>
        {slug === "frontend" ? <div className="lab-card-footer">
          <span className="text-link">프론트엔드 프로젝트 {personalProjects.length}개</span>
          <span className="button primary">Frontend 프로젝트 →</span>
        </div> : <p className="text-link">{status}</p>}
      </Link>)}
    </div>
  </section>;
}
