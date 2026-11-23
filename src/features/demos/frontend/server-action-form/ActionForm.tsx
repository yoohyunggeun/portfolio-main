"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { submitDemoForm, type FormDemoState } from "./form-action";

const initial: FormDemoState = { status: "idle", message: "" };

function SubmitButton({ retry }: { retry: boolean }) {
  const { pending } = useFormStatus();
  return <button type="submit" className="button primary" disabled={pending}>
    {pending ? "제출 중…" : retry ? "다시 시도" : "제출"}
  </button>;
}

export function ActionForm() {
  const [topic, setTopic] = useState("");
  const [simulateFailure, setSimulateFailure] = useState(true);
  const [state, formAction, pending] = useActionState(submitDemoForm, initial);
  const invalid = !pending && state.status === "invalid";

  return <div className="panel concept-card demo-panel frontend-example">
    <h2>주제 제안 폼</h2>
    <p className="muted">예시 주제를 넣어 서버 검증과 재시도를 테스트하세요. 입력은 서버로 전송됩니다. 실제 개인정보는 입력하지 마세요.</p>
    <form action={formAction} className="demo-form action-demo-form">
      <label htmlFor="action-demo-topic">주제</label>
      <div className="demo-actions">
        <input id="action-demo-topic" name="topic" value={topic} maxLength={60}
          placeholder="예: 키보드 접근성" aria-invalid={invalid}
          aria-describedby="action-demo-feedback" onChange={(event) => setTopic(event.target.value)} />
      </div>
      <label className="action-demo-toggle">
        <input name="simulateFailure" type="checkbox" checked={simulateFailure}
          onChange={(event) => setSimulateFailure(event.target.checked)} />
        일시적 실패 재현
      </label>
      <div className="demo-actions"><SubmitButton retry={state.status === "retry"} /></div>
    </form>
    <p id="action-demo-feedback" role="status" className="example-surface action-demo-feedback"
      data-status={pending ? "pending" : state.status}>
      {pending ? "서버에서 확인 중이에요." : state.message || "제출하면 여기에 결과가 표시돼요."}
    </p>
  </div>;
}
