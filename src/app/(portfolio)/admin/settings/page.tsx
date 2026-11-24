import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminNav } from "@/components/access/admin-nav";
import { resource, sessionExpiry } from "@/server/access/local";

export const metadata = { title: "자료 공개 범위" };

export default async function AccessSettings() {
  if (!await sessionExpiry("admin")) redirect("/admin/login");

  return <section className="page-section">
    <AdminNav current="settings" />
    <p className="eyebrow">ADMIN CONSOLE</p><h1>자료 공개 범위</h1>
    <p className="lede">포트폴리오의 공개 화면과 보호 상세를 확인합니다.</p>
    <div className="concept-grid settings-scope">
      <section className="panel concept-card access-card">
        <p className="eyebrow">항상 공개</p><h2>공개 화면</h2>
        <p className="muted">로그인 없이 바로 열람할 수 있습니다.</p>
        <ul className="detail-list">
          <li><Link className="text-link" href="/">Home</Link></li>
          <li><Link className="text-link" href="/experience">경력 요약</Link></li>
          <li><Link className="text-link" href="/work">대표 프로젝트</Link></li>
        </ul>
      </section>
      <section className="panel concept-card access-card">
        <p className="eyebrow lab-label">권한 필요</p><h2>보호 상세</h2>
        <p className="muted">유효한 열람 세션 또는 관리자 세션으로 접근합니다.</p>
        <Link className="text-link" href={`/protected/${resource.slug}`} prefetch={false}>{resource.title} →</Link>
      </section>
    </div>

  </section>;
}
