"use client";

import { useEffect } from "react";

export function AccessHistoryGuard({ role }: { role: "guest" | "admin" | "reader" }) {
  useEffect(() => {
    let refreshing = false;
    function refreshSensitiveHistory() {
      const path = window.location.pathname;
      if (
        path !== "/" &&
        !/^\/(work|lab|demos|admin|protected|access)(\/|$)/.test(path)
      )
        return;
      if (refreshing) return;
      refreshing = true;
      const main = document.getElementById("main-content");
      if (main) main.style.visibility = "hidden";
      // A new document request rechecks permissions instead of restoring a cached React tree.
      window.location.reload();
    }

    function restore(event: PageTransitionEvent) {
      if (event.persisted) refreshSensitiveHistory();
    }
    function visible() {
      if (document.visibilityState === "visible") refreshSensitiveHistory();
    }

    window.addEventListener("popstate", refreshSensitiveHistory, true);
    window.addEventListener("pageshow", restore);
    window.addEventListener("focus", refreshSensitiveHistory);
    document.addEventListener("visibilitychange", visible);
    // Same-browser tabs share cookies. Announce only the role, never credentials or IDs.
    const channel = typeof BroadcastChannel !== "undefined" ? new BroadcastChannel("portfolio-access-role") : null;
    if (channel) {
      channel.onmessage = event => {
        if (["guest", "admin", "reader"].includes(event.data) && event.data !== role)
          refreshSensitiveHistory();
      };
      channel.postMessage(role);
    }
    return () => {
      channel?.close();
      window.removeEventListener("popstate", refreshSensitiveHistory, true);
      window.removeEventListener("pageshow", restore);
      window.removeEventListener("focus", refreshSensitiveHistory);
      document.removeEventListener("visibilitychange", visible);
    };
  }, [role]);

  return null;
}
