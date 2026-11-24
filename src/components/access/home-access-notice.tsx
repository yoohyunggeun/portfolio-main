"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

export function HomeAccessNotice() {
  const notice = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = notice.current;
    if (!element || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      if (
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
        !element.contains(document.activeElement)
      ) {
        element.animate([{ opacity: 0 }, { opacity: 1 }], {
          duration: 180,
          easing: "ease-out",
        });
      }
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <aside
      ref={notice}
      className="panel home-access-notice"
      aria-labelledby="home-access-title"
    >
      <h2 id="home-access-title">프로젝트 상세 자료</h2>
      <p className="muted">승인 후 초대 링크로 허용된 자료를 볼 수 있어요.</p>
      <Link href="/access" className="button primary">
        상세 자료 열람 요청 →
      </Link>
    </aside>
  );
}
