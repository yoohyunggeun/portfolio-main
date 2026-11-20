import Link from "next/link";
import { TaskList } from "@/components/build-log/task-list";
import { latestEntry } from "@/content/build-log/entries";
import { tasks } from "@/content/build-log/tasks";

export const metadata = { title: "제작 과정" };

export default function BuildLog() {
  const summary = ["visitor-design", "local-access", "build-log", "auth-design", "release"].flatMap((id) => tasks.filter((task) => task.id === id));
  return <section className="page-section">
    <p className="eyebrow">BUILD LOG / CAREER × CODE</p>
    <h1>이 포트폴리오는 이렇게 만들고 있습니다</h1>
    <p className="lede">계획, 현재 단계, AI가 도운 작업과 제작자가 확인한 결과를 공개합니다.</p>
    <section className="panel concept-card secondary-panel log-current">
      <p className="eyebrow">로컬 구현</p>
      <dl><dt>현재 작업</dt><dd>제작 과정과 전체 작업 목록</dd><dt>다음</dt><dd>운영 인증·초대 세션·DB 상세 설계</dd></dl>
    </section>
    <section className="panel concept-card log-block">
      <div className="section-heading"><h2>작업 계획과 진행 상태</h2><Link className="text-link" href="/build-log/tasks">전체 작업 보기 →</Link></div>
      <TaskList items={summary} />
    </section>
    <div className="concept-grid log-notes">
      <section className="panel concept-card log-current"><p className="eyebrow">최근 기록</p><h2>{latestEntry.title}</h2>
        <dl><dt>AI 지원</dt><dd>{latestEntry.assistance}</dd><dt>직접 검토</dt><dd>{latestEntry.review}</dd><dt>근거</dt><dd>{latestEntry.evidence}</dd></dl>
      </section>
      <section className="panel concept-card"><p className="eyebrow lab-label">기획 후보</p><h2>AI 제작 로그 요약</h2>
        <p className="muted">공개 가능한 작업 기록으로 진행 상황 요약 초안을 만들고, 제작자가 상태와 근거를 확인한 뒤 게시하는 기능입니다.</p>
      </section>
    </div>
  </section>;
}
