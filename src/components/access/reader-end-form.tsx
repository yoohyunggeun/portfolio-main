"use client";

import { useActionState, useId } from "react";

export type ReaderEndState = { error?: string };

export function ReaderEndForm({ endAction }: {
  endAction: (previous: ReaderEndState) => Promise<ReaderEndState>;
}) {
  const [state, action, pending] = useActionState(endAction, {});
  const descriptionId = useId();
  return <form action={action} className="panel concept-card access-card" aria-busy={pending}>
    <p id={descriptionId} className="muted">
      열람을 마쳤다면 직접 종료할 수 있습니다. 다시 열려면 유효한 초대 링크에서 열람을 시작해야 합니다.
    </p>
    <button className="button" disabled={pending} aria-describedby={descriptionId}>
      {pending ? "열람 종료 중…" : state.error ? "열람 종료 다시 시도" : "열람 종료"}
    </button>
    {pending && <p role="status">열람을 종료하고 있습니다.</p>}
    {!pending && state.error && <p role="alert">{state.error}</p>}
  </form>;
}