import { ref } from "vue";

const UI_SCALE_KEY = "synonik-ui-scale";
const CONTENT_SELECTOR = ".view-inner";

export const uiScalePresets = [50, 75, 100, 110, 125, 150, 175, 200];

const uiScale = ref(100);

function applyZoom(percent: number): void {
  const content = document.querySelector<HTMLElement>(CONTENT_SELECTOR);
  if (content) content.style.zoom = percent === 100 ? "" : `${percent}%`;
}

export function useUiScale() {
  function apply(percent: number): void {
    uiScale.value = percent;
    applyZoom(percent);
    localStorage.setItem(UI_SCALE_KEY, String(percent));
  }

  function restore(): void {
    const saved = Number.parseInt(localStorage.getItem(UI_SCALE_KEY) ?? "100", 10);
    if (!uiScalePresets.includes(saved)) {
      localStorage.removeItem(UI_SCALE_KEY);
      return;
    }
    uiScale.value = saved;
    if (saved !== 100) applyZoom(saved);
  }

  return { uiScale, apply, restore };
}
