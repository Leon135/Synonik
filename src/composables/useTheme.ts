import { ref, watch } from "vue";

type Theme = "dark" | "light";

function getSavedTheme(): Theme | null {
  const saved = localStorage.getItem("synonik-theme");
  if (saved === "dark" || saved === "light") return saved;
  return null;
}

function getSystemTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
}

export function useTheme() {
  const theme = ref<Theme>(getSavedTheme() ?? getSystemTheme());

  watch(
    theme,
    (newTheme) => {
      applyTheme(newTheme);
      localStorage.setItem("synonik-theme", newTheme);
    },
    { immediate: true },
  );

  function toggle() {
    theme.value = theme.value === "dark" ? "light" : "dark";
  }

  return { theme, toggle };
}
