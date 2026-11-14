import Link from "next/link";
import { labAreas } from "@/content/projects/lab-areas";

export const metadata = { title: "개인 프로젝트" };



export default function Lab() {
  return <section className="page-section">
    <p className="eyebrow lab-label">PERSONAL PROJECTS / DEVELOPMENT LAB</p>
    <h1>개인 프로젝트, 분야별로 살펴보기</h1>
    <p className="lede">Frontend · Backend · Server · AI / LLM 분야별로 만드는 기능과 코드를 살펴봅니다.</p><div className="concept-grid three lab-intro">
      {labAreas.map(({ slug, title, description, examples, status }) => <Link key={slug} href={`/lab/${slug}`} className="panel concept-card">
        <p className="eyebrow lab-label">{title}</p>
        <h2>{description}</h2>
        <p className="muted">{examples}{status && ` · ${status}`}</p>
        <span className="button">분야별 프로젝트 보기 →</span>
      </Link>)}
    </div>
  </section>;
}
