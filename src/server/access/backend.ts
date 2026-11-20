import "server-only";
import { cookies } from "next/headers";

export const springAccess = () => Boolean(process.env.PORTFOLIO_ACCESS_URL);
const localHttp = () => /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(process.env.PORTFOLIO_ACCESS_ORIGIN ?? "");
export const backendCookie = (role: "admin" | "reader") =>
  (localHttp() ? "portfolio-spring-" : "__Host-portfolio-") + role;

export async function setBackendCookie(role: "admin" | "reader", value: string, maxAge: number) {
  (await cookies()).set(backendCookie(role), value, {
    httpOnly: true, secure: !localHttp(), sameSite: "strict", path: "/", maxAge,
  });
}

export class AccessError extends Error {
  constructor(readonly status: number) { super("Access API request failed"); }
}

export async function apiResponse(path: string, options: {
  method?: string; body?: unknown; key?: string; source?: string;
} = {}): Promise<Response> {
  const jar = await cookies();
  let url: URL;
  try {
    url = new URL(process.env.PORTFOLIO_ACCESS_URL ?? "");
  } catch {
    throw new AccessError(503);
  }
  const serviceToken = process.env.PORTFOLIO_SERVICE_TOKEN;
  if (!serviceToken || (url.protocol !== "https:" &&
      !(url.protocol === "http:" && ["127.0.0.1", "localhost"].includes(url.hostname)))) {
    throw new AccessError(503);
  }
  const accessId = process.env.PORTFOLIO_CF_ACCESS_CLIENT_ID?.trim();
  const accessSecret = process.env.PORTFOLIO_CF_ACCESS_CLIENT_SECRET?.trim();
  const requiresAccess = url.hostname === "api.geunyfolio.com";
  if ((requiresAccess || accessId || accessSecret) && (!accessId || !accessSecret)) {
    throw new AccessError(503);
  }
  const headers = new Headers({ Authorization: `Bearer ${serviceToken}` });
  if (accessId && accessSecret) {
    headers.set("CF-Access-Client-Id", accessId);
    headers.set("CF-Access-Client-Secret", accessSecret);
  }
  for (const role of ["admin", "reader"] as const) {
    const value = jar.get(backendCookie(role))?.value;
    if (value) headers.set(`X-${role}-Session`, value);
  }
  if (options.body !== undefined) headers.set("Content-Type", "application/json");
  if (options.key) headers.set("Idempotency-Key", options.key);
  if (options.source) headers.set("X-Request-Source", options.source);
  let result: Response;
  try {
    result = await fetch(new URL("/v1/" + path, url), {
      method: options.method, headers, cache: "no-store", redirect: "error",
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
      signal: AbortSignal.timeout(5000),
    });
  } catch {
    throw new AccessError(503);
  }
  if (!result.ok) throw new AccessError(result.status);
  return result;
}

export async function api<T>(path: string, options: Parameters<typeof apiResponse>[1] = {}): Promise<T> {
  const result = await apiResponse(path, options);
  return result.status === 204 ? undefined as T : result.json();
}

export type Issued = { id: string; token?: string; expiresAt?: string; status: string };
export async function authorize(slug: string) {
  try {
    return await api<{ allowed: boolean; admin: boolean }>("access/authorize", { method: "POST", body: { slug } });
  } catch (error) {
    if (error instanceof AccessError && error.status === 403) return null;
    throw error;
  }
}

export type RequestRow = { id: string; company: string; email: string; status: "pending" | "approved" | "rejected"; created_at: string };
export type RecipientRow = { id: string; company: string; email: string | null; application: string | null; contact: string | null; posting_url: string | null; memo: string | null; status: string };
export type InvitationRow = { id: string; recipient_id: string; request_id: string | null; expires_at: string; created_at: string; max_redemptions: number | null; status: string };
export type SessionRow = { id: string; invitation_id: string; started_at: string; last_seen_at: string; expires_at: string; status: string };

export async function list<T>(collection: string) {
  const rows: T[] = [];
  let cursor: string | null = null;
  do {
    const page: { items: T[]; nextCursor: string | null } = await api(
      `admin/${collection}?limit=100${cursor ? "&after=" + encodeURIComponent(cursor) : ""}`
    );
    rows.push(...page.items);
    cursor = page.nextCursor;
  } while (cursor);
  return rows;
}

export const epoch = (value: string) => Date.parse(value.endsWith("Z") ? value : value.replace(" ", "T") + "Z") / 1000;
export const invitationToken = (value: string) => /^[A-Za-z0-9_-]{43}$/.test(value);
export const apiId = (value: string) => /^[\da-f]{8}(?:-[\da-f]{4}){3}-[\da-f]{12}$/i.test(value);
