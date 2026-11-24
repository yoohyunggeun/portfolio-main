import Link from "next/link";
export const metadata = { title: "Experience" };
const roles = [
  [
    "Java 화면·리포트 개발",
    "업무 데이터를 화면과 보고서로 연결합니다.",
    "Java 기반 화면 개발, 데이터 매핑과 리포트 양식 제작·개발을 담당했습니다.",
  ],
  [
    "제품 설치·운영 지원",
    "온프레미스와 클라우드 환경에 맞춰 적용합니다.",
    "고객 환경의 제품 설치·유지보수와 프로젝트 내 서드파티 제품 지원을 수행했습니다.",
  ],
  [
    "개발자 교육·파트 운영",
    "제품 활용을 돕고, 팀의 업무를 운영합니다.",
    "개발자 교육을 진행하고, 파트장으로서 직원 관리와 파트 운영을 담당했습니다.",
  ],
];
const duties = [
  ["화면 개발", "Java 기반 업무 화면의 조회와 입력 흐름을 구현했습니다."],
  ["데이터 매핑", "업무 데이터를 보고서 양식과 화면에 맞게 연결했습니다."],
  [
    "Report 제작·개발",
    "업무 목적에 맞는 리포트 양식과 호출 흐름을 개발했습니다.",
  ],
  [
    "제품 설치·유지보수",
    "온프레미스·클라우드 환경에 제품을 설치하고 운영 이슈에 대응했습니다.",
  ],
  [
    "개발자 교육",
    "고객사 개발자가 제품을 적용하고 활용할 수 있도록 교육했습니다.",
  ],
  [
    "직원 관리·파트 운영",
    "파트장으로서 업무를 조율하고 프로젝트 내 제품 기술 지원을 담당했습니다.",
  ],
];
export default function Experience() {
  return (
    <section className="page-section experience-v31">
      <p className="eyebrow">EXPERIENCE / CAREER & EDUCATION</p>
      <h1>리포팅 제품을, 고객의 업무에 연결해 온 경험</h1>
      <p className="lede">
        AIReport 기반 화면·데이터·리포트 개발부터 제품 구축·기술 지원·파트
        운영까지 담당했습니다.
      </p>
      <div className="career-grid">
        <article className="panel concept-card career-record">
          <p className="eyebrow hero-label">CAREER RECORD</p>
          <h2>솔비텍</h2>
          <p className="career-team">솔루션개발2팀</p>
          <ul className="career-facts muted">
            <li>
              <time dateTime="2020-10">2020.10</time> –{" "}
              <time dateTime="2025-10">2025.10</time>
            </li>
            <li>과장 / 파트장</li>
            <li>담당 제품 · AIReport</li>
            <li>개발·구축·유지보수·교육</li>
          </ul>
          <Link className="text-link" href="#product-experience">
            제품 적용 · 파트 운영 ↓
          </Link>
        </article>
        <ol className="career-roles">
          {roles.map(([title, lead, detail], i) => (
            <li className="panel concept-card numbered" key={title}>
              <span aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h2>{title}</h2>
                <p className="capability-statement">{lead}</p>
                <p className="muted">{detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
      <section className="experience-section" id="product-experience">
        <p className="eyebrow">PRODUCT EXPERIENCE / MY RESPONSIBILITY</p>
        <h2>AIReport 제품 경험과 담당 범위</h2>
        <div className="panel concept-card product-context">
          <h3>업무 데이터를 리포트로 연결하는 제품</h3>
          <p className="muted">
            AIReport는 보고서 제작·조회와 전자문서 변환을 다루는 리포팅
            제품입니다. 아래 항목은 제품 자체 기능과 구분한 제가 담당한
            업무입니다.
          </p>
          <a
            className="text-link"
            href="https://www.solbiguide.com/main.do"
            target="_blank"
            rel="noopener noreferrer"
          >
            AIReport 공식 제품 맥락 ↗
          </a>
        </div>
        <div className="concept-grid two responsibility-grid">
          {duties.map(([title, detail]) => (
            <article className="panel concept-card" key={title}>
              <h3>{title}</h3>
              <p className="muted">{detail}</p>
            </article>
          ))}
        </div>
      </section>
      <section
        className="experience-section"
        aria-labelledby="internship-title"
      >
        <h2 id="internship-title">인턴 경험</h2>
        <article className="panel concept-card experience-row">
          <div className="experience-meta">
            <p className="eyebrow hero-label experience-period">2019.05 – 2019.08</p>
            <h3>지엔기술</h3>
            <p className="muted">개발팀 · 인턴/수습</p>
          </div>
          <div>
            <h3>사내 업무보고 관리 시스템</h3>
            <p className="capability-statement">
              일일 업무의 기록을 주간 보고 흐름까지 연결했습니다.
            </p>
            <p className="muted">
              일일 업무보고 작성·수정·삭제 페이지와 조회수·요일별 보고 내용 조회
              기능을 개발했습니다. 일일 보고를 주간 업무보고서에서 함께 확인하고,
              하루 업무의 진행 상황과 추가 작업을 체크하는 흐름을 화면에 반영했습니다.
            </p>
            <p className="muted">
              Java·Spring MVC와 JSP로 업무 화면을 구성하고, jQuery·AJAX 비동기
              처리와 MyBatis 기반 데이터 연동을 경험했습니다.
            </p>
            <p className="text-link">
              Java · Spring MVC · JSP · jQuery · AJAX · MyBatis · Altibase · Oracle SQL
            </p>
          </div>
        </article>
      </section>
      <section
        className="experience-section"
        id="education"
        aria-labelledby="education-title"
      >
        <h2 id="education-title">교육 이력</h2>
        <article className="panel concept-card experience-row">
          <p className="eyebrow hero-label experience-period">2020.02 – 2020.08</p>
          <div>
            <h3>빅데이터를 활용한 지능형 웹 개발자 양성과정</h3>
            <p className="muted">비트교육센터 · 수료</p>
            <p className="capability-statement">
              데이터와 화면을 연결하는 웹 개발의 기본기를 팀 프로젝트로 익혔습니다.
            </p>
            <p className="muted">
              Java·Spring 기반 웹 개발과 JSP·jQuery, SQL·프레임워크 활용을
              학습했습니다. 팀 프로젝트에서 웹 서비스의 기획과 화면 구성부터
              개발까지 실습하며, 요구사항을 기능과 데이터 흐름으로 구체화하는
              과정을 경험했습니다.
            </p>
          </div>
        </article>
      </section>
      <Link href="/experience/evolution" className="text-link">
        기존 기술 성장 과정 보기 →
      </Link>
    </section>
  );
}
