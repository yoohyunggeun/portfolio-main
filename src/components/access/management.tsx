"use client";

import { InviteLink } from "./forms";
import { useActionState } from "react";
import { manageAccess } from "@/server/access/management";

export function ManageForm({ operation, id, children, label }: {
  operation: string; id?: string; children?: React.ReactNode; label: string;
}) {
  const [message, action, pending] = useActionState(manageAccess, "");
  return <form action={action} className="access-card">
    <input type="hidden" name="operation" value={operation} />
    {id && <input type="hidden" name="id" value={id} />}
    {children}
    <button className={operation === "issue" ? "button primary" : "button"} disabled={pending}>{pending ? "처리 중…" : label}</button>
    {message.startsWith("/invite/") ? <InviteLink path={message} /> : message && <p role="status">{message}</p>}
  </form>;
}
