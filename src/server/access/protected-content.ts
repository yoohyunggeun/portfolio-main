import "server-only";

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { AccessError, api, springAccess } from "./backend";
import { isLocalPreview } from "./local";

export type ProtectedContent = {
  title: string;
  subtitle?: string;
  sections: { title: string; body: string }[];
  hasAttachment: boolean;
};

export async function protectedContent(slug: string): Promise<ProtectedContent> {
  if (springAccess()) return api<ProtectedContent>("content/protected/" + encodeURIComponent(slug));
  if (!await isLocalPreview() || slug !== "mes-case") throw new AccessError(404);
  try {
    return JSON.parse(await readFile(join(process.cwd(), ".local/private-content/protected", slug + ".json"), "utf8"));
  } catch {
    throw new AccessError(503);
  }
}
