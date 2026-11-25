"use client";

import { startTransition, useEffect, useLayoutEffect, useState } from "react";
import { AnimateView } from "motion/react-animate-view";
import { useReducedMotion } from "motion/react";
import { spring } from "motion";

export type PortfolioTheme = "black" | "white";
export const themeStorageKey = "portfolio-ui-theme-v33";

export function ThemeToggle() {
  const [theme, setTheme] = useState<PortfolioTheme>("black");
  const [ready, setReady] = useState(false);
  const reduced = useReducedMotion();
  useLayoutEffect(() => {
    if (!ready || document.documentElement.dataset.theme === theme) return;
    document.documentElement.dataset.theme = theme;
    window.dispatchEvent(new Event("portfolio-theme-change"));
  }, [theme, ready]);
  useEffect(() => {
    const read = () => setTheme(document.documentElement.dataset.theme === "white" ? "white" : "black");
    read();
    setReady(true);
    const sync = (event: StorageEvent) => {
      if (event.key !== themeStorageKey) return;
      document.documentElement.dataset.theme = event.newValue === "white" ? "white" : "black";
      read();
      window.dispatchEvent(new Event("portfolio-theme-change"));
    };
    window.addEventListener("storage", sync);
    window.addEventListener("portfolio-theme-change", read);
    return () => { window.removeEventListener("storage", sync); window.removeEventListener("portfolio-theme-change", read); };
  }, []);
  function toggle() {
    const next = theme === "black" ? "white" : "black";
    if (reduced) setTheme(next);
    else startTransition(() => setTheme(next));
    try { localStorage.setItem(themeStorageKey, next); } catch { /* The selected theme still works without storage. */ }
  }
  const transition = reduced ? { duration: 0 } : { type: spring, visualDuration: .2, bounce: .2 };
  return <AnimateView transition={transition}><button type="button" className="theme-toggle" disabled={!ready} onClick={toggle} style={{ justifyContent: theme === "white" ? "flex-end" : "flex-start", backgroundColor: theme === "white" ? "var(--accent)" : "var(--raised)" }} aria-label={theme === "black" ? "화이트 테마로 전환" : "블랙 테마로 전환"}>
    <AnimateView transition={transition}><span className="theme-toggle-handle">{theme === "black" ? "Black" : "White"}</span></AnimateView>
  </button></AnimateView>;
}
