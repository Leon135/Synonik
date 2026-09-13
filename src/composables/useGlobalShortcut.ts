import { invoke } from "@tauri-apps/api/core";
import { ref } from "vue";

const globalShortcut = ref("Control+F2");
const shortcutKeys = ref<string[]>([]);
const shortcutError = ref("");
const shortcutSaved = ref(false);
const isShortcutLoaded = ref(false);
const isManualShortcutMode = ref(false);
const manualToggleCommand = ref("synonik --toggle");
const manualCommandCopied = ref(false);

export function useGlobalShortcut() {
  async function load(): Promise<void> {
    try {
      globalShortcut.value = await invoke<string>("get_shortcut");
      shortcutKeys.value = globalShortcut.value.split("+").filter(Boolean);
      isManualShortcutMode.value = await invoke<boolean>("is_manual_shortcut");
      if (isManualShortcutMode.value) {
        manualToggleCommand.value = await invoke<string>("get_toggle_command");
      }
    } catch (error) {
      console.error("[Synonik] Failed to get shortcut:", error);
    } finally {
      isShortcutLoaded.value = true;
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

  async function copyToggleCommand(): Promise<void> {
    manualCommandCopied.value = false;
    try {
      await navigator.clipboard.writeText(manualToggleCommand.value);
      manualCommandCopied.value = true;
    } catch (error) {
      console.error("[Synonik] Failed to copy toggle command:", error);
    }
  }

  return {
    globalShortcut,
    shortcutKeys,
    shortcutError,
    shortcutSaved,
    isShortcutLoaded,
    isManualShortcutMode,
    manualToggleCommand,
    manualCommandCopied,
    load,
    recordKey,
    clear,
    save,
    copyToggleCommand,
  };
}
