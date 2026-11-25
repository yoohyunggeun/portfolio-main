import Link from "next/link";
import { TaskList } from "@/components/build-log/task-list";
import { currentTasks } from "@/content/build-log/releases";
import { BuildHistory } from "@/components/build-log/history";
export const metadata = { title: "제작 과정" };
export default function BuildLog() {
  return (
    <section className="page-section">
      <p className="eyebrow">BUILD LOG / GEUNYFOLIO</p>
      <h1>최신 상태도, 지나온 과정도 남깁니다.</h1>
      <p className="lede">
        날짜별 기록 안에서 기능·권한·서버·검증을 나눠 보고, 필요한 항목만
        펼쳐봅니다.
      </p>
      <section className="panel concept-card log-current current-release">
        <span className="log-status">최신 운영 · UI v3.3</span>
        <div>
          <h2>UI v3.3 운영 반영·확인 완료</h2>
          <p className="muted">
            2026.11.25 · 두 테마 · 중앙 슬라이드 · 입자 효과 · Storybook
          </p>
        </div>
      </section>
      <aside className="panel concept-card current-ui-review">
        <span className="log-status">개발·운영 검증을 구분해 기록합니다</span>
        <p>
          UI v3.3을 2026.11.25 서울 리전에 반영하고 PC·모바일 두 테마와
          기존 권한 경계·정상 관리자 조회·로그아웃 후 접근 차단을 확인했습니다.
          기존 고객 데이터는 변경·삭제하지 않았습니다. Storybook·합성 역할 검사는
          개발 환경 결과이며 운영의 새 권한 발급 시험과 혼동하지 않습니다.
          과거 기록과 합성·운영 검증 결과는 아래에서 구분해 확인할 수 있습니다.
        </p>
      </aside>
      <BuildHistory />
      <details className="panel concept-card log-block">
        <summary>현재 작업 계획과 상태</summary>
        <TaskList items={currentTasks} />
        <Link className="text-link" href="/build-log/tasks">
          전체 작업·단계·상태 필터 →
        </Link>
      </details>
      <section className="concept-grid two log-notes">
        <article className="panel concept-card">
          <h2>AI 지원</h2>
          <p className="muted">
            화면·코드 초안, 테스트 자동화와 기록 정리에 AI의 도움을 받았습니다.
          </p>
        </article>
        <article className="panel concept-card">
          <h2>소유자 판단</h2>
          <p className="muted">
            공개 범위·문구·UI 승인과 운영 반영에 대한 선택은 제작자가
            결정합니다.
          </p>
        </article>
      </section>
      <aside className="panel concept-card log-principles">
        <h2>기록 원칙</h2>
        <p className="muted">
          최신 요약과 과거 본문을 구분합니다. 정정은 날짜·이유와 함께 새
          이력으로 연결하고, 당시 상태를 현재 결과로 덮어쓰지 않습니다.
        </p>
        <p className="muted">
          AI 제작 로그 자동 요약은 기획 후보이며, 현재 이 기록은 검토해 작성한
          내용입니다.
        </p>
      </aside>
    </section>
  );
}
