import { useRef, useCallback } from "react";

export default function useRovingList({ items = [], onActivate }) {
  // store refs for each item
  const refs = useRef([]);
  refs.current = refs.current.slice(0, items.length);
  const focusedIndexRef = useRef(0);

  const focusItem = useCallback((index) => {
    const el = refs.current[index];
    if (el && el.focus) {
      el.focus();
      focusedIndexRef.current = index;
    }
  }, []);

  const next = useCallback(() => {
    const nextIndex =
      (focusedIndexRef.current + 1) % Math.max(1, items.length);
    focusItem(nextIndex);
  }, [items.length, focusItem]);

  const prev = useCallback(() => {
    const prevIndex =
      (focusedIndexRef.current - 1 + Math.max(1, items.length)) %
      Math.max(1, items.length);
    focusItem(prevIndex);
  }, [items.length, focusItem]);

  const activate = useCallback(() => {
    const idx = focusedIndexRef.current;
    if (onActivate) onActivate(idx);
  }, [onActivate]);

  // helper to set initial focus (e.g., when area becomes active)
  const focusFirst = useCallback(() => {
    focusItem(0);
  }, [focusItem]);

  return {
    refs,
    focusedIndexRef,
    focusItem,
    focusFirst,
    next,
    prev,
    activate,
  };
}
