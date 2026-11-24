"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
// Server guards remain authoritative. This removes a previously authorized DOM at its known expiry.
export function PermissionBoundary({
  expiresAt,
  serverNow,
  children,
}: {
  expiresAt: string | null;
  serverNow: string;
  children: React.ReactNode;
}) {
  const [expired, setExpired] = useState(false);
  const router = useRouter();
  useEffect(() => {
    setExpired(false);
    if (!expiresAt) return;
    const duration = Math.max(0, Date.parse(expiresAt) - Date.parse(serverNow));
    const started = performance.now();
    let refreshed = false;
    const tick = () => {
      if (performance.now() - started >= duration && !refreshed) {
        refreshed = true;
        setExpired(true);
        router.refresh();
      }
    };
    tick();
    const timer = setInterval(tick, 500);
    return () => clearInterval(timer);
  }, [expiresAt, serverNow, router]);
  return expired ? (
    <section className="page-section">
      <h1>열람 시간이 종료되었습니다</h1>
      <p>열람 상태를 다시 확인해 주세요.</p>
      <Link className="button" href="/access/status">
        열람 상태 확인
      </Link>
    </section>
  ) : (
    children
  );
}
