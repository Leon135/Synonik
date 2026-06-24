import { onMounted, onUnmounted, type Ref } from "vue";
import { listen } from "@tauri-apps/api/event";
import hotkeys from "hotkeys-js";

export default function useShortcuts(
  getSynonyms: (word: string) => void,
  wordInput: Ref<string>,
  inputRef: Ref<HTMLInputElement | null>,
) {
  let unlisten: (() => void) | undefined;

  onMounted(async () => {
    unlisten = await listen("shortcut-pressed-input", (event) => {
      wordInput.value = event.payload as string;
      getSynonyms(event.payload as string);
    });

    hotkeys("ctrl+l,/", (event) => {
      event.preventDefault();
      inputRef.value?.focus();
    });
  });

  onUnmounted(() => {
    unlisten?.();
    hotkeys.unbind("ctrl+l,/");
  });
}
