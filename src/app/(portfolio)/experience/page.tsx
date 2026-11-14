import Link from "next/link";

export const metadata = { title: "Experience" };

const roles = [
  ["개발과 데이터 연동", "Java 기반 API·화면 개발, JSON / XML 데이터 매핑", "기술 성장 과정", "/experience/evolution"],
  ["환경 구성과 시스템 이관", "WAS · AWS EC2 환경 구성, 클라우드 이관 지원", "실무 기술 보기", "/skills"],
  ["오픈 지원과 장애 대응", "로그 분석, 운영 안정화, 개발자·사용자 교육", "실무 기술 보기", "/skills"],
];

export default function Experience() {
  return <section className="page-section">
    <p className="eyebrow">PROFESSIONAL EXPERIENCE</p>
    <h1>구축부터 운영까지, 연결되는 경험</h1>
    <p className="lede">Java 개발, 데이터 연동, 서버 환경 구성과 기술 지원을 담당한 범위를 중심으로 소개합니다.</p>
    <div className="career-grid">
      <article className="panel concept-card">
        <p className="eyebrow hero-label">CAREER RECORD</p>
        <h2>기업·공공 시스템 개발</h2>
        <ul className="career-facts muted">
          <li>2020.10 – 2025.10</li><li>과장 / 파트장</li>
          <li>기업·공공 시스템 구축 및 운영</li><li>고객사 기술 지원·교육</li>
        </ul>
        <Link href="/experience/evolution" className="text-link">기술 성장 과정 →</Link>
      </article>
      <ol className="career-roles">
        {roles.map(([title, description, label, href], index) => <li key={title} className="panel concept-card numbered">
          <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
          <div><h2>{title}</h2><p className="muted">{description}</p><Link href={href} className="text-link">{label} →</Link></div>
        </li>)}
      </ol>
    </div>
  </section>;
}
