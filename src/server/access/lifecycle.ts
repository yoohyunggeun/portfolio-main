"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { sessionExpiry } from "./local";
import { AccessError, api, apiId } from "./backend";

export type LifecyclePreview = {
  recipientId: string; approvedRequestCount: number; invitationCount: number; readerSessionCount: number;
  activeInvitationCount?: number; activeReaderSessionCount?: number; alreadyRevoked?: boolean;
  canDelete?: boolean; blockedReason?: string | null; fingerprint?: string; recipientCount?: number;
  retainedEvidenceDays?: number; deletesOriginalRequests?: boolean;
};
export type LifecycleState = { preview?: LifecyclePreview; error?: string; done?: boolean };
export async function manageLifecycle(_: LifecycleState, form: FormData): Promise<LifecycleState> {
  if(!await sessionExpiry("admin")) return {error:"관리자 세션이 만료되었습니다."};
  const id=String(form.get("id") ?? ""), mode=form.get("mode"), step=form.get("step");
  if(!apiId(id) || !["revoke","delete"].includes(String(mode))) return {error:"관리 대상을 확인해 주세요."};
  try {
    if(step === "preview") {
      const preview=await api<LifecyclePreview>(`admin/recipients/${id}/${mode === "revoke" ? "revoke-preview" : "deletion-preview"}`);
      if(preview.recipientId !== id) return {error:"대상 관계를 확인할 수 없습니다."};
      return {preview};
    }
    if(step !== "apply" || form.get("confirm") !== "on") return {error:"영향 범위를 먼저 확인해 주세요."};
    if(mode === "revoke") await api(`admin/recipients/${id}/revoke`, {method:"POST"});
    else {
      const fingerprint=String(form.get("fingerprint") ?? "");
      if(!/^[a-f0-9]{64}$/i.test(fingerprint)) return {error:"새 삭제 미리보기가 필요합니다."};
      await api(`admin/recipients/${id}`,{method:"DELETE",body:{fingerprint,confirmed:true}});
    }
  } catch(error) {
    revalidatePath("/admin","layout");
    return {error:error instanceof AccessError && error.status === 409
      ? "상태나 연결 기록이 바뀌었거나 정리 조건이 충족되지 않아 처리하지 않았습니다. 새 미리보기에서 연결 기록과 차단 사유를 확인해 주세요."
      : error instanceof AccessError && error.status === 404 ? "대상을 찾을 수 없습니다. 목록에서 현재 상태를 확인해 주세요."
      : "처리 완료를 확인할 수 없습니다. 현재 상태를 확인한 뒤 다시 미리보기해 주세요."};
  }
  revalidatePath("/admin","layout");
  if(mode === "delete") redirect("/admin/recipients?state=inactive&result=deleted");
  return {done:true};
}
