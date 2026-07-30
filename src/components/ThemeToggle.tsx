"use client";

import React from "react";
import { Sun, Moon } from "lucide-react";

export const ThemeToggle: React.FC = () => {
  const toggleTheme = () => {
    const root = document.documentElement;
    const nextTheme = root.classList.contains("dark") ? "light" : "dark";
    root.classList.remove("light", "dark");
    root.classList.add(nextTheme);
    localStorage.setItem("datacrumbs-theme", nextTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      type="button"
      title="Switch between Light & Dark Mode"
      aria-label="Switch between Light & Dark Mode"
      className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-amber-400 border border-slate-300 dark:border-slate-700/80 hover:scale-105 active:scale-95 transition-all shadow-md flex items-center justify-center gap-1.5"
    >
      {/* Which face shows is driven purely by the html.dark class, so the button
          renders identically on the server and before hydration. */}
      <span className="hidden dark:flex items-center gap-1.5">
        <Sun className="w-4 h-4 text-amber-400" />
        <span className="text-xs font-semibold text-slate-200 hidden sm:inline">Light</span>
      </span>
      <span className="flex dark:hidden items-center gap-1.5">
        <Moon className="w-4 h-4 text-slate-700" />
        <span className="text-xs font-semibold text-slate-800 hidden sm:inline">Dark</span>
      </span>
    </button>
  );
};
