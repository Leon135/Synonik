import { useCallback, useEffect, useState } from "preact/hooks";

type Theme = "dark" | "light";

function getSavedTheme(): Theme | null {
  const saved = localStorage.getItem("synonik-theme");
  if (saved === "dark" || saved === "light") return saved;
  return null;
}

function getSystemTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
}

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
}

export default function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() => {
    return getSavedTheme() ?? getSystemTheme();
  });

  useEffect(() => {
    applyTheme(theme);
    localStorage.setItem("synonik-theme", theme);
  }, [theme]);

  const toggle = useCallback(() => {
    setThemeState((t) => (t === "dark" ? "light" : "dark"));
  }, []);

  return { theme, toggle };
}
