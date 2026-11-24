import Link from "next/link";
import {
  representativeWork,
  workRecordCount,
  workRoleLabel,
} from "@/content/projects/work-records";
import { labAreas } from "@/content/projects/lab-areas";
import { HomeAccessNotice } from "@/components/access/home-access-notice";
import { accessSession, canReadProjects } from "@/server/access/session";
import { SessionStatus } from "@/components/access/session-status";
import { LockIcon } from "@/components/access/lock-icon";

export const dynamic = "force-dynamic";

function LockedCards() {
  return (
    <div className="home-list grid gap-3 sm:grid-cols-2" aria-hidden="true">
      {Array.from({ length: 4 }, (_, index) => (
        <div className="panel locked-project" key={index}>
          <span />
          <span />
          <span />
          <i>
            <LockIcon />
          </i>
        </div>
      ))}
    </div>
  );
}

export default async function Home() {
  const session = await accessSession();
  const admin = await canReadProjects();

  return (
    <div className="home home-v22">
      <section className="hero">
        <div>
          <p className="eyebrow">웹 개발 · 서버 구축·운영 · 고객 기술 제안</p>
          <h1>
            고객 앞에서는 해결책을, 코드 앞에서는 구현을, 현장에서는 운영을
            맡습니다.
          </h1>
          <div className="actions">
            <Link
              prefetch={false}
              href="/experience"
              className="button primary"
            >
              경력 살펴보기 →
            </Link>
            <Link prefetch={false} href="/lab" className="button">
              개인 프로젝트 →
            </Link>
          </div>
        </div>
        <aside className="panel concept-card home-capabilities">
          <h2>역량 한눈에 보기</h2>
          <p className="eyebrow">실무 · 개발·연동 · 구축·운영 · 기술 지원</p>
          <p className="eyebrow lab-label">
            개인 · Frontend · Backend · Server · AI / LLM
          </p>
          <Link prefetch={false} href="/build-log" className="text-link">
            제작 과정 보기 →
          </Link>
        </aside>
      </section>
      <section className="home-representative" aria-labelledby="work-featured">
        <div className="section-heading">
          <h2 id="work-featured">대표 실무 프로젝트</h2>
          {admin ? (
            <Link className="text-link" href="/work/all" prefetch={false}>
              전체 실무 기록 보기 →
            </Link>
          ) : (
            <p className="muted">실무 기록 {workRecordCount}개</p>
          )}
        </div>
        {admin ? (
          <ul className="home-list grid gap-3 sm:grid-cols-2">
            {(await representativeWork(true)).map((record) => (
              <li key={record.id}>
                <Link
                  className="panel project-card"
                  href={`/work/${record.slug}`}
                  prefetch={false}
                >
                  <span>
                    <small className="eyebrow lab-label">
                      {workRoleLabel(record.roles[0])}
                    </small>
                    <strong>{record.title}</strong>
                    <span className="muted">{record.summary}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <LockedCards />
        )}
      </section>
      {session.role === "reader" && session.expiresAt ? (
        <aside className="panel home-access-notice">
          <SessionStatus
            expiresAt={session.expiresAt}
            serverNow={session.serverNow}
          />
          <Link href="/access/status" className="button" prefetch={false}>
            열람 상태 확인 →
          </Link>
        </aside>
      ) : session.role === "admin" ? (
        <aside className="panel home-access-notice">
          <p>관리자 세션 활성</p>
          <Link href="/admin" className="button" prefetch={false}>
            관리 화면으로 →
          </Link>
        </aside>
      ) : (
        <HomeAccessNotice />
      )}
      <section className="home-representative" aria-labelledby="lab-featured">
        <div className="section-heading">
          <h2 id="lab-featured">대표 개인 프로젝트</h2>
          {admin ? (
            <Link prefetch={false} className="text-link" href="/lab">
              분야별 전체 보기 →
            </Link>
          ) : (
            <p className="muted">개인 프로젝트 {labAreas.length}개 분야</p>
          )}
        </div>
        {admin ? (
          <ul className="home-list grid gap-3 sm:grid-cols-2">
            {labAreas.map(({ slug, title, description, examples, status }) => (
              <li key={slug}>
                <Link
                  prefetch={false}
                  className="panel project-card"
                  href={`/lab/${slug}`}
                >
                  <span>
                    <small className="eyebrow lab-label">
                      {slug === "frontend" ? "구현 기능 12개" : status}
                    </small>
                    <strong>{title}</strong>
                    <span className="muted">
                      {slug === "frontend" && `${title} · `}
                      {examples}
                      {status && ` · ${status}`}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <LockedCards />
        )}
      </section>
    </div>
  );
}
