"use client";

import { useOptimistic, useState, useTransition } from "react";
import { submitLike } from "./like-action";

export function OptimisticLike() {
  const [confirmed, setConfirmed] = useState(false);
  const [liked, setOptimisticLike] = useOptimistic(confirmed);
  const [simulateFailure, setSimulateFailure] = useState(false);
  const [message, setMessage] = useState("");
  const [failed, setFailed] = useState(false);
  const [pending, startTransition] = useTransition();

  function toggleLike() {
    if (pending) return;
    const next = !confirmed;
    setMessage("");
    setFailed(false);

    startTransition(async () => {
      setOptimisticLike(next);
      try {
        const result = await submitLike(next, simulateFailure);
        if (result.ok) {
          startTransition(() => {
            setConfirmed(result.liked);
            setMessage("서버에서 변경을 확인했어요.");
          });
          return;
        }
      } catch {
        // A rejected request follows the same recovery path.
      }

      setFailed(true);
      setMessage("요청이 실패해 이전 좋아요 상태로 돌아갔어요.");
    });
  }

  return <div className="panel concept-card demo-panel frontend-example">
    <h2>좋아요 미리 반영</h2>
    <div className="example-surface optimistic-post">
      <h3>키보드로 둘러보는 포트폴리오</h3>
      <p className="muted">작은 인터랙션에 접근성을 더한 작업 기록이에요.</p>
      <div className="demo-actions">
        <button type="button" className="button optimistic-like" aria-label="좋아요"
          aria-pressed={liked} disabled={pending} onClick={toggleLike}>
          <span aria-hidden="true">{liked ? "♥" : "♡"}</span> 좋아요
        </button>
        <span aria-label="좋아요 수">{24 + Number(liked)}개</span>
      </div>
    </div>
    <label className="action-demo-toggle">
      <input type="checkbox" checked={simulateFailure} disabled={pending}
        onChange={(event) => setSimulateFailure(event.target.checked)} />
      서버 실패 재현
    </label>
    <p role="status" className="example-surface action-demo-feedback"
      data-status={pending ? "pending" : failed ? "retry" : message ? "success" : "idle"}>
      {pending ? "화면에 먼저 반영했어요. 서버 응답을 기다리는 중이에요." : message || "좋아요를 눌러 서버 응답 전의 변화를 확인하세요."}
    </p>
  </div>;
}
