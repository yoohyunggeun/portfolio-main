import Link from "next/link";
import { notFound } from "next/navigation";
import { LabNav } from "@/components/projects/lab-nav";
import { personalProjects } from "@/content/projects/personal";

const areas = {
  frontend: { title: "Frontend", description: "화면 구성, 사용자 인터랙션과 상태 관리 과정을 정리합니다.", candidates: [] },
  backend: { title: "Backend", description: "API, 데이터 모델, 인증·권한과 테스트를 설계합니다.", candidates: ["업무 관리 API", "서버 모니터링 시스템"] },
  "ai-llm": { title: "AI / LLM", description: "AI 활용 흐름과 검색 출처, 응답 품질을 검토합니다.", candidates: ["AI 문서 검색 시스템", "AI 제작 로그 요약"] },
};

const filters = [["", "전체"], ["javascript", "JavaScript"], ["react", "React"], ["typescript-nextjs", "TypeScript + Next.js"]];

export function generateStaticParams() {
  return Object.keys(areas).map((area) => ({ area }));
}

type Props = { params: Promise<{ area: string }>; searchParams: Promise<{ tech?: string | string[] }> };

export default async function LabArea({ params, searchParams }: Props) {
  const { area } = await params;
  if (!Object.hasOwn(areas, area)) notFound();
  const { title, description, candidates } = areas[area as keyof typeof areas];
  const { tech } = await searchParams;
  const active = typeof tech === "string" && filters.some(([value]) => value === tech) ? tech : "";
  const frontend = area === "frontend";
  const projects = frontend && (active === "" || active === "javascript") ? personalProjects : [];

  return <section className="page-section">
    <p className="eyebrow lab-label">PERSONAL PROJECTS / {title.toUpperCase()}</p>
    <h1>{title} Projects</h1>
    <p className="lede">{description}</p>
    <div className="lab-filters">
      <LabNav area={area} />
      {frontend && <nav className="concept-tabs" aria-label="기술 필터">
        {filters.map(([value, label]) => <Link key={value} href={value ? `/lab/frontend?tech=${value}` : "/lab/frontend"} aria-current={active === value ? "true" : undefined}>{label}</Link>)}
      </nav>}
    </div>
    <ul className="concept-grid three">
      {projects.map((project) => <li key={project.slug} className="panel concept-card">
        <div className="lab-preview" aria-hidden="true"><strong>{project.preview}</strong></div>
        <h2>{project.title}</h2><p className="muted">{project.tech}</p>
        <p className="muted">{project.summary}</p>
        <Link className="text-link" href={`/lab/projects/${project.slug}`}>기능 · 코드 · 개선 과정 보기 →</Link>
      </li>)}
      {candidates.map((name) => <li key={name} className="panel concept-card"><p className="eyebrow">기획 후보</p><h2>{name}</h2></li>)}
    </ul>
    {frontend && !projects.length && <p className="panel concept-card muted">이 기술로 분류된 프로젝트는 준비 중입니다.</p>}
  </section>;
}
