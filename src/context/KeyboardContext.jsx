import React, { createContext, useContext, useRef, useEffect } from "react";

const KeyboardContext = createContext();

export const useKeyboard = () => useContext(KeyboardContext);

/**
 * keyboard registry design:
 * registry.current = {
 *   activeArea: "notes" | "sidebar" | "search" | null,
 *   areas: {
 *     notes: { next, prev, activate, focus, blur },
 *     sidebar: { ... }
 *   }
 * }
 *
 * Each area is responsible for implementing next/prev/activate/focus functions.
 **/
export const KeyboardProvider = ({ children }) => {
  const registry = useRef({
    activeArea: null,
    areas: {},
  });

  const registerArea = (name, handlers) => {
    registry.current.areas[name] = handlers;
  };

  const unregisterArea = (name) => {
    delete registry.current.areas[name];
  };

  const setActiveArea = (name) => {
    registry.current.activeArea = name;
  };

  const handleKey = (e) => {
    // normalize modifiers
    const meta = e.ctrlKey || e.metaKey;
    const active = registry.current.activeArea;
    const area = active ? registry.current.areas[active] : null;

    // Global shortcuts
    if((e.key === "k" && meta) || e.key === "/") {
      // focus search area
      e.preventDefault();
      const search = registry.current.areas["search"];
      if (search && search.focus) search.focus();
      registry.current.activeArea = "search";
      return;
    }

    if (e.key === "n" && !meta) {
      // new note
      const globalNew = registry.current.areas["global"];
      if (globalNew && globalNew.newNote) {
        e.preventDefault();
        globalNew.newNote();
      }
      return;
    }

    if (e.key === "Escape") {
      // close popups (global)
      const global = registry.current.areas["global"];
      if (global && global.closePopup) {
        global.closePopup();
        e.preventDefault();
      }
      return;
    }

    // If there's an active area delegate keys
    if (area) {
      // navigation keys: j / k / ArrowDown / ArrowUp
      if (e.key === "j" || e.key === "ArrowDown") {
        e.preventDefault();
        if (area.next) area.next();
        return;
      }
      if (e.key === "k" || e.key === "ArrowUp") {
        e.preventDefault();
        if (area.prev) area.prev();
        return;
      }
      
      if (e.key === "Enter") {
        e.preventDefault();
        if (area.activate) area.activate();
        return;
      }
      if (e.key === "Tab") {
        // allow tab normally — but switch active area when focus leaves
        setTimeout(() => {
          // after tab focus changes, see who has focus and set activeArea accordingly (optional)
        }, 0);
      }
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const value = {
    registerArea,
    unregisterArea,
    setActiveArea,
    registry, // for advanced use if needed
  };

  return (
    <KeyboardContext.Provider value={value}>
      {children}
    </KeyboardContext.Provider>
  );
};
