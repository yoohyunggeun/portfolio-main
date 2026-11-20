import { notFound } from "next/navigation";
import { loginPreview } from "@/server/access/actions";
import { isLocalPreview } from "@/server/access/local";

export default async function Login({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { springAccess } = await import("@/server/access/backend");
  if (springAccess()) return <div className="page-section access-shell"><form action={loginPreview} className="panel concept-card access-card">
    <h1>관리자 로그인</h1>
    {(await searchParams).error === "google" && <p role="alert">Google 로그인을 완료하지 못했습니다. 다시 시도해 주세요.</p>}
    <button className="button primary">Google로 로그인</button>
  </form></div>;
  if (!await isLocalPreview()) notFound();
  return <div className="page-section access-shell">
    <form action={loginPreview} className="panel concept-card access-card">
      <p className="eyebrow">CAREER × CODE / ADMIN</p><h1>관리자 로그인</h1>
      <p className="muted">로컬 시안 검증용 관리자 세션입니다. 예시 요청만 사용해 주세요.</p>
      <button className="button primary">로컬 관리자 미리보기 시작</button>
    </form>
  </div>;
}
