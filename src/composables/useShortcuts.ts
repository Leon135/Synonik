import { onMounted, onUnmounted, type Ref } from "vue";
import { listen } from "@tauri-apps/api/event";
import hotkeys from "hotkeys-js";

export default function useShortcuts(
  getSynonyms: (word: string) => void,
  wordInput: Ref<string>,
  inputRef: Ref<HTMLInputElement | null>,
) {
  let unlisten: (() => void) | undefined;
  let isMounted = false;

  onMounted(async () => {
    isMounted = true;

    const cleanup = await listen("shortcut-pressed-input", (event) => {
      wordInput.value = event.payload as string;
      getSynonyms(event.payload as string);
    });

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
