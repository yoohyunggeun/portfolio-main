import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { personalProjects } from "@/content/projects/personal";

const examples = {
  todolist: {
    file: "src/features/demos/todolist/todo.js",
    alt: "완료한 할 일과 전체·진행 중·완료 필터가 표시된 TodoList 실행 화면",
    checks: ["추가·수정·삭제와 완료 필터가 목록에 반영됨", "새로고침 후 수정된 제목과 완료 상태가 복원됨"],
  },
  shellgame: {
    file: "src/features/demos/shellgame/game.js",
    alt: "컵 선택 후 공의 위치와 첫 라운드 기록이 표시된 ShellGame 실행 화면",
    checks: ["컵을 선택하면 공의 위치를 표시하고 같은 라운드에서 추가 선택을 차단함", "다음 라운드가 집계되고 새로고침 후 기록이 복원되며 초기화할 수 있음"],
  },
};

export const dynamicParams = false;

export function generateStaticParams() {
  return personalProjects.map(({ slug }) => ({ slug }));
}

export default async function PersonalProject({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = personalProjects.find((item) => item.slug === slug);
  if (!project) notFound();

  const example = project.slug === "todolist" ? examples.todolist : examples.shellgame;
  const code = readFileSync(join(process.cwd(), example.file), "utf8").trimEnd();

  return <article className="page-section">
    <p className="eyebrow">PERSONAL PROJECTS / FRONTEND / JAVASCRIPT</p>
    <h1>{project.title}</h1>
    <p className="lede">{project.summary}</p>
    <div className="concept-grid personal-detail">
      <section className="panel concept-card project-demo-capture">
        <h2>실행 화면</h2>
        <figure>
          <Image src={`/images/demos/${project.slug}.png`} alt={example.alt} width={760} height={360} unoptimized />
          <figcaption className="muted">로컬 데모 실행 화면</figcaption>
        </figure>
        <Link className="button primary" href={`/demos/${project.slug}`}>데모 실행 →</Link>
      </section>
      <section className="panel concept-card"><p className="eyebrow">OVERVIEW / FEATURES</p><h2>주요 기능</h2>
        <ul className="detail-list">{project.features.map((item) => <li key={item}>{item}</li>)}</ul>
      </section>
      <section className="panel concept-card"><p className="eyebrow">ARCHITECTURE</p><h2>구현 구조</h2>
        <p className="muted">{project.architecture}</p>
        <h3 className="project-detail-heading">처리한 예외</h3>
        <p className="muted">{project.troubleshooting}</p>
      </section>
      <section className="panel concept-card"><p className="eyebrow">TESTING</p><h2>검증 결과</h2>
        <p className="muted">로컬 Chrome · PC 1360px / 모바일 390px</p>
        <ul className="detail-list">{example.checks.map((check) => <li key={check}>{check}</li>)}</ul>
      </section>
      <section className="panel concept-card project-code">
        <p className="eyebrow">CODE</p><h2>핵심 JavaScript</h2>
        <p className="muted">{example.file}</p>
        <pre tabIndex={0} aria-label="핵심 JavaScript 코드"><code>{code}</code></pre>
      </section>
    </div>
    <Link href="/lab/frontend" className="text-link">← Frontend 프로젝트</Link>
  </article>;
}
