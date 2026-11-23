import { apiResponse } from "@/server/access/backend";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 5;

const headers = {
  "Cache-Control": "private, no-store",
  "CDN-Cache-Control": "no-store",
  "Vercel-CDN-Cache-Control": "no-store",
  "X-Content-Type-Options": "nosniff",
  "X-Robots-Tag": "noindex, nofollow",
};

// Only a small, exact health response is accepted; upstream data is never relayed.
async function healthy(response: Response): Promise<boolean> {
  if (response.status !== 200 ||
      response.headers.get("Content-Type")?.split(";")[0].trim().toLowerCase() !== "application/json" ||
      !response.body) return false;
  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 1024) return false;
      chunks.push(value);
    }
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
    const value: unknown = JSON.parse(new TextDecoder().decode(bytes));
    return typeof value === "object" && value !== null && !Array.isArray(value) &&
      Object.keys(value).length === 1 && "status" in value && value.status === "ok";
  } finally {
    void reader.cancel().catch(() => {});
  }
}

export async function GET() {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 3000);
  let status = 503;
  try {
    const response = await apiResponse("health", { includeSessions: false, signal: controller.signal });
    if (await healthy(response)) status = 200;
  } catch {
    // Keep credentials, topology and failure details entirely server-side.
  } finally {
    clearTimeout(timer);
    controller.abort();
  }
  return new Response(null, { status, headers });
}

export async function HEAD() { return GET(); }