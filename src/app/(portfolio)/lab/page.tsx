import Link from "next/link";

export const metadata = { title: "개인 프로젝트" };

const areas = [
  { slug: "frontend", title: "Frontend", description: "화면과 인터랙션", examples: "TodoList · ShellGame" },
  { slug: "backend", title: "Backend", description: "API와 비즈니스 로직", examples: "업무 관리 API · 서버 모니터링" },
  { slug: "ai-llm", title: "AI / LLM", description: "AI를 활용한 서비스", examples: "AI 문서 검색 시스템" },
];

export default function Lab() {
  return <section className="page-section">
    <p className="eyebrow lab-label">PERSONAL PROJECTS / DEVELOPMENT LAB</p>
    <h1>개인 프로젝트, 분야별로 살펴보기</h1>
    <p className="lede">Frontend · Backend · AI / LLM 분야별로 만드는 기능과 코드를 살펴봅니다.</p><div className="concept-grid three lab-intro">
      {areas.map(({ slug, title, description, examples }) => <Link key={slug} href={`/lab/${slug}`} className="panel concept-card">
        <p className="eyebrow lab-label">{title}</p>
        <h2>{description}</h2>
        <p className="muted">{examples}</p>
        <span className="button">분야별 프로젝트 보기 →</span>
      </Link>)}
    </div>
  </section>;
}
