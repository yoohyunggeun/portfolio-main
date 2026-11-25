"use client";
import { useActionState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { manageLifecycle } from "@/server/access/lifecycle";
const reasons: Record<string,string>={recipient_active:"대상 자체가 아직 접근 허용 상태입니다. 링크·세션 수와 별개로 먼저 대상 접근 취소를 확인해 주세요",active:"활성 권한이 남아 있습니다",history_unknown:"이력이 불완전합니다",purpose_not_ended:"제공 목적 종료가 확인되지 않았습니다",invalid_clock:"종료 시각을 확인할 수 없습니다",provenance_unknown:"등록 근거를 확인할 수 없습니다",children_remain:"연결 링크·세션을 먼저 정리해 주세요",relationship_unknown:"요청 관계를 확인할 수 없습니다",too_many_records:"한 번에 처리할 수 있는 기록 수를 초과했습니다",preview_changed:"미리보기 이후 기록이 변경됐습니다"};
export function RecipientLifecycle({id,company,mode}:{id:string;company:string;mode:"revoke"|"delete"}) {
  const [state,action,pending]=useActionState(manageLifecycle,{});
  const result=useRef<HTMLDivElement>(null); const router=useRouter();
  useEffect(()=>{if(!pending&&(state.preview||state.error||state.done))result.current?.focus();if(state.done){if(mode === "delete")router.replace("/admin/recipients?state=inactive&result=deleted");else router.refresh();}},[state,pending,router,mode]);
  const p=state.preview, deleting=mode === "delete";
  return <details className="access-card recipient-lifecycle"><summary>{deleting ? "관리자 조기 영구삭제" : "대상 접근 취소"}</summary>
    <p>{deleting ? "보관 목록에서 숨기는 동작이 아닙니다. 정확히 연결된 원접수·동의 사본과 대상 정보를 영구 삭제합니다." : "이 대상의 모든 링크·열람 세션과 재발급을 차단합니다. 같은 대상에 연결된 다른 승인 요청에도 영향을 주며 원승인·접수·동의 이력은 유지합니다."}</p>
    <p>{company} · 대상 {id.slice(0,8)}</p>
    {deleting && <p className="muted">대상 접근 취소나 목적 종료 후에는 ‘최신 영향 범위 확인’을 다시 눌러 삭제 조건을 확인해 주세요. 링크·세션 0개만으로 삭제할 수 있는 것은 아닙니다.</p>}
    {state.done ? <div ref={result} tabIndex={-1} role="status">{deleting ? "대상과 확인한 원접수 사본을 삭제했습니다." : "대상 접근을 취소했습니다. 승인 이력은 보존됩니다."}<br/><Link className="text-link" href="/admin/recipients">현재 대상 목록 →</Link></div> : <>
    <form action={action}><input type="hidden" name="id" value={id}/><input type="hidden" name="mode" value={mode}/><input type="hidden" name="step" value="preview"/><button className="button" disabled={pending}>{pending ? "확인 중…" : "최신 영향 범위 확인"}</button></form>
    {(p||state.error) && <div ref={result} tabIndex={-1} className="panel concept-card access-card" role={state.error?"alert":"status"}>
      {state.error && <p>{state.error}</p>}
      {p && <><dl><dt>연결 승인 원요청</dt><dd>{p.approvedRequestCount}건</dd><dt>링크 / 세션</dt><dd>{p.invitationCount} / {p.readerSessionCount}개</dd>{!deleting && <><dt>활성 링크 / 세션</dt><dd>{p.activeInvitationCount ?? "미확인"} / {p.activeReaderSessionCount ?? "미확인"}</dd></>}</dl>
      {deleting && <><p>삭제 범위: 대상 원장 1개와 연결된 승인 원요청 {p.approvedRequestCount}건의 회사·이메일·동의 증적 사본. 연결 링크·세션은 자동 삭제하지 않습니다.</p><p>최소 감사·암호화 복원 관계 근거는 90일 남습니다. 기존 백업은 별도 보관 정책을 따르며 즉시 사라지지 않습니다. 되돌릴 수 없습니다.</p>{p.invitationCount > 0 || p.readerSessionCount > 0 ? <Link className="text-link" href={`/admin/invitations?state=all&recipient=${id}`}>연결 링크와 세션 먼저 정리 →</Link> : <p>연결된 링크·세션은 0개입니다. 대상 접근 상태·목적 종료·이력 확인은 별도 조건입니다.</p>}{!p.canDelete && <p>삭제 불가: {reasons[p.blockedReason ?? ""] ?? "현재 기록의 안전한 삭제 조건을 확인할 수 없습니다"}</p>}</>}
      {(deleting ? p.canDelete === true && /^[a-f0-9]{64}$/i.test(p.fingerprint ?? "") && p.invitationCount === 0 && p.readerSessionCount === 0 && p.deletesOriginalRequests === true : !p.alreadyRevoked) && <form action={action} className="access-card" aria-busy={pending}>
        <input type="hidden" name="id" value={id}/><input type="hidden" name="mode" value={mode}/><input type="hidden" name="step" value="apply"/><input type="hidden" name="fingerprint" value={p.fingerprint ?? ""}/>
        <label><input type="checkbox" name="confirm" required disabled={pending}/> 위 대상·연결 기록과 {deleting ? "원접수·동의 사본의 영구삭제 및 남는 근거" : "다른 승인 요청을 포함한 전체 접근 차단"}를 확인했습니다.</label><button className="button danger" disabled={pending}>{pending ? "처리 중…" : deleting ? "확인한 범위 조기 영구삭제" : "확인한 대상 접근 취소"}</button>
      </form>}{p.alreadyRevoked && <p>이미 접근이 취소된 대상입니다.</p>}</>}
    </div>}</>}
  </details>;
}
