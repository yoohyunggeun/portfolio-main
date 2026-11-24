import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { api, backendCookie, springAccess } from "./backend";
import { isLocalPreview, sessionExpiry } from "./local";

export type AccessSession = {
  role: "guest" | "admin" | "reader";
  serverNow: string;
  expiresAt: string | null;
  scope: "ALL" | "RESOURCE" | null;
  allowedResources: string[];
  projectScope: "ALL" | "NONE";
  unavailable?: boolean;
};
const guest = (unavailable = false): AccessSession => ({
  role: "guest",
  serverNow: new Date().toISOString(),
  expiresAt: null,
  scope: null,
  allowedResources: [],
  projectScope: "NONE",
  unavailable,
});

// React cache deduplicates only within this server render; no shared permission cache.
export const accessSession = cache(async (): Promise<AccessSession> => {
  if (springAccess()) {
    const jar = await cookies();
    if (!jar.has(backendCookie("admin")) && !jar.has(backendCookie("reader")))
      return guest();
    try {
      const value = await api<AccessSession>("access/session");
      if (value.role === "guest") return guest();
      if (
        !["admin", "reader"].includes(value.role) ||
        !Number.isFinite(Date.parse(value.serverNow)) ||
        !value.expiresAt ||
        !Number.isFinite(Date.parse(value.expiresAt)) ||
        Date.parse(value.expiresAt) <= Date.parse(value.serverNow) ||
        !["ALL", "RESOURCE"].includes(value.scope ?? "") ||
        !["ALL", "NONE"].includes(value.projectScope) ||
        !Array.isArray(value.allowedResources) ||
        value.allowedResources.some((x) => typeof x !== "string")
      )
        return guest(true);
      return {
        role: value.role,
        serverNow: value.serverNow,
        expiresAt: value.expiresAt,
        scope: value.scope,
        allowedResources: value.allowedResources,
        projectScope: value.projectScope,
      };
    } catch {
      return guest(true);
    }
  }
  if (!(await isLocalPreview())) return guest();
  const admin = await sessionExpiry("admin"),
    reader = admin ? 0 : await sessionExpiry("reader");
  if (!admin && !reader) return guest();
  return {
    role: admin ? "admin" : "reader",
    serverNow: new Date().toISOString(),
    expiresAt: new Date((admin || reader) * 1000).toISOString(),
    scope: admin ? "ALL" : "RESOURCE",
    projectScope: admin ? "ALL" : "NONE",
    allowedResources: ["mes-case"],
  };
});

export async function canReadProjects() {
  const session = await accessSession();
  return (
    session.role !== "guest" &&
    session.scope === "ALL" &&
    session.projectScope === "ALL"
  );
}
