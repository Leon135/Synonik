import { onUnmounted, ref, watch } from "vue";

const THEMES = ["system", "dark", "light"] as const;
type Theme = (typeof THEMES)[number];

function isTheme(value: string | null): value is Theme {
  return value !== null && (THEMES as readonly string[]).includes(value);
}

function getSystemTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(resolved: "dark" | "light") {
  document.documentElement.setAttribute("data-theme", resolved);
}

export function useTheme() {
  const saved = localStorage.getItem("synonik-theme");
  const preference = ref<Theme>(isTheme(saved) ? saved : "system");

  function apply() {
    applyTheme(preference.value === "system" ? getSystemTheme() : preference.value);
  }

  watch(preference, (v) => { apply(); localStorage.setItem("synonik-theme", v); }, { immediate: true });

  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  const onChange = () => { if (preference.value === "system") apply(); };
  mq.addEventListener("change", onChange);
  onUnmounted(() => mq.removeEventListener("change", onChange));

  function toggle() {
    const map: Record<Theme, Theme> = { system: "light", light: "dark", dark: "system" };
    preference.value = map[preference.value];
  }

  return { theme: preference, toggle };
}
