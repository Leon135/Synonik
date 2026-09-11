import { invoke } from "@tauri-apps/api/core";
import { ref } from "vue";

const globalShortcut = ref("Control+F2");
const shortcutKeys = ref<string[]>([]);
const shortcutError = ref("");
const shortcutSaved = ref(false);

export function useGlobalShortcut() {
  async function load(): Promise<void> {
    try {
      globalShortcut.value = await invoke<string>("get_shortcut");
      shortcutKeys.value = globalShortcut.value.split("+").filter(Boolean);
    } catch (error) {
      console.error("[Synonik] Failed to get shortcut:", error);
    }
  }

  function recordKey(event: KeyboardEvent): void {
    event.preventDefault();
    shortcutSaved.value = false;
    shortcutError.value = "";
    if (!shortcutKeys.value.includes(event.key)) {
      shortcutKeys.value = [...shortcutKeys.value, event.key];
    }
  }

  function clear(): void {
    shortcutKeys.value = [];
    shortcutSaved.value = false;
  }

  async function save(): Promise<void> {
    const next = shortcutKeys.value.join("+");
    if (!next) return;
    shortcutError.value = "";
    shortcutSaved.value = false;
    try {
      await invoke("register_shortcut", { shortcut: next });
      globalShortcut.value = next;
      shortcutSaved.value = true;
    } catch (error) {
      shortcutError.value = String(error);
    }
  }

  return {
    globalShortcut,
    shortcutKeys,
    shortcutError,
    shortcutSaved,
    load,
    recordKey,
    clear,
    save,
  };
}
