import { invoke } from "@tauri-apps/api/core";
import { writeText } from "@tauri-apps/plugin-clipboard-manager";
import { ref } from "vue";

const globalShortcut = ref("Control+F2");
const shortcutKeys = ref<string[]>([]);
const shortcutError = ref("");
const shortcutSaved = ref(false);
const isShortcutLoaded = ref(false);
const isManualShortcutMode = ref(false);
const manualToggleCommand = ref("synonik --toggle");
const manualCommandCopied = ref(false);
const detectedDesktopEnvironment = ref("unknown");
const isGnomeDesktop = ref(false);

export function useGlobalShortcut() {
  async function load(): Promise<void> {
    try {
      try {
        globalShortcut.value = await invoke<string>("get_shortcut");
        shortcutKeys.value = globalShortcut.value.split("+").filter(Boolean);
      } catch (error) {
        console.error("[Synonik] Failed to get shortcut:", error);
      }
      try {
        isManualShortcutMode.value = await invoke<boolean>("is_manual_shortcut");
      } catch (error) {
        console.error("[Synonik] Failed to check manual shortcut:", error);
        isManualShortcutMode.value = false;
      }
      if (isManualShortcutMode.value) {
        try {
          manualToggleCommand.value = await invoke<string>("get_toggle_command");
        } catch (error) {
          console.error("[Synonik] Failed to get toggle command:", error);
        }
        try {
          detectedDesktopEnvironment.value = await invoke<string>("get_desktop_environment");
          isGnomeDesktop.value = detectedDesktopEnvironment.value.toLowerCase().includes("gnome");
        } catch (error) {
          console.error("[Synonik] Failed to detect desktop:", error);
        }
      }
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
    shortcutError.value = "";
    try {
      await writeText(manualToggleCommand.value);
      manualCommandCopied.value = true;
    } catch (error) {
      shortcutError.value = String(error);
      console.error("[Synonik] Failed to copy toggle command:", error);
    }
  }

  function resetManualCommandCopied(): void {
    manualCommandCopied.value = false;
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
    detectedDesktopEnvironment,
    isGnomeDesktop,
    load,
    recordKey,
    clear,
    save,
    copyToggleCommand,
    resetManualCommandCopied,
  };
}
