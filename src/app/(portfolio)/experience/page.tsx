import Link from "next/link";

export const metadata = { title: "Experience" };

const roles = [
  ["개발과 데이터 연동", "Java 기반 API와 화면을 개발하고, MES 라벨 출력에 필요한 JSON 데이터를 매핑했습니다.", "MES 라벨 시스템", "/work/mes-label"],
  ["환경 구성과 시스템 이관", "AWS EC2와 Tomcat 환경을 구성하고, 기존 시스템의 클라우드 이관과 오픈을 지원했습니다.", "실무 프로젝트", "/work/all"],
  ["운영과 기술 지원", "운영 로그를 분석해 데이터·출력 오류에 대응하고, 고객사 개발자와 사용자를 교육했습니다.", "실무 프로젝트", "/work/all"],
];

export default function Experience() {
  return <section className="page-section">
    <p className="eyebrow">PROFESSIONAL EXPERIENCE</p>
    <h1>구축부터 운영까지, 연결되는 경험</h1>
    <p className="lede">Java 개발, 데이터 연동, 서버 환경 구성과 기술 지원을 담당한 범위를 중심으로 소개합니다.</p>
    <div className="career-grid">
      <article className="panel concept-card career-record">
        <p className="eyebrow hero-label">CAREER RECORD</p>
        <h2>솔비텍</h2><p className="career-team">솔루션개발2팀</p>
        <ul className="career-facts muted">
          <li><time dateTime="2020-10">2020.10</time> – <time dateTime="2025-10">2025.10</time></li><li>과장 / 파트장</li>
          <li>기업·공공 시스템 구축 및 운영</li><li>고객사 기술 지원·교육</li>
        </ul>
        <Link href="/experience/evolution" className="text-link">기술 성장 과정 →</Link>
      </article>
      <ol className="career-roles">
        {roles.map(([title, description, label, href], index) => <li key={title} className="panel concept-card numbered">
          <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
          <div><h2>{title}</h2><p className="muted">{description}</p><Link href={href} className="text-link">관련 사례 · {label} →</Link></div>
        </li>)}
      </ol>
    </div>
  </section>;
}
