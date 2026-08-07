"use client";

import { useTheme } from "@/lib/theme-context";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      className="rounded-full border border-neutral-300 px-3 py-1 text-sm dark:border-neutral-700"
    >
      {theme === "dark" ? "☀️" : "🌙"}
    </button>
  );
}
