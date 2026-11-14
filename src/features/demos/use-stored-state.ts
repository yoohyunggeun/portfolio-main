"use client";

import { useEffect, useState } from "react";

export function useStoredState<T>(key: string, initial: T) {
  const [value, setValue] = useState(initial);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved !== null) setValue(JSON.parse(saved));
    } catch {
      // The demo can still run in memory when storage is unavailable.
    }
    setReady(true);
  }, [key]);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Keep the current session usable.
    }
  }, [key, ready, value]);

  return [value, setValue, ready] as const;
}
