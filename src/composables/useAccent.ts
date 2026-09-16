import { invoke } from "@tauri-apps/api/core";

function relativeLuminance(red: number, green: number, blue: number): number {
  const channel = (value: number): number => {
    const srgb = value / 255;
    return srgb <= 0.04045 ? srgb / 12.92 : Math.pow((srgb + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * channel(red) + 0.7152 * channel(green) + 0.0722 * channel(blue);
}

export async function loadSystemAccent(): Promise<void> {
  try {
    const accent = await invoke<string | null>("get_accent_color");
    if (!accent) return;
    const m = accent.trim().match(/^#([0-9a-fA-F]{6})$/);
    if (!m) return;
    const hex = m[1];
    const red = Number.parseInt(hex.slice(0, 2), 16);
    const green = Number.parseInt(hex.slice(2, 4), 16);
    const blue = Number.parseInt(hex.slice(4, 6), 16);
    const root = document.documentElement.style;
    root.setProperty("--syn-accent", `rgb(${red}, ${green}, ${blue})`);
    root.setProperty(
      "--syn-on-accent",
      relativeLuminance(red, green, blue) > 0.179 ? "#000" : "#fff",
    );
  } catch (error) {
    console.error("[Synonik] Failed to get accent color:", error);
  }
}
