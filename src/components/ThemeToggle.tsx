"use client";

import { useEffect, useSyncExternalStore } from "react";

type Theme = "light" | "dark";

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener("taskflow-theme-change", onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener("taskflow-theme-change", onChange);
  };
}

function getThemeSnapshot(): Theme {
  return window.localStorage.getItem("taskflow-theme") === "dark" ? "dark" : "light";
}

function getServerThemeSnapshot(): Theme {
  return "light";
}

export default function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getThemeSnapshot, getServerThemeSnapshot);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  function toggleTheme() {
    const nextTheme = theme === "light" ? "dark" : "light";
    window.localStorage.setItem("taskflow-theme", nextTheme);
    window.dispatchEvent(new Event("taskflow-theme-change"));
  }

  return (
    <button
      className="theme-toggle"
      type="button"
      onClick={toggleTheme}
      aria-label={`Passer au thème ${theme === "light" ? "sombre" : "clair"}`}
    >
      {theme === "light" ? "Mode sombre" : "Mode clair"}
    </button>
  );
}
