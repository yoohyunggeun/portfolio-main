"use client";

import { useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { endRecipientPurpose, type PurposeEndState } from "@/server/access/purpose-end";

const initial: PurposeEndState = { status: "idle", message: "" };

export function RecipientPurposeEnd({ id, canEnd, endedAt, blockedReason }: {
  id: string; canEnd: boolean; endedAt: string | null;
  blockedReason: "active_permissions" | "history_unknown" | "no_permission_end" | null;
}) {
  const [state, action, pending] = useActionState(endRecipientPurpose, initial);
  const result = useRef<HTMLParagraphElement>(null);
  const router = useRouter();
  useEffect(() => {
    if (state.status === "idle") return;
    result.current?.focus();
    router.refresh();
  }, [state, router]);
  return <section className="access-card purpose-end" aria-labelledby="purpose-end-title">
    <h3 id="purpose-end-title">제공 목적 종료</h3>
    <p className="muted">자료 제공이 끝난 대상의 목적 종료를 기록합니다. 모든 링크와 열람 세션이 끝나고 이력이 확인된 경우에만 처리할 수 있습니다. 실제 종료 시각과 목적 종료 기록을 확인해 보관 기간을 계산합니다.</p>
    <p>현재 상태: {endedAt ? `목적 종료 기록됨 · ${new Date(endedAt).toLocaleString("ko-KR", { timeZone: "Asia/Seoul" })} (한국 시간)` : "목적 종료가 기록되지 않았습니다."}</p>
    {!canEnd && !endedAt && <p role="status">{blockedReason === "active_permissions" ? "활성 초대 링크 또는 열람 세션이 있어 종료할 수 없습니다." : blockedReason === "no_permission_end" ? "최종 권한 종료 근거를 확인할 수 없어 종료할 수 없습니다." : "완전한 이력을 확인할 수 없어 종료할 수 없습니다."}</p>}
    <form action={action} aria-busy={pending}>
      <input type="hidden" name="id" value={id} />
      <button className="button" disabled={pending || !canEnd || Boolean(endedAt)}>{pending ? "종료 기록 중…" : endedAt ? "제공 목적 종료 기록됨" : "제공 목적 종료"}</button>
    </form>
    {state.message && <p ref={result} tabIndex={-1} role="status" className="access-result">{state.message}</p>}
  </section>;
}
