export const metadata = { title: "Skills" };
const groups = [
  [
    "Frontend",
    "화면과 상호작용을 구현합니다.",
    "JavaScript · TypeScript · React · Next.js",
    "상태 관리, 비동기 요청, 화면 전환과 반응형 UI",
    "개인 구현",
  ],
  [
    "Backend",
    "요청부터 데이터까지 연결합니다.",
    "Java · Spring Boot · REST API",
    "입력 검증, 인증·권한, DB 연동과 테스트",
    "실무 · 포트폴리오 운영",
  ],
  [
    "Data",
    "업무에 맞게 데이터를 다룹니다.",
    "Oracle · MySQL · JSON · XML",
    "쿼리 작성, 데이터 매핑과 서비스 연동",
    "실무 사용",
  ],
  [
    "Server & Delivery",
    "구축하고 배포하고 운영합니다.",
    "AWS · Linux · Docker · Tomcat / WAS",
    "실행 환경, TLS·권한·로그, 배포와 복구 점검",
    "실무 · 포트폴리오 운영",
  ],
  [
    "Reporting & Integration",
    "업무 데이터를 리포트로 연결합니다.",
    "AIReport · Java · 데이터 매핑",
    "리포트 양식 개발, 제품 적용과 시스템 연동",
    "실무 제품 경험",
  ],
  [
    "Support & Team",
    "기술 지원과 파트 운영을 맡습니다.",
    "개발자 교육 · 유지보수 · 직원 관리",
    "제품 활용 안내, 프로젝트 지원과 파트 운영",
    "실무 · 파트장 경험",
  ],
];
export default function Skills() {
  return (
    <section className="page-section">
      <p className="eyebrow">SKILLS / WHAT I CAN BUILD</p>
      <h1>이런 기술로, 이런 일을 할 수 있습니다.</h1>
      <p className="lede">
        기술 목록과 수행 가능한 일을 함께 보여주고, 실무 경험과 개인 구현을
        구분합니다.
      </p>
      <div className="concept-grid two skills-grid">
        {groups.map(([title, statement, stack, detail, context], i) => (
          <article className="panel concept-card skill-card" key={title}>
            <div className="skill-heading">
              <span aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h2>{title}</h2>
                <p className="capability-statement">{statement}</p>
              </div>
            </div>
            <p>{stack}</p>
            <p className="muted">{detail}</p>
            <p className="eyebrow">{context}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
