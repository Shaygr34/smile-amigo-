"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [dark, setDark] = useState(false);
  const t = useTranslations("Theme");

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
    setMounted(true);
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  // Render placeholder to avoid layout shift, but invisible before mount
  if (!mounted) {
    return <div className="w-9 h-9" aria-hidden />;
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? t("switchToLight") : t("switchToDark")}
      className="relative w-9 h-9 flex items-center justify-center rounded-full transition-colors duration-normal hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-accent"
    >
      {/* Sun icon (shown in dark mode → click to go light) */}
      <svg
        className={`w-5 h-5 absolute transition-all duration-300 ${
          dark ? "opacity-100 rotate-0 scale-100" : "opacity-0 rotate-90 scale-0"
        }`}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
        />
      </svg>

      {/* Moon icon (shown in light mode → click to go dark) */}
      <svg
        className={`w-5 h-5 absolute transition-all duration-300 ${
          dark ? "opacity-0 -rotate-90 scale-0" : "opacity-100 rotate-0 scale-100"
        }`}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
        />
      </svg>
    </button>
  );
}
