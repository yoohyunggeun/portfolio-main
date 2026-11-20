import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { resource, sessionExpiry } from "@/server/access/local";
import { AccessError, authorize, springAccess } from "@/server/access/backend";
import { protectedContent, type ProtectedContent } from "@/server/access/protected-content";

export const dynamic = "force-dynamic";

export default async function ProtectedCase({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (slug !== resource.slug) notFound();
  const remote = springAccess();
  const permission = remote ? await authorize(slug).catch(() => undefined) : null;
  if (remote && permission === undefined) redirect("/access?reason=unavailable");
  const reader = remote ? 0 : await sessionExpiry("reader");
  const admin = remote ? permission?.admin : await sessionExpiry("admin");
  if (!permission?.allowed && !reader && !admin) redirect("/access?resource=mes-case");

  let content: ProtectedContent;
  try {
    content = await protectedContent(slug);
  } catch (error) {
    if (error instanceof AccessError && error.status === 404) notFound();
    redirect(error instanceof AccessError && error.status === 403
      ? "/access?resource=mes-case" : "/access?reason=unavailable");
  }

  return <article className="page-section">
    <p className="eyebrow">PROTECTED CASE STUDY</p>
    <h1>{content.title}</h1>
    {content.subtitle && <p className="lede">{content.subtitle}</p>}
    <p className="eyebrow">{admin ? "관리자 열람" : "열람 가능"}</p>
    <div className="concept-grid three">
      {content.sections.map(({ title, body }) => <section className="panel concept-card" key={title}>
        <h2>{title}</h2><p className="muted">{body}</p>
      </section>)}
    </div>
    <p className="lede">열람 시간이 끝나면 접근 안내에서 다시 요청할 수 있습니다.</p>
    {content.hasAttachment && <p><a className="button" href={`/protected/${slug}/attachment`}>보호 첨부 다운로드</a></p>}
    <Link className="text-link" href="/work/mes-label">← 공개 프로젝트 소개</Link>
  </article>;
}
