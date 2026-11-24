"use client";

import { useEffect } from "react";

export function AccessHistoryGuard() {
  useEffect(() => {
    function refreshSensitiveHistory() {
      const path = window.location.pathname;
      if (
        path !== "/" &&
        !/^\/(work|lab|demos|admin|protected|access)(\/|$)/.test(path)
      )
        return;
      const main = document.getElementById("main-content");
      if (main) main.style.visibility = "hidden";
      // A new document request rechecks permissions instead of restoring a cached React tree.
      window.location.reload();
    }

    function restore(event: PageTransitionEvent) {
      if (event.persisted) refreshSensitiveHistory();
    }

    window.addEventListener("popstate", refreshSensitiveHistory, true);
    window.addEventListener("pageshow", restore);
    return () => {
      window.removeEventListener("popstate", refreshSensitiveHistory, true);
      window.removeEventListener("pageshow", restore);
    };
  }, []);

  return null;
}
