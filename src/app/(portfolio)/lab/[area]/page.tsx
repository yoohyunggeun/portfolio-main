import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { paginate, Pagination } from "@/components/projects/pagination";
import { LabNav } from "@/components/projects/lab-nav";
import { personalProjects } from "@/content/projects/personal";

const areas = {
  frontend: { title: "Frontend", description: "화면 전환, 비동기 요청, 상태 동기화, 서버 연동을 구현한 프로젝트입니다.", candidates: [] },
  backend: { title: "Backend", description: "API, 데이터 모델, 인증·권한과 테스트를 설계합니다.", candidates: ["업무 관리 API"] },
  server: { title: "Server", description: "서버 구성과 운영 흐름을 정리합니다.", candidates: ["서버 구성·모니터링"] },
  "ai-llm": { title: "AI / LLM", description: "AI 활용 흐름과 검색 출처, 응답 품질을 검토합니다.", candidates: ["AI 문서 검색 시스템", "AI 제작 로그 요약"] },
};

const filters = [["", "전체"], ["javascript", "JavaScript"], ["react", "React"], ["typescript-nextjs", "TypeScript + Next.js"]];

export function generateStaticParams() {
  return Object.keys(areas).map((area) => ({ area }));
}

type Props = { params: Promise<{ area: string }>; searchParams: Promise<{ tech?: string | string[]; page?: string | string[] }> };

export default async function LabArea({ params, searchParams }: Props) {
  const { area } = await params;
  if (!Object.hasOwn(areas, area)) notFound();
  const { title, description, candidates } = areas[area as keyof typeof areas];
  const { tech, page } = await searchParams;
  const active = typeof tech === "string" && filters.some(([value]) => value === tech) ? tech : "";
  const frontend = area === "frontend";
  const projects = frontend ? personalProjects.filter((project) =>
    active === "" || active === "react" || active === project.language
  ) : [];

  const results = paginate(projects, page);
  function pageHref(number: number) {
    const params = new URLSearchParams();
    if (active) params.set("tech", active);
    if (number > 1) params.set("page", String(number));
    return params.size ? `/lab/frontend?${params}` : "/lab/frontend";
  }

  return <section className="page-section">
    <p className="eyebrow lab-label">PERSONAL PROJECTS / {title.toUpperCase()}</p>
    <h1>{title} Projects</h1>
    <p className="lede">{description}</p>
    <div className="lab-filters">
      {frontend ? <Link className="button" href="/lab">분야 전체</Link> : <LabNav area={area} />}
      {frontend && <nav className="concept-tabs" aria-label="기술 필터">
        {filters.map(([value, label]) => <Link key={value} href={value ? `/lab/frontend?tech=${value}` : "/lab/frontend"} aria-current={active === value ? "true" : undefined}>{label}</Link>)}
      </nav>}
    </div>
    {frontend && <p className="muted list-count" role="status">전체 {projects.length}개
      {projects.length > 0 && ` · ${results.start + 1}–${results.end}번째`}</p>}
    <ul className="concept-grid three frontend-project-grid">
      {results.items.map((project) => <li key={project.slug} className="panel concept-card">
        <div className="lab-project-preview">
          <Image src={`/images/demos/${project.slug}.png`} alt="" {...project.capture} unoptimized />
        </div>
        <h2>{project.title}</h2><p className="muted">{project.tech}</p>
        <p className="muted">{project.summary}</p>
        <ul className="lab-tech-tags" aria-label="활용 기술">
          {project.technologies.map(({ name }) => <li key={name}>{name}</li>)}
          <li>{project.topic}</li>
        </ul>
        <Link className="text-link" href={`/lab/projects/${project.slug}`}>구현 과정과 코드 보기 →</Link>
      </li>)}
      {candidates.map((name) => <li key={name} className="panel concept-card"><p className="eyebrow">기획 후보</p><h2>{name}</h2></li>)}
    </ul>
    {frontend && <Pagination {...results} href={pageHref} />}
    {frontend && !projects.length && <p className="panel concept-card muted">이 기술로 분류된 프로젝트는 준비 중입니다.</p>}
  </section>;
}
