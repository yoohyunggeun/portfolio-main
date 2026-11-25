"use client";

import { useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { endRecipientPurpose, type PurposeEndState } from "@/server/access/purpose-end";

const initial: PurposeEndState = { status: "idle", message: "" };

export function RecipientPurposeEnd({ id, canEnd, endedAt, blockedReason, neverIssued = false }: {
  id: string; canEnd: boolean; endedAt: string | null;
  blockedReason: "active_permissions" | "recipient_active" | "history_unknown" | "no_permission_end" | null;
  neverIssued?: boolean;
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
    {neverIssued && <p className="muted">초대 발급·열람 이력이 없는 신규 대상으로 확인됐습니다. 대상 접근 취소 → 제공 목적 종료 → 영구삭제의 최신 영향 범위 확인 순서로 진행합니다. 각 단계는 서버에서 조건을 다시 확인합니다.</p>}
    {!canEnd && !endedAt && <p role="status">{blockedReason === "recipient_active" ? "대상 자체가 아직 접근 허용 상태입니다. 활성 링크·세션이 있다는 뜻은 아닙니다. 먼저 ‘대상 접근 취소’에서 영향 범위를 확인하고 취소해 주세요." : blockedReason === "active_permissions" ? "활성 초대 링크 또는 열람 세션이 있어 종료할 수 없습니다." : blockedReason === "no_permission_end" ? "최종 권한 종료 근거를 확인할 수 없어 종료할 수 없습니다." : "완전한 이력을 확인할 수 없어 종료할 수 없습니다."}</p>}
    <form action={action} aria-busy={pending}>
      <input type="hidden" name="id" value={id} />
      <button className="button" disabled={pending || !canEnd || Boolean(endedAt)}>{pending ? "종료 기록 중…" : endedAt ? "제공 목적 종료 기록됨" : "제공 목적 종료"}</button>
    </form>
    {state.message && <p ref={result} tabIndex={-1} role="status" className="access-result">{state.message}</p>}
  </section>;
}
