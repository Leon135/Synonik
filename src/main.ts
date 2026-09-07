import { createApp } from "vue";
import { invoke } from "@tauri-apps/api/core";
import App from "./App.vue";
import "./winui/styles/theme.css";
import "./css/base.css";

const app = createApp(App);
app.mount("#root");

if (import.meta.env.DEV) {
  window.addEventListener(
    "click",
    (event) => {
      const target = event.target as HTMLElement | null;
      console.log(
        "[diag] click on:",
        target?.tagName,
        target?.className,
        "| inside radio label:",
        target?.closest?.(".win-radio-button") !== null,
        "| document.body.style.zoom:",
        document.body.style.zoom || "1",
      );
    },
    true,
  );
}

function relativeLuminance(r: number, g: number, b: number): number {
  const channel = (value: number) => {
    const srgb = value / 255;
    return srgb <= 0.04045 ? srgb / 12.92 : Math.pow((srgb + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

invoke<string | null>("get_accent_color")
  .then((color) => {
    if (!color) return;
    const [r, g, b] = color
      .replace("rgba(", "")
      .replace(")", "")
      .split(",")
      .map((part) => Number.parseInt(part.trim(), 10));

    const root = document.documentElement.style;
    root.setProperty("--accent-base", `rgb(${r}, ${g}, ${b})`);
    root.setProperty("--accent-hover", `rgba(${r}, ${g}, ${b}, 0.9)`);
    root.setProperty("--accent-pressed", `rgba(${r}, ${g}, ${b}, 0.8)`);
    root.setProperty("--accent-aa-fill", `rgb(${r}, ${g}, ${b})`);
    root.setProperty("--accent-aa-text", relativeLuminance(r, g, b) > 0.4 ? "#000000" : "#FFFFFF");
    root.setProperty("--accent-text", root.getPropertyValue("--accent-aa-text"));
    root.setProperty(
      "--TextOnAccentFillColorPrimaryBrush",
      root.getPropertyValue("--accent-aa-text"),
    );
    root.setProperty("--brand", `rgb(${r}, ${g}, ${b})`);
    root.setProperty("--brand-hover", `rgba(${r}, ${g}, ${b}, 0.9)`);
    // Library controls (WinTextBox focus underline, WinRadioButtons, etc.)
    // resolve these hardcoded brushes instead of --accent-base
    root.setProperty("--AccentFillColorDefaultBrush", `rgb(${r}, ${g}, ${b})`);
    root.setProperty("--AccentFillColorSecondaryBrush", `rgba(${r}, ${g}, ${b}, 0.9)`);
    root.setProperty("--AccentFillColorTertiaryBrush", `rgba(${r}, ${g}, ${b}, 0.8)`);
  })
  .catch((error) => {
    console.error("[Synonik] Failed to get accent color:", error);
  });
