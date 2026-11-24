"use client";

import { InviteLink } from "./forms";
import { useActionState, useEffect, useRef } from "react";
import { manageAccess } from "@/server/access/management";

export function ManageForm({
  operation,
  id,
  children,
  label,
  returnRecipient,
}: {
  operation: string;
  id?: string;
  children?: React.ReactNode;
  label: string;
  returnRecipient?: string;
}) {
  const [message, action, pending] = useActionState(manageAccess, "");
  const submitted = useRef(false);
  const result = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!pending) submitted.current = false;
    if (!pending && message) result.current?.focus();
  }, [message, pending]);
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (submitted.current) event.preventDefault();
        else submitted.current = true;
      }}
      className="access-card"
      aria-busy={pending}
    >
      <input type="hidden" name="operation" value={operation} />
      {id && <input type="hidden" name="id" value={id} />}
      {returnRecipient && (
        <input type="hidden" name="returnRecipient" value={returnRecipient} />
      )}
      {children}
      <button
        className={operation === "issue" ? "button primary" : "button"}
        disabled={pending || (operation === "issue" && Boolean(message))}
      >
        {pending ? "처리 중…" : label}
      </button>
      {operation === "issue" && message && (
        <p className="muted">
          중복 생성을 막기 위해 이번 발급 제출은 잠갔습니다. 결과를 확인한 뒤{" "}
          <a className="text-link" href="/admin/invitations">
            대상·발급 상태를 새로 조회
          </a>
          하고, 추가 링크는 기존 대상을 선택해 발급해 주세요.
        </p>
      )}
      {message && (
        <div
          ref={result}
          tabIndex={-1}
          className="access-card"
          aria-label="관리 작업 결과"
        >
          {message.startsWith("/invite/") ? (
            <>
              <p role="status">초대 링크를 생성했습니다.</p>
              <InviteLink path={message} />
            </>
          ) : (
            <p role="status">{message}</p>
          )}
        </div>
      )}
    </form>
  );
}
