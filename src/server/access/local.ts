import "server-only";
import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { randomBytes } from "node:crypto";
import { cookies, headers } from "next/headers";

export const resource = { slug: "mes-case", title: "장애 대응 사례 상세" };
const hour = 3600;
export const adminCookie = "portfolio-local-admin";
export const readerCookie = "portfolio-local-reader";
export const token = () => randomBytes(32).toString("hex");
export const now = () => Math.floor(Date.now() / 1000);
export const validToken = (value?: string) => typeof value === "string" && /^[a-f0-9]{64}$/.test(value);

export async function isLocalPreview() {
  if (process.env.PORTFOLIO_ACCESS_URL || process.env.NODE_ENV !== "development") return false;
  const host = (await headers()).get("host") ?? "";
  return /^(localhost|127\.0\.0\.1)(:\d+)?$/.test(host);
}

let database: DatabaseSync | undefined;
export function db() {
  if (database) return database;
  const folder = join(process.cwd(), ".local");
  mkdirSync(folder, { recursive: true });
  database = new DatabaseSync(join(folder, "access.sqlite"));
  database.exec(`
    PRAGMA busy_timeout = 5000;
    CREATE TABLE IF NOT EXISTS recipients (
      id TEXT PRIMARY KEY, company TEXT NOT NULL, application TEXT NOT NULL, contact TEXT NOT NULL,
      posting TEXT NOT NULL, memo TEXT NOT NULL, created INTEGER NOT NULL, cancelled INTEGER
    );
    CREATE TABLE IF NOT EXISTS requests (
      id TEXT PRIMARY KEY, company TEXT NOT NULL, email TEXT NOT NULL, created INTEGER NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending', invite TEXT UNIQUE, invite_until INTEGER, used INTEGER
    );
    CREATE TABLE IF NOT EXISTS sessions (
      token TEXT PRIMARY KEY, role TEXT NOT NULL, expires INTEGER NOT NULL
    );
  `);
  const columns = {
    requests: { recipient_id: "TEXT REFERENCES recipients(id)", reusable: "INTEGER NOT NULL DEFAULT 0", cancelled: "INTEGER" },
    sessions: { id: "TEXT", request_id: "TEXT", started: "INTEGER", recent: "INTEGER", ended: "INTEGER" },
  };
  database.exec("BEGIN IMMEDIATE");
  try {
    for (const [table, additions] of Object.entries(columns)) {
      const existing = database.prepare(`PRAGMA table_info(${table})`).all();
      for (const [name, definition] of Object.entries(additions)) {
        if (!existing.some((column) => column.name === name)) database.exec(`ALTER TABLE ${table} ADD COLUMN ${name} ${definition}`);
      }
    }
    database.exec("UPDATE sessions SET id = lower(hex(randomblob(32))) WHERE role = 'reader' AND id IS NULL");
    database.exec("COMMIT");
  } catch (error) {
    database.exec("ROLLBACK");
    database.close();
    database = undefined;
    throw error;
  }
  return database;
}

export async function sessionExpiry(role: "admin" | "reader") {
  const { api, backendCookie, springAccess } = await import("./backend");
  if (springAccess()) {
    if (role !== "admin" || !(await cookies()).has(backendCookie("admin"))) return 0;
    try {
      return (await api<{ admin: boolean }>("admin/session")).admin ? 1 : 0;
    } catch {
      return 0;
    }
  }
  if (!await isLocalPreview()) return 0;
  const value = (await cookies()).get(role === "admin" ? adminCookie : readerCookie)?.value;
  if (!validToken(value)) return 0;
  if (role === "reader") {
    const time = now();
    const reader = db().prepare("UPDATE sessions SET recent = ? WHERE token = ? AND role = 'reader' AND ended IS NULL AND expires > ? RETURNING expires").get(time, value!, time);
    return Number(reader?.expires ?? 0);
  }
  const session = db().prepare("SELECT expires FROM sessions WHERE token = ? AND role = ? AND expires > ?").get(value!, role, now());
  return Number(session?.expires ?? 0);
}

export async function startSession(role: "admin" | "reader") {
  const value = token();
  db().prepare("INSERT INTO sessions (token, role, expires) VALUES (?, ?, ?)").run(value, role, now() + hour);
  (await cookies()).set(role === "admin" ? adminCookie : readerCookie, value, {
    httpOnly: true, sameSite: "strict", path: "/", maxAge: hour,
  });
}
