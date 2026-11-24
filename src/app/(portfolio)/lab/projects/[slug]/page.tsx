import { canReadProjects } from "@/server/access/session";
import { ProjectLock } from "@/components/access/project-lock";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { personalProjects } from "@/content/projects/personal";

const examples = {
  todolist: {
    file: "src/features/demos/frontend/todolist/todo.js",
    alt: "완료한 할 일과 전체·진행 중·완료 필터가 표시된 TodoList 실행 화면",
    checks: [
      "추가·수정·삭제와 완료 필터가 목록에 반영됨",
      "새로고침 후 수정된 제목과 완료 상태가 복원됨",
    ],
  },
  shellgame: {
    file: "src/features/demos/frontend/shellgame/game.js",
    alt: "공이 든 컵을 보여주는 레벨 1 ShellGame 실행 화면",
    checks: [
      "공 공개와 셔플 동안 선택이 차단되고, 마지막 교환이 끝나면 선택할 수 있음",
      "정답이면 레벨이 오르고, 오답이면 공을 공개한 뒤 다시 시작할 수 있음",
      "새로고침 후 기록이 복원되며 초기화할 수 있음",
    ],
  },
};

const todoExamples = [
  {
    title: "상태 관리",
    file: "src/features/demos/frontend/todolist/TodoList.tsx",
    excerpt:
      /  const \[items, setItems, ready\][\s\S]*?(?=\r?\n  const visible)/,
  },
  {
    title: "필터링",
    file: "src/features/demos/frontend/todolist/todo.js",
    excerpt: /export function filterTodos[\s\S]*$/,
  },
  {
    title: "localStorage",
    file: "src/features/demos/frontend/shared/use-stored-state.ts",
    excerpt: /export function useStoredState[\s\S]*$/,
  },
];

export const dynamicParams = false;

export function generateStaticParams() {
  return personalProjects.map(({ slug }) => ({ slug }));
}

export default async function PersonalProject({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  if (!(await canReadProjects())) return <ProjectLock />;
  const { slug } = await params;
  const project = personalProjects.find((item) => item.slug === slug);
  if (!project) notFound();

  const newDemo = "excerpt" in project ? project : null;
  const example =
    newDemo ??
    (project.slug === "todolist" ? examples.todolist : examples.shellgame);
  const todo = project.slug === "todolist";
  const codeExamples =
    newDemo && "sourceExamples" in newDemo
      ? newDemo.sourceExamples
      : newDemo
        ? [
            {
              title:
                newDemo.language === "javascript"
                  ? "핵심 JSX"
                  : "핵심 TypeScript",
              file: newDemo.file,
              excerpt: newDemo.excerpt,
              usage: null,
            },
          ]
        : todo
          ? todoExamples.map((entry, index) => ({
              ...entry,
              usage: project.technologies[index].usage,
            }))
          : [
              {
                title: "핵심 JavaScript",
                file: example.file,
                excerpt: null,
                usage: null,
              },
            ];

  return (
    <article className="page-section">
      <p className="eyebrow">
        PERSONAL PROJECTS / FRONTEND /{" "}
        {project.language === "typescript-nextjs" ? "TYPESCRIPT" : "JAVASCRIPT"}
      </p>
      <h1>{project.title}</h1>
      <p className="lede">{project.summary}</p>
      <div className="concept-grid personal-detail">
        <section className="panel concept-card project-demo-capture">
          <h2>실행 화면</h2>
          <figure>
            <Image
              src={`/images/demos/${project.slug}.png`}
              alt={example.alt}
              {...project.capture}
              unoptimized
            />
            <figcaption className="muted">실행 화면</figcaption>
          </figure>
          <Link
            prefetch={false}
            className="button primary"
            href={`/demos/${project.slug}`}
          >
            실행하기 →
          </Link>
        </section>
        <section className="panel concept-card">
          <p className="eyebrow">OVERVIEW / FEATURES</p>
          <h2>주요 기능</h2>
          <ul className="detail-list">
            {project.features.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
        <section className="panel concept-card">
          <p className="eyebrow">ARCHITECTURE</p>
          <h2>구현 구조</h2>
          <p className="muted">{project.architecture}</p>
          {!todo && !newDemo && (
            <>
              <h3 className="project-detail-heading">활용 기술</h3>
              <dl className="lab-technology-details">
                {project.technologies.map(({ name, usage }) => (
                  <div key={name}>
                    <dt>{name}</dt>
                    <dd className="muted">{usage}</dd>
                  </div>
                ))}
              </dl>
            </>
          )}
          <h3 className="project-detail-heading">처리한 예외</h3>
          <p className="muted">{project.troubleshooting}</p>
        </section>
        <section className="panel concept-card">
          <p className="eyebrow">TESTING</p>
          <h2>검증 결과</h2>
          <p className="muted">로컬 Chrome · PC 1360px / 모바일 390px</p>
          <ul className="detail-list">
            {example.checks.map((check) => (
              <li key={check}>{check}</li>
            ))}
          </ul>
        </section>
        <section className="panel concept-card project-code">
          <p className="eyebrow">CODE</p>
          <h2>실제 구현 코드</h2>
          {newDemo && (
            <dl className="lab-technology-details">
              {newDemo.technologies.map(({ name, usage }) => (
                <div key={name}>
                  <dt>{name}</dt>
                  <dd className="muted">{usage}</dd>
                </div>
              ))}
            </dl>
          )}
          {codeExamples.map(({ title, file, excerpt, usage }) => {
            const source = readFileSync(join(process.cwd(), file), "utf8");
            const code = excerpt ? source.match(excerpt)?.[0] : source;
            if (!code) throw new Error(`Missing source excerpt: ${file}`);
            return (
              <div key={file}>
                <h3 className="project-detail-heading">{title}</h3>
                {usage && <p>{usage}</p>}
                <p className="muted">{file}</p>
                <pre tabIndex={0} aria-label={`${title} 코드`}>
                  <code>{code.trimEnd()}</code>
                </pre>
              </div>
            );
          })}
        </section>
      </div>
      <Link prefetch={false} href="/lab/frontend" className="text-link">
        ← Frontend 프로젝트
      </Link>
    </article>
  );
}

export const dynamic = "force-dynamic";
