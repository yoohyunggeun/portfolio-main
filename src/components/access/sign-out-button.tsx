"use client";
import { useFormStatus } from "react-dom";
export function SignOutButton({ reader = false }: { reader?: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button className="button outline sign-out" disabled={pending}>
      <svg
        aria-hidden="true"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
      >
        <path d="M10 4H4v16h6M13 7l5 5-5 5M8 12h12" />
      </svg>
      {pending ? "종료 중…" : reader ? "열람 종료" : "로그아웃"}
    </button>
  );
}
