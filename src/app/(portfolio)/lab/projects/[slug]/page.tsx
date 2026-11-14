import Link from "next/link";
import { notFound } from "next/navigation";
import { personalProjects } from "@/content/projects/personal";

export function generateStaticParams() {
  return personalProjects.map(({ slug }) => ({ slug }));
}

export default async function PersonalProject({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = personalProjects.find((item) => item.slug === slug);
  if (!project) notFound();

  return <article className="page-section">
    <p className="eyebrow">PERSONAL PROJECTS / FRONTEND / JAVASCRIPT</p>
    <h1>{project.title}</h1>
    <p className="lede">{project.summary}</p>
    <div className="concept-grid personal-detail">
      <section className="panel concept-card">
        <div className="lab-preview" aria-hidden="true"><strong>{project.preview}</strong></div>
        <Link className="button primary" href={`/demos/${project.slug}`}>데모 실행 →</Link>
      </section>
      <section className="panel concept-card"><p className="eyebrow">OVERVIEW / FEATURES</p><h2>주요 기능</h2>
        <ul className="detail-list">{project.features.map((item) => <li key={item}>{item}</li>)}</ul>
      </section>
      <section className="panel concept-card"><p className="eyebrow">ARCHITECTURE</p><h2>구현 구조</h2><p className="muted">{project.architecture}</p></section>
      <section className="panel concept-card"><p className="eyebrow">CODE · TROUBLESHOOTING · TESTING</p><h2>구현과 확인 방법</h2><p className="muted">{project.troubleshooting}</p><p className="muted">{project.checks}</p></section>
    </div>
    <Link href="/lab/frontend" className="text-link">← Frontend 프로젝트</Link>
  </article>;
}
