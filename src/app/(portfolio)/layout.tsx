import Link from "next/link";
import Image from "next/image";
import { AccessHistoryGuard } from "@/components/access/history-guard";
import { Navigation } from "@/components/layout/navigation";
import { accessSession } from "@/server/access/session";
import { SessionStatus } from "@/components/access/session-status";
import { AdminEndForm } from "@/components/access/admin-end-form";
import { ReaderEndForm } from "@/components/access/reader-end-form";
import { endReading } from "@/server/access/reader-end";
import { PermissionBoundary } from "@/components/access/permission-boundary";
export const dynamic = "force-dynamic";

export default async function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await accessSession();
  return (
    <div className="site">
      <AccessHistoryGuard />
      <a className="skip-link" href="#main-content">
        본문으로 건너뛰기
      </a>
      <header className="site-header">
        <Link href="/" className="brand">
          <Image
            className="brand-wordmark"
            src="/geunyfolio.png"
            alt="GEUNYFOLIO"
            width={2160}
            height={720}
            unoptimized
          />
        </Link>
        <Navigation />
        <div className={`session-badge ${session.role}`}>
          {session.role === "admin" ? (
            <Link href="/admin" prefetch={false}>
              관리자 · 로그인 중
            </Link>
          ) : session.role === "reader" && session.expiresAt ? (
            <Link href="/access/status" prefetch={false}>
              <SessionStatus
                compact
                expiresAt={session.expiresAt}
                serverNow={session.serverNow}
              />
            </Link>
          ) : (
            <span>
              {session.unavailable ? "접근 상태 확인 필요" : "일반 방문"}
            </span>
          )}
        </div>
      </header>
      <main id="main-content" tabIndex={-1}>
        <PermissionBoundary
          expiresAt={session.expiresAt}
          serverNow={session.serverNow}
        >
          {children}
        </PermissionBoundary>
      </main>
      <footer className="site-footer">
        <strong>GEUNYFOLIO</strong>
        <nav aria-label="하단 메뉴">
          <Link href="/contact">Contact</Link>
          <Link href="/privacy">개인정보 안내</Link>
          <a href="https://github.com/yoohyunggeun">GitHub</a>
          {session.role === "admin" ? (
            <>
              <span className="session-badge admin">관리자 로그인 중</span>
              <Link href="/admin" prefetch={false}>
                관리 화면으로 →
              </Link>
              <AdminEndForm />
            </>
          ) : session.role === "reader" && session.expiresAt ? (
            <>
              <Link href="/access/status" prefetch={false}>
                <SessionStatus
                  expiresAt={session.expiresAt}
                  serverNow={session.serverNow}
                />
              </Link>
              <ReaderEndForm compact endAction={endReading} />
            </>
          ) : (
            (process.env.PORTFOLIO_ACCESS_URL ||
              process.env.NODE_ENV === "development") && (
              <Link href="/admin/login" prefetch={false}>
                관리자 로그인 →
              </Link>
            )
          )}
        </nav>
      </footer>
    </div>
  );
}
