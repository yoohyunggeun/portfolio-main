import Link from "next/link";

export default function Home() {
  return <div className="home">
    <section className="hero">
      <div>
        <p className="eyebrow hero-label"><span className="desktop-copy">JAVA EXPERIENCE, MODERN DEVELOPMENT</span><span className="mobile-copy">CAREER + DEVELOPMENT</span></p>
        <h1>시스템을 이해하고,<br />서비스를 구현합니다.</h1>
        <p className="lede"><span className="desktop-copy">Java 기반 기업 시스템 구축·연동·운영 경험을 바탕으로<br className="desktop-break" /> 웹 개발과 AI 연동으로 역량을 넓혀갑니다.</span><span className="mobile-copy">Java 실무 경험을 기반으로<br />현대적 웹 개발로 확장합니다.</span></p>
        <div className="actions">
          <Link href="/experience" className="button primary desktop-copy">경력 살펴보기 <span aria-hidden="true">→</span></Link>
          <Link href="/lab" className="button desktop-copy">개인 프로젝트 <span aria-hidden="true">→</span></Link>
          <Link href="/experience" className="button primary mobile-copy">경력 살펴보기 <span aria-hidden="true">→</span></Link>
        </div>
      </div>
      <aside className="panel overview" aria-label="포트폴리오 구성">
        <h2 className="desktop-copy">CAREER × CODE</h2>
        <Link href="/experience">
          <span className="eyebrow"><span className="desktop-copy">01 / </span>PROFESSIONAL</span>
          <strong><span className="desktop-copy">구축 · 연동 · 운영</span><span className="mobile-copy">기업 시스템 경험</span></strong>
          <span className="muted desktop-copy">Java / Oracle / WAS / AWS EC2</span><span className="muted mobile-copy">경력과 직접 수행 역할 →</span>
        </Link>
        <Link href="/lab" className="desktop-copy">
          <span className="eyebrow lab-label">02 / DEVELOPMENT LAB</span>
          <strong>Frontend · Backend · AI</strong>
          <span className="muted">JavaScript / React / Spring Boot 확장</span>
        </Link>
      </aside>
    </section>
  </div>;
}
