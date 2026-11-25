"use client";
import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
export function ManagementNotice({ kind }: { kind: "deleted" | "updated" }) {
  const node = useRef<HTMLParagraphElement>(null);
  const query = useSearchParams().toString();
  useEffect(() => node.current?.focus(), [query]);
  return (
    <p ref={node} tabIndex={-1} role="status" className="panel concept-card management-notice">
      {kind === "deleted"
        ? "기록 삭제 요청을 처리했습니다. 최신 목록을 확인해 주세요."
        : "종료·취소 요청을 처리했습니다. 최신 목록을 확인해 주세요."}
    </p>
  );
}
