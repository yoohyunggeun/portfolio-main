"use server";

import { revalidatePath } from "next/cache";
import { AccessError, api, apiId, springAccess } from "./backend";
import { sessionExpiry } from "./local";

export type PurposeEndState = { status: "idle" | "success" | "error"; message: string };

export async function endRecipientPurpose(_: PurposeEndState, form: FormData): Promise<PurposeEndState> {
  if (!springAccess()) return { status: "error", message: "인증 서비스에 연결된 환경에서만 사용할 수 있습니다." };
  if (!await sessionExpiry("admin")) return { status: "error", message: "관리자 세션이 만료되었습니다. 다시 로그인해 주세요." };
  const id = String(form.get("id") ?? "");
  if (!apiId(id)) return { status: "error", message: "대상을 확인해 주세요." };
  try {
    await api(`admin/recipients/${id}/retention/purpose-end`, { method: "POST" });
  } catch (error) {
    if (error instanceof AccessError && error.status === 409) {
      revalidatePath("/admin/recipients/" + id);
      return { status: "error", message: "활성 링크·열람 세션 또는 확인되지 않은 이력이 있어 종료할 수 없습니다. 현재 상태를 확인해 주세요." };
    }
    if (error instanceof AccessError && [401, 403].includes(error.status)) return { status: "error", message: "관리자 권한을 확인할 수 없습니다. 다시 로그인해 주세요." };
    return { status: "error", message: "제공 목적 종료를 확인하지 못했습니다. 잠시 후 다시 시도해 주세요." };
  }
  revalidatePath("/admin", "layout");
  return { status: "success", message: "제공 목적 종료를 기록했습니다. 개인정보가 즉시 삭제된 것은 아닙니다. 재발급·열람 사용·연장 시 종료 표시는 해제됩니다." };
}
