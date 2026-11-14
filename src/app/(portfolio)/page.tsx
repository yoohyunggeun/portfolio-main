import Link from "next/link";


function LockedCards() {
  return <>
    <p className="sr-only">대표 목록은 관리자만 볼 수 있습니다.</p>
    <div className="home-list grid gap-3 sm:grid-cols-2" aria-hidden="true">
      {Array.from({ length: 4 }, (_, index) => <div className="panel locked-project" key={index}><span /><span /></div>)}
    </div>
  </>;
}

export default function Home() {
  return <div className="home home-v18">
    <section className="hero">
      <div>
        <p className="eyebrow">웹 개발 · 서버 구축·운영 · 고객 기술 제안</p>
        <h1>고객 앞에서는 해결책을, 코드 앞에서는 구현을, 현장에서는 운영을 맡습니다.</h1>
        <div className="actions">
          <Link href="/experience" className="button primary">경력 살펴보기 →</Link>
          <Link href="/lab" className="button">개인 프로젝트 →</Link>
        </div>
      </div>
      <aside className="panel concept-card home-capabilities">
        <h2>역량 한눈에 보기</h2>
        <p className="eyebrow">실무 · 구축 · 연동 · 운영</p>
        <p className="eyebrow lab-label">개인 · Frontend · Backend · Server · AI / LLM</p>
      </aside>
    </section>
    <section className="home-representative" aria-labelledby="work-featured">
      <div className="section-heading">
        <h2 id="work-featured">대표 실무 프로젝트</h2>
      </div>
      <LockedCards />
    </section>
    <aside className="panel home-access-notice"><h2>프로젝트 상세 자료</h2><p className="muted">상세 자료 열람 요청은 준비 중입니다.</p></aside>
    <section className="home-representative" aria-labelledby="lab-featured">
      <div className="section-heading">
        <h2 id="lab-featured">대표 개인 프로젝트</h2>
      </div>
      <LockedCards />
    </section>
  </div>;
}
