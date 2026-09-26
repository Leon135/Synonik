import { onMounted, onUnmounted, type Ref } from "vue";
import { invoke } from "@tauri-apps/api/core";
import { listen } from "@tauri-apps/api/event";
import hotkeys from "hotkeys-js";

export default function useShortcuts(
  getSynonyms: (word: string) => void,
  wordInput: Ref<string>,
  inputRef: Ref<HTMLInputElement | null>,
) {
  let unlisten: (() => void) | undefined;
  let isMounted = false;

  const applyWord = (word: string) => {
    wordInput.value = word;
    getSynonyms(word);
  };

  onMounted(async () => {
    isMounted = true;

    const cleanup = await listen("shortcut-pressed-input", (event) => {
      applyWord(event.payload as string);
      void invoke("take_pending_toggle").catch((error) => {
        console.error("[Synonik] Failed to drain pending toggle:", error);
      });
    });

    try {
      const pending = await invoke<string | null>("take_pending_toggle");
      if (pending) {
        applyWord(pending);
      }
    } catch (error) {
      console.error("[Synonik] Failed to take pending toggle:", error);
    }

    hotkeys("ctrl+l,/", (event: KeyboardEvent) => {
      event.preventDefault();
      inputRef.value?.focus();
    });

    if (!isMounted) {
      cleanup();
      hotkeys.unbind("ctrl+l,/");
      return;
    }

    unlisten = cleanup;
  });

  onUnmounted(() => {
    isMounted = false;
    unlisten?.();
    hotkeys.unbind("ctrl+l,/");
  });
}
