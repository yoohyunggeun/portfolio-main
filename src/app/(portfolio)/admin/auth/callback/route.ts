import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { api, invitationToken, setBackendCookie, springAccess } from "@/server/access/backend";

export async function GET(request: NextRequest) {
  const origin = process.env.PORTFOLIO_ACCESS_ORIGIN;
  if (!springAccess() || !origin) return new NextResponse(null, { status: 404 });
  const jar = await cookies();
  const name = "__Host-portfolio-oidc";
  const [expected, verifier] = (jar.get(name)?.value ?? "").split(".");
  jar.delete(name);
  const { searchParams } = request.nextUrl;
  const state = searchParams.get("state");
  const code = searchParams.get("code");
  if (!state || state !== expected || !code || !invitationToken(verifier ?? "")) {
    return NextResponse.redirect(new URL("/admin/login?error=google", origin));
  }
  try {
    const session = await api<{ token: string; maxAgeSeconds: number }>("admin/auth/exchange", {
      method: "POST", body: { state, verifier, code }, includeSessions: false,
    });
    await setBackendCookie("admin", session.token, session.maxAgeSeconds);
    await setBackendCookie("reader", "", 0);
    return NextResponse.redirect(new URL("/admin", origin));
  } catch {
    return NextResponse.redirect(new URL("/admin/login?error=google", origin));
  }
}
