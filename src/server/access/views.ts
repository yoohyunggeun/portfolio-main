import "server-only";
import {
  epoch,
  list,
  type InvitationRow,
  type RecipientRow,
  type SessionRow,
} from "./backend";

export async function accessLists() {
  const [recipients, links, sessions] = await Promise.all([
    list<RecipientRow>("recipients"),
    list<InvitationRow>("invitations"),
    list<SessionRow>("sessions"),
  ]);
  const targets = recipients.map((row) => ({
    ...row,
    application: row.application ?? "",
    cancelled: row.status === "revoked",
  })).sort((a,b)=>epoch(b.created_at ?? "")-epoch(a.created_at ?? "") || b.id.localeCompare(a.id));
  const invitations = links
    .map((row) => ({
      ...row,
      company:
        targets.find((target) => target.id === row.recipient_id)?.company ??
        "초대 대상",
      created: epoch(row.created_at),
      invite_until: epoch(row.expires_at),
      invite: "",
      reusable: row.max_redemptions !== 1 ? 1 : 0,
      used: row.status === "exhausted" ? 1 : null,
      cancelled: row.status === "revoked" ? 1 : null,
    }))
    .sort((a, b) => b.created - a.created);
  const readers = sessions
    .map((row) => {
      const link = invitations.find((item) => item.id === row.invitation_id);
      const recipientId = row.recipient_id ?? link?.recipient_id;
      return {
        ...row,
        recipient_id: recipientId,
        company:
          targets.find((target) => target.id === recipientId)?.company ??
          link?.company ??
          null,
        started: epoch(row.started_at),
        recent: epoch(row.last_seen_at),
        expires: epoch(row.expires_at),
        ended: row.status === "revoked" ? 1 : null,
      };
    })
    .sort((a, b) => b.started - a.started);
  return { targets, invitations, readers };
}
