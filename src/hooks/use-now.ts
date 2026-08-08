"use client";

import { useEffect, useState } from "react";

/**
 * Ticking clock for time-relative UI ("updated 4s ago"). Values live in the
 * store as timestamps; this is what makes their rendered form move.
 */
export function useNow(intervalMs = 1000) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return now;
}
