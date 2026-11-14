import Link from "next/link";

export const metadata = { title: "Skills" };

const groups = [
  { title: "실무 사용", skills: "Java · JSON / XML · REST API · Oracle", href: "/experience", evidence: "경력 요약" },
  { title: "실무 환경", skills: "AWS EC2 · Tomcat / WAS · Spring Boot 환경", href: "/experience/evolution", evidence: "기술 성장 과정" },
  { title: "개인 개발", skills: "JavaScript · HTML / CSS · React", href: "/lab/frontend", evidence: "Frontend 프로젝트" },
  { title: "학습·후보", skills: "Spring Boot 개발 · AI 활용", href: "/lab", evidence: "개인 프로젝트" },
];

export default function Skills() {
  return <section className="page-section">
    <p className="eyebrow">SKILLS / EVIDENCE</p>
    <h1>기술 이름보다, 사용한 맥락을 보여줍니다.</h1>
    <div className="grid gap-4 sm:grid-cols-2">
      {groups.map(({ title, skills, href, evidence }) => <article className="panel content-panel" key={title}>
        <h2>{title}</h2>
        <p className="muted">{skills}</p>
        <Link className="text-link" href={href}>{evidence} →</Link>
      </article>)}
    </div>
  </section>;
}
