"use client";
import { useActionState } from "react";
import { endAdmin } from "@/server/access/admin-end";
import { SignOutButton } from "./sign-out-button";
export function AdminEndForm() {
  const [state, action, pending] = useActionState(endAdmin, {});
  return (
    <form action={action} className="compact-end" aria-busy={pending}>
      <SignOutButton />
      {state.error && <p role="alert">{state.error}</p>}
    </form>
  );
}
