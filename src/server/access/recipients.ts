"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db, now, sessionExpiry, token, validToken } from "./local";

export async function manageRecipient(_: string, form: FormData): Promise<string> {
  if (!await sessionExpiry("admin")) return "관리자 세션이 만료되었습니다.";
  const { api, apiId, springAccess, AccessError } = await import("./backend");
  const operation = form.get("operation");
  if (springAccess()) {
    const id = String(form.get("id") ?? "");
    if (operation === "revoke" && apiId(id)) {
      try { await api(`admin/recipients/${id}/revoke`, { method: "POST" }); }
      catch { return "전체 접근을 취소하지 못했습니다."; }
      revalidatePath("/admin", "layout");
      return "연결된 링크와 유효 세션을 모두 취소했습니다.";
    }
    if (operation === "edit" && apiId(id)) {
      const fields = ["company", "email", "application", "contact", "posting", "memo"] as const;
      const [company, email, application, contact, postingUrl, memo] = fields.map(
        field => String(form.get(field) ?? "").trim()
      );
      try {
        await api(`admin/recipients/${id}`, { method: "PATCH", body: {
          company, email, application, contact, postingUrl, memo,
        } });
      } catch (error) {
        if(error instanceof AccessError && error.code === "recipient_duplicate" && error.existingRecipientId) return "duplicate:"+error.existingRecipientId;
        return "대상 정보를 저장하지 못했습니다. 입력값과 관리자 세션을 확인해 주세요.";
      }
      revalidatePath("/admin", "layout");
      return "대상 정보를 저장했습니다.";
    }
    if (operation !== "register") return "관리 동작을 확인해 주세요.";
    let result: { id: string };
    try {
      result = await api("admin/recipients", { method: "POST", body: {
        company: String(form.get("company") ?? "").trim(),
        email: String(form.get("email") ?? "").trim(),
        application: String(form.get("application") ?? "").trim(),
      } });
    } catch (error) {
      if(error instanceof AccessError && error.code === "recipient_duplicate" && error.existingRecipientId) return "duplicate:"+error.existingRecipientId;
      return "회사명과 이메일을 확인해 주세요.";
    }
    revalidatePath("/admin", "layout");
    redirect("/admin/recipients/" + result.id);
  }
  const id = String(form.get("id") ?? "");
  if (operation !== "register" && !validToken(id)) return "대상을 확인해 주세요.";
  const store = db();

  if (operation === "revoke") {
    const time = now();
    try {
      store.exec("BEGIN IMMEDIATE");
      const result = store.prepare("UPDATE recipients SET cancelled = ? WHERE id = ? AND cancelled IS NULL").run(time, id);
      if (!result.changes) {
        store.exec("ROLLBACK");
        return "이미 취소되었거나 대상이 없습니다.";
      }
      store.prepare("UPDATE requests SET cancelled = ? WHERE recipient_id = ? AND cancelled IS NULL").run(time, id);
      store.prepare("UPDATE sessions SET ended = ? WHERE role = 'reader' AND ended IS NULL AND expires > ? AND request_id IN (SELECT id FROM requests WHERE recipient_id = ?)").run(time, time, id);
      store.exec("COMMIT");
    } catch {
      if (store.isTransaction) store.exec("ROLLBACK");
      return "전체 접근을 취소하지 못했습니다. 다시 시도해 주세요.";
    }
    for (const path of ["/admin/recipients", "/admin/recipients/" + id, "/admin/invitations", "/admin/sessions", "/protected/mes-case"]) revalidatePath(path);
    return "연결된 링크와 유효 세션을 모두 취소했습니다.";
  }

  if (operation !== "register" && operation !== "edit") return "관리 동작을 확인해 주세요.";
  const [company, application, contact, posting, memo] = ["company", "application", "contact", "posting", "memo"].map((field) => String(form.get(field) ?? "").trim());
  if (!company || !application || company.length > 100 || application.length > 120 || contact.length > 120 || posting.length > 500 || memo.length > 1000) return "회사명과 지원 건을 확인해 주세요.";
  if (posting) {
    try {
      if (!["http:", "https:"].includes(new URL(posting).protocol)) return "지원 공고 URL을 확인해 주세요.";
    } catch { return "지원 공고 URL을 확인해 주세요."; }
  }
  const target = operation === "register" ? token() : id;
  try {
    const result = operation === "register"
      ? store.prepare("INSERT INTO recipients (id, company, application, contact, posting, memo, created) VALUES (?, ?, ?, ?, ?, ?, ?)").run(target, company, application, contact, posting, memo, now())
      : store.prepare("UPDATE recipients SET company = ?, application = ?, contact = ?, posting = ?, memo = ? WHERE id = ?").run(company, application, contact, posting, memo, id);
    if (!result.changes) return "대상을 찾을 수 없습니다.";
  } catch { return "대상 정보를 저장하지 못했습니다."; }
  revalidatePath("/admin/recipients");
  revalidatePath("/admin/recipients/" + target);
  if (operation === "register") redirect("/admin/recipients/" + target);
  return "대상 정보를 저장했습니다.";
}
