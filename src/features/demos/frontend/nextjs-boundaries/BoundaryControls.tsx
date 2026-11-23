"use client";

import { useActionState, useState } from "react";
import { validateNote, type NoteResult } from "./boundary-action";

const initial: NoteResult = { status: "idle", message: "입력한 메모의 길이를 서버에서 확인합니다." };

export function BoundaryControls() {
  const [marked, setMarked] = useState(false);
  const [note, setNote] = useState("");
  const [result, submit, pending] = useActionState(validateNote, initial);

  return <>
    <section className="example-surface">
      <h2><code>"use client"</code></h2>
      <div className="demo-actions">
        <button type="button" className="button" aria-pressed={marked} onClick={() => setMarked((value) => !value)}>
          읽음 표시
        </button>
        <span className="muted">{marked ? "읽음" : "읽지 않음"}</span>
      </div>
    </section>
    <section className="example-surface">
      <h2><code>"use server"</code></h2>
      <p className="muted">입력은 서버로 전송해 검증합니다. 실제 개인정보는 입력하지 마세요.</p>
      <form action={submit} className="demo-form action-demo-form">
        <label htmlFor="boundary-note">검증할 메모</label>
        <div className="demo-actions">
          <input id="boundary-note" name="note" value={note} maxLength={60}
            aria-describedby="boundary-feedback"
            onChange={(event) => setNote(event.target.value)} />
          <button type="submit" className="button primary" disabled={pending}>
            {pending ? "검증 중…" : "서버 검증"}
          </button>
        </div>
      </form>
      <p id="boundary-feedback" role="status" className="action-demo-feedback" data-status={pending ? "pending" : result.status}>
        {pending ? "서버 응답을 기다리는 중이에요." : result.message}
      </p>
    </section>
  </>;
}
