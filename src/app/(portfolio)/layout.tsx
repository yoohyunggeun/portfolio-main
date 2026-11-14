import Link from "next/link";
import { Navigation } from "@/components/layout/navigation";

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return <div className="site">
    <a className="skip-link" href="#main-content">본문으로 건너뛰기</a>
    <header className="site-header">
      <Link href="/" className="brand"><strong>YG</strong><span>CAREER × CODE</span></Link>
      <Navigation />
    </header>
    <main id="main-content" tabIndex={-1}>{children}</main>
    <footer className="site-footer">
      <span>SOFTWARE ENGINEER / JAVA · WEB · SYSTEMS</span>
      <nav aria-label="하단 메뉴">
        <Link href="/contact">Contact</Link>
        <a href="https://github.com/yoohyunggeun">GitHub</a>
      </nav>
    </footer>
  </div>;
}
