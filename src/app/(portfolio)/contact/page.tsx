import Link from "next/link";
export const metadata = { title: "Contact" };
export default function Contact() {
  return (
    <section className="page-section">
      <p className="eyebrow">LET’S CONNECT</p>
      <h1>
        코드와 기록으로,
        <br />더 자세히 만나보세요.
      </h1>
      <p className="lede">
        기업 시스템을 구축·운영한 경험과 직접 구현한 프로젝트를 소개합니다.
      </p>
      <div className="concept-grid two contact-cards">
        <article className="panel concept-card">
          <p className="eyebrow">CODE</p>
          <h2>GitHub</h2>
          <p className="muted">
            공개한 소스 코드와 구현 기록을 확인할 수 있습니다.
          </p>
          <a
            href="https://github.com/yoohyunggeun"
            className="button"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub 보기 ↗
          </a>
        </article>
        <article className="panel concept-card">
          <p className="eyebrow lab-label">NOTES</p>
          <h2>Notion</h2>
          <p className="muted">
            설계와 제작 과정을 정리한 포트폴리오 문서입니다.
          </p>
          <a
            href="https://app.notion.com/p/40d072143b0980558620cebff3807705?source=copy_link"
            className="button primary"
            target="_blank"
            rel="noopener noreferrer"
          >
            Notion 보기 ↗
          </a>
        </article>
      </div>
      <nav
        className="concept-tabs contact-navigation"
        aria-label="포트폴리오 둘러보기"
      >
        <Link href="/experience">Experience →</Link>
        <Link href="/skills">Skills →</Link>
        <Link href="/build-log">제작 과정 →</Link>
      </nav>
    </section>
  );
}
