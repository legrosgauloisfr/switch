"use client";

import { useEffect, useRef, useState } from "react";

// Protects admin form work against an accidental tab close (brief §27). Debounce-saves the
// current form value to localStorage; on mount, offers to restore a draft newer than the
// value the form actually opened with. Call `clearDraft()` after a successful save.
export function useAdminDraft<T>(key: string, value: T, onRestore: (v: T) => void) {
  const storageKey = `switch-admin-draft:${key}`;
  const [hasDraft, setHasDraft] = useState(false);
  const restoredOrDismissed = useRef(false);

  useEffect(() => {
    if (restoredOrDismissed.current) return;
    try {
      const raw = localStorage.getItem(storageKey);
      // Deliberate one-time mount check, not a subscription: initial value stays false on
      // both server and client's first paint (no hydration mismatch), only flips after.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setHasDraft(true);
    } catch {
      /* ignore */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      try {
        localStorage.setItem(storageKey, JSON.stringify(value));
      } catch {
        /* storage full or unavailable — drafts are a convenience, not critical */
      }
    }, 600);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(value)]);

  const restore = () => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) onRestore(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    restoredOrDismissed.current = true;
    setHasDraft(false);
  };

  const dismiss = () => {
    restoredOrDismissed.current = true;
    setHasDraft(false);
  };

  const clearDraft = () => {
    try {
      localStorage.removeItem(storageKey);
    } catch {
      /* ignore */
    }
  };

  return { hasDraft, restore, dismiss, clearDraft };
}
