import Link from "next/link";
import { notFound } from "next/navigation";
import { findWorkRecord, workRoleLabel } from "@/content/projects/work-records";
import { sessionExpiry } from "@/server/access/local";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  return { title: (await findWorkRecord(slug, false))?.title };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const admin = Boolean(await sessionExpiry("admin"));
  const project = await findWorkRecord(slug, admin);
  if (!project) notFound();

  const sections = [
    ["사업 맥락", project.context],
    ["내가 담당한 일", project.task],
    ["구현 흐름", project.flow],
    ["기술과 적용 위치", project.tools],
  ];

  return <article className="page-section">
    <h1>{project.title}</h1>
    <p className="lede">{[project.organization, ...project.roles.map(workRoleLabel)].filter(Boolean).join(" · ")}</p>
    <Link href="/work/all" className="button">← 전체 실무 기록</Link>
    <div className="concept-grid two work-detail-sections">
      {sections.map(([title, body]) => <section className="panel concept-card" key={title}>
        <h2>{title}</h2><p className="muted">{body}</p>
      </section>)}
    </div>
    {project.id === 1 && <aside className="panel concept-card mes-access">
      <div><h2>보호 자료</h2><p className="muted">장애 대응 사례 상세</p></div>
      <Link href="/protected/mes-case" className="button" prefetch={false}>상세 열람 →</Link>
    </aside>}
  </article>;
}
