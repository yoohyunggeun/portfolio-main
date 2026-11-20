"use server";

export async function submitLike(liked: boolean, simulateFailure: boolean): Promise<
  { ok: true; liked: boolean } | { ok: false }
> {
  // Give the demo time to show the optimistic state before returning a result.
  await new Promise<void>((resolve) => setTimeout(resolve, 1100));
  if (simulateFailure) return { ok: false };
  return { ok: true, liked };
}
