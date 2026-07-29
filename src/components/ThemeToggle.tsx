"use client";

import React, { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("datacrumbs-theme") as "dark" | "light" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      applyTheme(savedTheme);
    } else {
      // Default to dark mode
      applyTheme("dark");
    }
  }, []);

  const applyTheme = (newTheme: "dark" | "light") => {
    const root = document.documentElement;
    if (newTheme === "light") {
      root.classList.remove("dark");
      root.classList.add("light");
    } else {
      root.classList.remove("light");
      root.classList.add("dark");
    }
  };

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("datacrumbs-theme", nextTheme);
    applyTheme(nextTheme);
  };

  if (!mounted) return null;

  return (
    <button
      onClick={toggleTheme}
      type="button"
      title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
      className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-amber-400 border border-slate-300 dark:border-slate-700/80 hover:scale-105 active:scale-95 transition-all shadow-md flex items-center justify-center gap-1.5"
    >
      {theme === "dark" ? (
        <>
          <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" />
          <span className="text-xs font-semibold text-slate-200 hidden sm:inline">Light</span>
        </>
      ) : (
        <>
          <Moon className="w-4 h-4 text-slate-700" />
          <span className="text-xs font-semibold text-slate-800 hidden sm:inline">Dark</span>
        </>
      )}
    </button>
  );
};
