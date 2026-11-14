import Link from "next/link";

export const metadata = { title: "Contact" };

const sections = [
  ["/", "Home", "핵심 소개와 경력 요약"],
  ["/experience", "Experience", "경력과 기술 성장 과정"],
  ["/lab", "개인 프로젝트", "분야별 목록과 데모"],
  ["/skills", "Skills", "기술별 경험과 근거"],
];

export default function Contact() {
  return <section className="page-section">
    <p className="eyebrow">LET’S CONNECT</p>
    <h1>경험과 코드로,<br />다음 이야기를 만듭니다.</h1>
    <p className="lede">기업 시스템을 구축·운영한 경험과 직접 구현한 프로젝트를 소개합니다.</p>
    <div className="concept-grid personal-detail">
      <section className="panel concept-card">
        <h2>GitHub</h2>
        <a className="button primary" href="https://github.com/yoohyunggeun">yoohyunggeun ↗</a>
      </section>
      <section className="panel concept-card">
        <h2>포트폴리오 둘러보기</h2>
        <ul className="detail-list">
          {sections.map(([href, title, description]) => <li key={href}>
            <Link className="text-link" href={href}>{title}</Link> · {description}
          </li>)}
        </ul>
      </section>
    </div>
  </section>;
}
