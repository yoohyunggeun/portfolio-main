import Link from "next/link";
import { notFound } from "next/navigation";
import { RequestForm } from "@/components/access/forms";
import { isLocalPreview, resource } from "@/server/access/local";

export default async function Access({ searchParams }: { searchParams: Promise<{ reason?: string; resource?: string }> }) {
  const { springAccess } = await import("@/server/access/backend");
  const enabled = springAccess() || await isLocalPreview();
  const query = await searchParams;
  if (query.resource && query.resource !== resource.slug) notFound();
  return <div className="page-section access-shell">
    {query.reason === "unavailable" && <p role="status">접근 서비스를 확인할 수 없습니다. 잠시 후 다시 시도해 주세요.</p>}
    {query.reason === "invite" && <p className="panel concept-card" role="status">초대 링크가 만료되었거나 이미 사용되었습니다.</p>}
    {enabled ? <RequestForm title="전체 보호 자료" /> : <h1>현재 열람을 요청할 수 없습니다.</h1>}

    {enabled && <Link className="text-link" href="/admin/login">관리자 로그인 →</Link>}
  </div>;
}
