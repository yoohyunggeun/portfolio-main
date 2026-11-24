import "server-only";
import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { AccessError, api, apiId, type Issued } from "./backend";

export async function manageSpring(form: FormData) {
  const operation = form.get("operation");
  const id = String(form.get("id") ?? "");
  let invite: string | undefined;
  let deletedCollection: string | undefined;
  let changedCollection: string | undefined;
  try {
    switch (operation) {
      case "issue": {
        const days = Number(form.get("days"));
        const policy = form.get("policy");
        if (
          !Number.isInteger(days) ||
          days < 1 ||
          days > 30 ||
          !["once", "reusable"].includes(String(policy))
        ) {
          return "링크 유효 기간과 재사용 정책을 확인해 주세요.";
        }
        const recipientId = String(form.get("recipient") ?? "");
        if (!apiId(recipientId))
          return "기존 초대 대상을 선택해 주세요. 새 대상은 대상 등록 화면에서 먼저 등록합니다.";
        const result = await api<Issued>("admin/invitations", {
          method: "POST",
          key: randomUUID(),
          body: {
            recipientId,
            days,
            maxRedemptions: policy === "once" ? 1 : 100,
          },
        });
        if (result.token) invite = "/invite/" + result.token;
        else
          return "원문 URL이 없는 발급 응답입니다. 발급 상태를 먼저 확인해 주세요. 기존 링크의 해시로 URL을 복원할 수는 없습니다.";
        break;
      }
      case "extend-invite":
      case "extend-session": {
        if (!apiId(id)) return "관리 항목을 확인해 주세요.";
        const link = operation === "extend-invite";
        const units = Number(form.get(link ? "days" : "hours"));
        if (!Number.isInteger(units) || units < 1 || units > (link ? 30 : 719))
          return "연장 기간을 확인해 주세요.";
        await api(`admin/${link ? "invitations" : "reader-sessions"}/${id}`, {
          method: "PATCH",
          body: { action: "extend", [link ? "days" : "hours"]: units },
        });
        break;
      }
      case "cancel-invite":
      case "end-session":
        if (!apiId(id)) return "관리 항목을 확인해 주세요.";
        await api(
          `admin/${operation === "cancel-invite" ? "invitations" : "reader-sessions"}/${id}`,
          {
            method: "PATCH",
            body: { action: "revoke" },
          },
        );
        changedCollection =
          operation === "cancel-invite" ? "invitations" : "sessions";
        break;
      case "delete-invite":
      case "delete-session":
        if (!apiId(id) || form.get("confirmDeletion") !== "on")
          return "영구 삭제할 항목을 확인해 주세요.";
        await api(
          `admin/${operation === "delete-invite" ? "invitations" : "reader-sessions"}/${id}`,
          { method: "DELETE" },
        );
        deletedCollection =
          operation === "delete-invite" ? "invitations" : "sessions";
        break;
      default:
        return "관리 동작을 확인해 주세요.";
    }
  } catch (error) {
    if (
      error instanceof AccessError &&
      error.status === 409 &&
      ["delete-invite", "delete-session"].includes(String(operation))
    )
      return "상태가 바뀌었거나 연결된 기록이 남아 삭제할 수 없습니다. 활성 항목은 먼저 종료·취소하고, 링크는 연결된 종료 세션을 개별 삭제한 뒤 다시 확인해 주세요.";
    return "저장하지 못했습니다. 현재 상태를 확인해 주세요.";
  }
  revalidatePath("/admin", "layout");
  const returnRecipient = String(form.get("returnRecipient") ?? "");
  const destination = (collection: string, result: string) =>
    `/admin/${collection}?` +
    new URLSearchParams({
      state: "inactive",
      result,
      ...(apiId(returnRecipient) ? { recipient: returnRecipient } : {}),
    });
  if (deletedCollection) redirect(destination(deletedCollection, "deleted"));
  if (changedCollection) redirect(destination(changedCollection, "updated"));
  return invite ?? "저장했습니다.";
}
