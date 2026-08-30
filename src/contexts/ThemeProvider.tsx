import {
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  ThemeContext,
  type Theme,
} from "@/contexts/ThemeContext";

interface ThemeProviderProps {
  children: ReactNode;
}

const THEME_STORAGE_KEY = "meu-financeiro-theme";

function getInitialTheme(): Theme {
  const savedTheme = localStorage.getItem(
    THEME_STORAGE_KEY,
  );

  if (savedTheme === "light" || savedTheme === "dark") {
    return savedTheme;
  }

  return "dark";
}

export function ThemeProvider({
  children,
}: ThemeProviderProps) {
  const [theme, setTheme] =
    useState<Theme>(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;

    root.classList.toggle("light", theme === "light");

    localStorage.setItem(
      THEME_STORAGE_KEY,
      theme,
    );
  }, [theme]);

  function toggleTheme() {
    setTheme((previous) =>
      previous === "dark" ? "light" : "dark",
    );
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}