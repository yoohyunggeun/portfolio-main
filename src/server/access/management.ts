"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  adminCookie,
  db,
  now,
  sessionExpiry,
  token,
  validToken,
} from "./local";

export async function manageAccess(_: string, form: FormData): Promise<string> {
  if (!(await sessionExpiry("admin"))) return "관리자 세션이 만료되었습니다.";
  const { springAccess } = await import("./backend");
  if (springAccess())
    return (await import("./spring-management")).manageSpring(form);
  const operation = form.get("operation");
  const id = String(form.get("id") ?? "");
  const raw = String(form.get("expiry") ?? "");
  const expiry = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(raw)
    ? Date.parse(raw + ":00+09:00") / 1000
    : NaN;
  const time = now();
  let issuedPath: string | undefined;
  if (operation !== "issue" && !validToken(id))
    return "관리 항목을 확인해 주세요.";
  if (
    ["issue", "extend-invite", "extend-session"].includes(String(operation)) &&
    !(expiry > time)
  ) {
    return "현재보다 늦은 만료 시각을 KST 기준으로 입력해 주세요.";
  }
  try {
    const store = db();
    let changes: number | bigint;
    switch (operation) {
      case "issue": {
        const policy = form.get("policy");
        const recipient = String(form.get("recipient") ?? "");
        if (!recipient)
          return "기존 초대 대상을 선택해 주세요. 새 대상은 먼저 대상 등록 화면에서 등록합니다.";
        if (recipient) {
          if (
            !validToken(recipient) ||
            (policy !== "once" && policy !== "reusable")
          )
            return "대상과 재사용 정책을 확인해 주세요.";
          const invite = token();
          changes = store
            .prepare(
              `INSERT INTO requests (id, company, email, created, status, invite, invite_until, reusable, recipient_id)
            SELECT ?, company, '', ?, 'approved', ?, ?, ?, id FROM recipients WHERE id = ? AND cancelled IS NULL`,
            )
            .run(
              token(),
              time,
              invite,
              expiry,
              Number(policy === "reusable"),
              recipient,
            ).changes;
          if (changes) issuedPath = "/invite/" + invite;
          break;
        }
        return "초대 대상을 확인해 주세요.";
      }
      case "extend-invite":
        changes = store
          .prepare(
            "UPDATE requests SET invite_until = ? WHERE id = ? AND invite IS NOT NULL AND cancelled IS NULL AND (used IS NULL OR reusable = 1) AND invite_until < ?",
          )
          .run(expiry, id, expiry).changes;
        break;
      case "cancel-invite":
        changes = store
          .prepare(
            "UPDATE requests SET cancelled = ? WHERE id = ? AND invite IS NOT NULL AND cancelled IS NULL",
          )
          .run(time, id).changes;
        break;
      case "extend-session":
        changes = store
          .prepare(
            "UPDATE sessions SET expires = ? WHERE id = ? AND role = 'reader' AND ended IS NULL AND expires > ? AND expires < ? AND started IS NOT NULL AND ? <= started + 30 * 86400",
          )
          .run(expiry, id, time, expiry, expiry).changes;
        break;
      case "end-session":
        changes = store
          .prepare(
            "UPDATE sessions SET ended = ? WHERE id = ? AND role = 'reader' AND ended IS NULL AND expires > ?",
          )
          .run(time, id, time).changes;
        break;
      default:
        return "관리 동작을 확인해 주세요.";
    }
    if (!changes)
      return "상태가 변경되었거나 새 만료 시각이 기존 만료보다 늦지 않습니다.";
  } catch {
    return "저장하지 못했습니다. 상태를 확인하고 다시 시도해 주세요.";
  }
  for (const path of [
    "/admin/invitations",
    "/admin/sessions",
    "/admin/access-requests",
    "/admin/recipients",
    "/protected/mes-case",
  ])
    revalidatePath(path);
  return issuedPath ?? "저장했습니다.";
}

export async function logoutPreview() {
  const { api, backendCookie, springAccess } = await import("./backend");
  if (springAccess()) {
    await api("admin/auth/logout", { method: "POST" });
    (await cookies()).delete(backendCookie("admin"));
    redirect("/admin/login");
  }
  if (await sessionExpiry("admin")) {
    const jar = await cookies();
    db()
      .prepare("DELETE FROM sessions WHERE token = ? AND role = 'admin'")
      .run(jar.get(adminCookie)!.value);
    jar.delete(adminCookie);
  }
  redirect("/admin/login");
}
