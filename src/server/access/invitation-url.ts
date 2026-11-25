"use server";
import { api, apiId, invitationToken, AccessError } from "./backend";
import { sessionExpiry } from "./local";
export type InvitationUrlState = { path?: string; expiresAt?: string; error?: string };
export async function readInvitationUrl(_: InvitationUrlState, form: FormData): Promise<InvitationUrlState> {
  if (!await sessionExpiry("admin")) return { error: "관리자 인증을 다시 확인해 주세요." };
  const id = String(form.get("id") ?? "");
  if (!apiId(id)) return { error: "조회할 링크를 확인해 주세요." };
  try {
    const value = await api<{id:string;token:string;expiresAt:string}>(`admin/invitations/${id}/url`, {method:"POST"});
    if (value.id !== id || !invitationToken(value.token) || !Number.isFinite(Date.parse(value.expiresAt)) || Date.parse(value.expiresAt) <= Date.now())
      return { error: "유효한 초대 URL을 확인할 수 없습니다." };
    return { path: "/invite/" + value.token, expiresAt: value.expiresAt };
  } catch(error) {
    if(error instanceof AccessError && error.code === "invitation_url_unavailable") return {error:"이 링크는 원문을 보관하지 않은 이전 링크입니다. 해시에서 URL을 복원할 수 없습니다. 필요하면 명시적으로 새 링크를 발급해 주세요."};
    if(error instanceof AccessError && error.code === "invitation_inactive") return {error:"취소·만료·사용 완료되었거나 대상 접근이 취소된 링크입니다. 초대 URL을 표시하지 않습니다."};
    return {error:"초대 URL을 조회하지 못했습니다. 상태를 확인하고 다시 시도해 주세요."};
  }
}
