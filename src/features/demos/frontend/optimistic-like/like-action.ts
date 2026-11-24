"use server";
import { canReadProjects } from "@/server/access/session";

export async function submitLike(
  liked: boolean,
  simulateFailure: boolean,
): Promise<{ ok: true; liked: boolean } | { ok: false }> {
  if (!(await canReadProjects())) return { ok: false };
  // Give the demo time to show the optimistic state before returning a result.
  await new Promise<void>((resolve) => setTimeout(resolve, 1100));
  if (simulateFailure) return { ok: false };
  return { ok: true, liked };
}
