import Link from "next/link";
import Image from "next/image";
import { AccessHistoryGuard } from "@/components/access/history-guard";
import { Navigation } from "@/components/layout/navigation";

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return <div className="site">
    <AccessHistoryGuard />
    <a className="skip-link" href="#main-content">본문으로 건너뛰기</a>
    <header className="site-header">
      <Link href="/" className="brand"><Image className="brand-wordmark" src="/geunyfolio.png" alt="GEUNYFOLIO" width={2160} height={720} unoptimized /></Link>
      <Navigation />
    </header>
    <main id="main-content" tabIndex={-1}>{children}</main>
    <footer className="site-footer">
      <span>SOFTWARE ENGINEER / JAVA · WEB · SYSTEMS</span>
      <nav aria-label="하단 메뉴">
        <Link href="/contact">Contact</Link>
        <Link href="/privacy">개인정보 안내</Link>
        <a href="https://github.com/yoohyunggeun">GitHub</a>
        {(process.env.PORTFOLIO_ACCESS_URL || process.env.NODE_ENV === "development") && <Link href="/admin/login">관리자 로그인</Link>}
      </nav>
    </footer>
  </div>;
}
