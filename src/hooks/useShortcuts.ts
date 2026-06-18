import { listen } from "@tauri-apps/api/event";
import { useEffect, useRef } from "preact/hooks";
import { useHotkeys } from "react-hotkeys-hook";

export default function useShortcuts(
  callbacks: {
    setWordInput: (word: string) => void;
    get_synonyms: (word: string) => void;
  },
  inputRef: preact.RefObject<HTMLInputElement>,
) {
  const callbacksRef = useRef(callbacks);

  useEffect(() => {
    callbacksRef.current = callbacks;
  }, [callbacks]);

  useEffect(() => {
    let unlisten: (() => void) | undefined;

    async function init() {
      unlisten = await listen("shortcut-pressed-input", (event) => {
        callbacksRef.current.setWordInput(event.payload as string);
        callbacksRef.current.get_synonyms(event.payload as string);
      });
    }

    init();
    return () => {
      unlisten?.();
    };
  }, []);

  useHotkeys(
    ["ctrl+l", "/"],
    () => {
      inputRef.current?.focus();
    },
    { preventDefault: true, useKey: true },
  );
}
