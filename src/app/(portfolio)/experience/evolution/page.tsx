import Link from "next/link";

const stages = [
  ["FOUNDATION", "실무 기반", "Java · Oracle · JSON / XML · REST API", "기업 시스템 구축과 운영", "/skills"],
  ["PLATFORM", "환경 현대화 경험", "AWS EC2 · Spring Boot + Tomcat 10", "Java EE → Jakarta EE 전환 지원", "/skills"],
  ["DEVELOPMENT", "개발 역량 확장", "JavaScript · React 프로젝트", "Spring Boot 개발과 생성형 AI 활용", "/lab"],
];

export const metadata = { title: "기술 성장 과정" };

export default function Evolution() {
  return <section className="page-section">
    <p className="eyebrow">TECHNICAL EVOLUTION</p>
    <h1>경험 위에, 새로운 개발 역량을 쌓습니다.</h1>
    <p className="lede">기업 시스템 구축·운영에서 웹 애플리케이션 개발로 확장하는 과정입니다.</p>
    <div className="concept-grid three">{stages.map(([label, title, stack, role, href], index) =>
      <Link href={href} key={label} className="panel concept-card">
        <span className="stage-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
        <p className="eyebrow">{label}</p><h2>{title}</h2>
        <p className="muted">{stack}</p><p className="muted">{role}</p>
      </Link>)}</div>
  </section>;
}
