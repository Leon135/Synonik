import { onUnmounted, ref, watch } from "vue";
import { getCurrentWindow, type Effect } from "@tauri-apps/api/window";

const THEMES = ["system", "dark", "light"] as const;
export type Theme = (typeof THEMES)[number];

function isTheme(value: string | null): value is Theme {
  return value !== null && (THEMES as readonly string[]).includes(value);
}

function getSystemTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyWindowEffect(resolved: "dark" | "light") {
  // "micaDark"/"micaLight" are valid Rust-side WindowEffects but are missing
  // from the JS Effect type — cast is intentional
  const effect = (resolved === "dark" ? "micaDark" : "micaLight") as unknown as Effect;
  getCurrentWindow()
    .setEffects({ effects: [effect] })
    .catch(() => {
      /* Mica unavailable (e.g. Win10) — opaque fallback via CSS */
    });
}

function applyTheme(resolved: "dark" | "light") {
  document.documentElement.setAttribute("data-theme", resolved);
  applyWindowEffect(resolved);
}

export function useTheme() {
  const saved = localStorage.getItem("synonik-theme");
  const preference = ref<Theme>(isTheme(saved) ? saved : "system");

  function apply() {
    if (preference.value === "system") {
      applyTheme(getSystemTheme());
    } else {
      applyTheme(preference.value);
    }
  }

  watch(
    preference,
    (v) => {
      apply();
      localStorage.setItem("synonik-theme", v);
    },
    { immediate: true },
  );

  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  const onChange = () => {
    if (preference.value === "system") apply();
  };
  mq.addEventListener("change", onChange);
  onUnmounted(() => mq.removeEventListener("change", onChange));

  function set(value: Theme) {
    preference.value = value;
  }

  return { theme: preference, set };
}
