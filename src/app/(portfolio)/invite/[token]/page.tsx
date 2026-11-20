import { redirect } from "next/navigation";
import { redeemInvite } from "@/server/access/actions";
import { db, isLocalPreview, now, resource, validToken } from "@/server/access/local";

export default async function Invite({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const { invitationToken, springAccess } = await import("@/server/access/backend");
  if (springAccess() ? !invitationToken(token) : !await isLocalPreview() || !validToken(token) || !db().prepare(
    "SELECT id FROM requests WHERE invite = ? AND status = 'approved' AND cancelled IS NULL AND (used IS NULL OR reusable = 1) AND invite_until > ?"
  ).get(token, now())) redirect("/access?resource=mes-case&reason=invite");
  return <div className="page-section access-shell">
    <form className="panel concept-card access-card" action={redeemInvite}>
      <p className="eyebrow">PRIVATE INVITATION</p><h1>상세 자료 열람 초대</h1>
      <p className="muted">{springAccess() ? "전체 보호 자료" : resource.title} · 열람 시작 후 1시간</p>
      <input type="hidden" name="token" value={token} />
      <button className="button primary">열람 시작</button>
    </form>
  </div>;
}
