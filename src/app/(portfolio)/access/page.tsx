import Link from "next/link";
import { FocusHeading } from "@/components/access/focus-heading";
import { notFound } from "next/navigation";
import { RequestForm } from "@/components/access/forms";
import { isLocalPreview, resource } from "@/server/access/local";

export default async function Access({ searchParams }: { searchParams: Promise<{ reason?: string; resource?: string }> }) {
  const { springAccess } = await import("@/server/access/backend");
  const enabled = springAccess() || await isLocalPreview();
  const query = await searchParams;
  if (query.resource && query.resource !== resource.slug) notFound();
  if (query.reason === "ended") return <section className="page-section access-shell">
    <div className="panel concept-card access-card" role="status">
      <FocusHeading>열람을 종료했습니다</FocusHeading>
      <p>이 열람 세션으로는 보호 자료에 다시 접근할 수 없습니다.</p>
      <Link className="button" href="/">홈으로 돌아가기</Link>
      <Link className="text-link" href="/access">다시 열람 요청 →</Link>
    </div>
  </section>;
  return <div className="page-section access-shell">
    {query.reason === "unavailable" && <p role="status">접근 서비스를 확인할 수 없습니다. 잠시 후 다시 시도해 주세요.</p>}
    {query.reason === "invite" && <p className="panel concept-card" role="status">초대 링크가 만료되었거나 이미 사용되었습니다.</p>}
    {enabled ? <RequestForm title="전체 보호 자료" /> : <h1>현재 열람을 요청할 수 없습니다.</h1>}

    {enabled && <Link className="text-link" href="/admin/login">관리자 로그인 →</Link>}
  </div>;
}
