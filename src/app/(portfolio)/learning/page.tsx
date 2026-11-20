import Link from "next/link";

export const metadata = { title: "Learning" };

export default function Learning() {
  return <section className="page-section">
    <p className="eyebrow">LEARNING / EDUCATION</p>
    <h1>학습을, 다음 결과물로 연결합니다.</h1>
    <p className="lede">교육 이력과 프로젝트에서 구현한 기능을 살펴볼 수 있습니다.</p>
    <div className="concept-grid personal-detail">
      <section className="panel concept-card">
        <p className="eyebrow">EDUCATION</p>
        <h2>웹 서비스 구현 교육</h2>
        <p>비트컴퓨터IT교육센터</p>
        <p className="muted"><time dateTime="2020-02">2020.02</time> – <time dateTime="2020-08">2020.08</time></p>
      </section>
      <section className="panel concept-card secondary-panel">
        <p className="eyebrow">LEARNING → BUILD</p>
        <h2>JavaScript 구현 기록</h2>
        <ul className="detail-list">
          <li><Link className="text-link" href="/lab/projects/todolist">TodoList · 목록과 상태 필터 →</Link></li>
          <li><Link className="text-link" href="/lab/projects/shellgame">ShellGame · 라운드와 기록 관리 →</Link></li>
        </ul>
      </section>
    </div>
  </section>;
}
