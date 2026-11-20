import "server-only";

import { BoundaryControls } from "./BoundaryControls";

export function BoundaryDemo() {
  const lesson = { title: "Next.js 실행 경계", topics: ["서버 렌더링", "클라이언트 상태", "서버 검증"] };

  return <div className="panel concept-card demo-panel frontend-example boundary-demo">
    <section className="example-surface">
      <h2>서버 컴포넌트</h2>
      <p>{lesson.title}</p>
      <ul className="lab-tech-tags" aria-label="학습 주제">
        {lesson.topics.map((topic) => <li key={topic}>{topic}</li>)}
      </ul>
    </section>
    <BoundaryControls />
  </div>;
}
