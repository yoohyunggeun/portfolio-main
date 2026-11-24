"use server";

import { randomUUID } from "node:crypto";
import { privacyVersion } from "@/content/privacy";
import {
  AccessError,
  api,
  apiId,
  invitationToken,
  setBackendCookie,
  springAccess,
  type Issued,
} from "./backend";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import {
  db,
  isLocalPreview,
  now,
  sessionExpiry,
  startSession,
  token,
  validToken,
} from "./local";

export type RequestState = {
  error?: string;
  email?: string;
  invite?: string;
  processed?: boolean;
  existingRecipientId?: string;
};

export async function submitRequest(
  _: RequestState,
  form: FormData,
): Promise<RequestState> {
  if (!springAccess() && !(await isLocalPreview()))
    return { error: "로컬 미리보기에서만 요청할 수 있습니다." };
  if (
    form.get("privacyConsent") !== "on" ||
    form.get("privacyVersion") !== privacyVersion
  )
    return { error: "개인정보 수집·이용 안내를 확인하고 동의해 주세요." };
  const company = String(form.get("company") ?? "").trim();
  const email = String(form.get("email") ?? "").trim();
  if (
    !company ||
    company.length > 100 ||
    email.length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    return { error: "회사명과 올바른 수신 이메일을 입력해 주세요." };
  }
  try {
    if (springAccess()) {
      await api("access-requests", {
        method: "POST",
        body: {
          company,
          email,
          consent: { accepted: true, policyVersion: privacyVersion },
        },
        source: "local-frontend",
      });
      return { email };
    }
    db()
      .prepare(
        "INSERT INTO requests (id, company, email, created) VALUES (?, ?, ?, ?)",
      )
      .run(token(), company, email, now());
    return { email };
  } catch (error) {
    if (error instanceof AccessError && error.status === 429)
      return {
        error: "요청 횟수가 초과되었습니다. 잠시 후 다시 시도해 주세요.",
      };
    return { error: "요청을 저장하지 못했습니다. 다시 시도해 주세요." };
  }
}

export async function loginPreview() {
  if (springAccess()) {
    const { randomBytes, createHash } = await import("node:crypto");
    const { cookies } = await import("next/headers");
    const verifier = randomBytes(32).toString("base64url");
    const challenge = createHash("sha256").update(verifier).digest("base64url");
    let login: { state: string; authorizationUrl: string };
    try {
      login = await api("admin/auth/start", {
        method: "POST",
        body: { challenge },
      });
    } catch {
      redirect("/admin/login?error=google");
    }
    (await cookies()).set(
      "__Host-portfolio-oidc",
      login.state + "." + verifier,
      {
        secure: true,
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 300,
      },
    );
    redirect(login.authorizationUrl);
  }
  if (!(await isLocalPreview())) redirect("/");
  await startSession("admin");
  redirect("/admin");
}

export async function decideRequest(
  _: RequestState,
  form: FormData,
): Promise<RequestState> {
  if (!(await sessionExpiry("admin")))
    return { error: "관리자 세션이 만료되었습니다. 다시 시작해 주세요." };
  const id = String(form.get("id") ?? "");
  const decision = form.get("decision");
  if(form.get("recipientId") && form.get("confirmReuse") !== "on") return {error:"기존 대상 재사용을 명시적으로 확인해 주세요."};
  if (
    !(springAccess() ? apiId(id) : validToken(id)) ||
    (decision !== "approved" && decision !== "rejected")
  )
    return { error: "요청을 확인해 주세요." };
  try {
    const approve = decision === "approved";
    if (springAccess()) {
      const result = await api<Issued>(`admin/access-requests/${id}/decision`, {
        method: "POST",
        key: randomUUID(),
        body: { decision: approve ? "approve" : "reject", ...(approve && apiId(String(form.get("recipientId") ?? "")) ? {recipientId: String(form.get("recipientId"))} : {}) },
      });
      revalidatePath("/admin", "layout");
      return {
        processed: true,
        invite: result.token ? "/invite/" + result.token : undefined,
      };
    }
    const result = db()
      .prepare(
        "UPDATE requests SET status = ?, invite = ?, invite_until = ? WHERE id = ? AND status = 'pending'",
      )
      .run(
        decision,
        approve ? token() : null,
        approve ? now() + 7 * 86400 : null,
        id,
      );
    if (!result.changes)
      return { error: "이미 처리된 요청입니다. 목록을 새로고침해 주세요." };
  } catch (error) {
    if (error instanceof AccessError && error.code === "recipient_duplicate" && error.existingRecipientId)
      return {error:"동일한 회사·이메일·지원 건의 대상이 있습니다. 정확한 대상을 확인한 뒤 이 요청을 해당 대상으로 승인해 주세요.",existingRecipientId:error.existingRecipientId};
    return { error: "처리 결과를 확인할 수 없습니다. 다시 시도해 주세요." };
  }
  revalidatePath("/admin/access-requests");
  redirect("/admin/access-requests?status=processed&request=" + id);
}

export async function redeemInvite(form: FormData) {
  const value = String(form.get("token") ?? "");
  if (springAccess()) {
    if (!invitationToken(value)) redirect("/access?reason=invite");
    let issued: Issued;
    try {
      issued = await api<Issued>("invitations/redeem", {
        method: "POST",
        body: { token: value },
      });
    } catch (error) {
      redirect(
        error instanceof AccessError && error.status === 403
          ? "/access?reason=invite"
          : "/access?reason=unavailable",
      );
    }
    if (!issued.token) redirect("/access?reason=invite");
    await setBackendCookie("reader", issued.token, 30 * 86400);
    redirect("/protected/mes-case");
  }
  if (!(await isLocalPreview())) redirect("/");
  if (!validToken(value)) redirect("/access?resource=mes-case&reason=invite");
  const store = db();
  const reader = token();
  const timestamp = now();
  store.exec("BEGIN IMMEDIATE");
  let redeemed = false;
  try {
    const result = store
      .prepare(
        "UPDATE requests SET used = COALESCE(used, ?) WHERE invite = ? AND status = 'approved' AND cancelled IS NULL AND (used IS NULL OR reusable = 1) AND invite_until > ? RETURNING id",
      )
      .get(timestamp, value, timestamp);
    if (result) {
      store
        .prepare(
          "INSERT INTO sessions (token, role, expires, id, request_id, started, recent) VALUES (?, 'reader', ?, ?, ?, ?, ?)",
        )
        .run(
          reader,
          timestamp + 3600,
          token(),
          result.id,
          timestamp,
          timestamp,
        );
      redeemed = true;
    }
    store.exec("COMMIT");
  } catch {
    store.exec("ROLLBACK");
  }
  if (!redeemed) redirect("/access?resource=mes-case&reason=invite");
  const { cookies } = await import("next/headers");
  const { readerCookie } = await import("./local");
  (await cookies()).set(readerCookie, reader, {
    httpOnly: true,
    sameSite: "strict",
    path: "/",
    maxAge: 30 * 86400,
  });
  redirect("/protected/mes-case");
}
