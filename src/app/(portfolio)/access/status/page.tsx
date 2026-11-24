import Link from "next/link";
import { accessSession } from "@/server/access/session";
import { SessionStatus } from "@/components/access/session-status";
import { ReaderEndForm } from "@/components/access/reader-end-form";
import { endReading } from "@/server/access/reader-end";
export const dynamic = "force-dynamic";
export const metadata = { title: "열람 상태" };
export default async function Status() {
  const session = await accessSession();
  return (
    <section className="page-section access-shell">
      <p className="eyebrow">ACCESS STATUS</p>
      <h1>열람 상태 확인</h1>
      <div className="panel concept-card access-card">
        {session.role === "reader" && session.expiresAt ? (
          <>
            <SessionStatus
              expiresAt={session.expiresAt}
              serverNow={session.serverNow}
            />
            <p>
              {session.projectScope === "ALL"
                ? "전체 프로젝트와 보호 자료 열람 권한"
                : "이 초대에 지정된 보호 자료 열람 권한"}
            </p>
            {session.allowedResources.includes("mes-case") && (
              <Link
                className="button primary"
                href="/protected/mes-case"
                prefetch={false}
              >
                허용된 보호 자료 보기 →
              </Link>
            )}
            {session.projectScope === "ALL" && (
              <Link className="button" href="/work" prefetch={false}>
                프로젝트 살펴보기 →
              </Link>
            )}
            <ReaderEndForm endAction={endReading} />
          </>
        ) : session.role === "admin" ? (
          <>
            <h2>관리자로 로그인 중입니다</h2>
            <Link className="button" href="/admin">
              관리 화면으로 →
            </Link>
          </>
        ) : (
          <>
            <h2>
              {session.unavailable
                ? "열람 상태를 확인할 수 없습니다"
                : "유효한 열람 세션이 없습니다"}
            </h2>
            <p className="muted">
              만료되거나 종료된 세션은 초대 링크에서 다시 확인해 주세요.
            </p>
            <Link className="button primary" href="/access">
              상세 자료 열람 요청
            </Link>
          </>
        )}
        <a href="/access/status" className="text-link">
          상태 새로 확인
        </a>
      </div>
    </section>
  );
}
