import "server-only";
import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { api, apiId, type Issued } from "./backend";

export async function manageSpring(form: FormData) {
  const operation = form.get("operation");
  const id = String(form.get("id") ?? "");
  let invite: string | undefined;
  try {
    switch (operation) {
      case "issue": {
        const days = Number(form.get("days"));
        const policy = form.get("policy");
        if (!Number.isInteger(days) || days < 1 || days > 30 || !["once", "reusable"].includes(String(policy))) {
          return "링크 유효 기간과 재사용 정책을 확인해 주세요.";
        }
        let recipientId = String(form.get("recipient") ?? "");
        if (!recipientId) {
          const target = await api<{ id: string }>("admin/recipients", { method: "POST", body: {
            company: String(form.get("company") ?? "").trim(), email: String(form.get("email") ?? "").trim(),
          } });
          recipientId = target.id;
        }
        if (!apiId(recipientId)) return "초대 대상을 확인해 주세요.";
        const result = await api<Issued>("admin/invitations", { method: "POST", key: randomUUID(),
          body: { recipientId, days, maxRedemptions: policy === "once" ? 1 : 100 } });
        if (result.token) invite = "/invite/" + result.token;
        break;
      }
      case "extend-invite":
      case "extend-session": {
        if (!apiId(id)) return "관리 항목을 확인해 주세요.";
        const link = operation === "extend-invite";
        const units = Number(form.get(link ? "days" : "hours"));
        if (!Number.isInteger(units) || units < 1 || units > (link ? 30 : 719)) return "연장 기간을 확인해 주세요.";
        await api(`admin/${link ? "invitations" : "reader-sessions"}/${id}`, {
          method: "PATCH", body: { action: "extend", [link ? "days" : "hours"]: units },
        });
        break;
      }
      case "cancel-invite":
      case "end-session":
        if (!apiId(id)) return "관리 항목을 확인해 주세요.";
        await api(`admin/${operation === "cancel-invite" ? "invitations" : "reader-sessions"}/${id}`, {
          method: "PATCH", body: { action: "revoke" },
        });
        break;
      default: return "관리 동작을 확인해 주세요.";
    }
  } catch {
    return "저장하지 못했습니다. 현재 상태를 확인해 주세요.";
  }
  revalidatePath("/admin", "layout");
  return invite ?? "저장했습니다.";
}
