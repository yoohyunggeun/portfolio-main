"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function SessionStatus({
  expiresAt,
  serverNow,
  compact = false,
}: {
  expiresAt: string;
  serverNow: string;
  compact?: boolean;
}) {
  const [remaining, setRemaining] = useState(
    Math.max(0, Date.parse(expiresAt) - Date.parse(serverNow)),
  );
  const router = useRouter();
  useEffect(() => {
    const started = performance.now();
    const duration = Math.max(0, Date.parse(expiresAt) - Date.parse(serverNow));
    let refreshed = false;
    const tick = () => {
      const left = Math.max(0, duration - (performance.now() - started));
      setRemaining(left);
      if (!left && !refreshed) {
        refreshed = true;
        router.refresh();
      }
    };
    tick();
    const timer = setInterval(tick, 1000);
    const recheck = () => {
      if (document.visibilityState === "visible") router.refresh();
    };
    document.addEventListener("visibilitychange", recheck);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", recheck);
    };
  }, [expiresAt, serverNow, router]);
  const minutes = Math.ceil(remaining / 60000);
  const time = new Intl.DateTimeFormat("ko-KR", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Seoul",
  }).format(new Date(expiresAt));
  return (
    <span className="session-status">
      <span>
        {remaining ? `열람 가능 · ${minutes}분 남음` : "열람 시간 종료"}
      </span>
      {!compact && (
        <small>한국 시간 {time}까지 · 허용된 범위에서 열람 가능</small>
      )}
    </span>
  );
}
