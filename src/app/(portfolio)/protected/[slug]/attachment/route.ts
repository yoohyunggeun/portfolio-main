import { AccessError, apiResponse, springAccess } from "@/server/access/backend";

export const dynamic = "force-dynamic";
const headers = {
  "Cache-Control": "private, no-store",
  "X-Content-Type-Options": "nosniff",
};

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!springAccess() || slug !== "mes-case") return new Response(null, { status: 404, headers });
  try {
    const file = await apiResponse("content/protected/" + encodeURIComponent(slug) + "/attachment");
    if (!file.headers.get("Content-Type")?.toLowerCase().startsWith("application/pdf") || !file.body) {
      return new Response(null, { status: 503, headers });
    }
    return new Response(file.body, { headers: {
      ...headers,
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="mes-case.pdf"',
    } });
  } catch (error) {
    const status = error instanceof AccessError && [403, 404].includes(error.status) ? error.status : 503;
    return new Response(null, { status, headers });
  }
}
