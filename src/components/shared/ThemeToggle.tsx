import { Moon, Sun } from "lucide-react";

import { useTheme } from "@/hooks/useTheme";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={
        isDark
          ? "Mudar para tema claro"
          : "Mudar para tema escuro"
      }
      title={
        isDark
          ? "Mudar para tema claro"
          : "Mudar para tema escuro"
      }
      className="flex h-10 w-10 items-center justify-center rounded-full border border-(--card-border) bg-(--card) text-(--muted) transition-colors hover:bg-white/5 hover:text-(--foreground)"
    >
      {isDark ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </button>
  );
}