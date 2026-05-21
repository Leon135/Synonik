import { getCurrentWindow } from '@tauri-apps/api/window';
import { readText, writeText } from '@tauri-apps/plugin-clipboard-manager';
import { register, unregister } from '@tauri-apps/plugin-global-shortcut';
import { key } from 'tauri-plugin-user-input-api';
;

async function getSelectedText() {
    // await new Promise(resolve => setTimeout(resolve, 100)); // Wait for clipboard to update

    const previousClipboardText = await readText();
    console.log("Previous clipboard content:", previousClipboardText);

    await key("KeyPress", "ControlLeft");
    await key("KeyPress", "KeyC");
    await key("KeyRelease", "KeyC");
    await key("KeyRelease", "ControlLeft");



    const clipboardText = await readText();
    await writeText(previousClipboardText); // Restore previous clipboard content
    console.log("Clipboard content after restore:", await readText());
    console.log("Selected text:", clipboardText);

    window.dispatchEvent(new CustomEvent("synonik-word-input", { detail: clipboardText }));
}

async function showWindow() {
    const window = getCurrentWindow();
    await window.unminimize();
    await window.show();
    await window.setFocus();
}

export async function SetupShortcut() {
    await register("Ctrl+F2", async (event) => {
        if (event.state !== "Pressed") return;
        console.log("Shortcut activated!");
        await getSelectedText();
        await showWindow();
    });
}

export async function TeardownShortcut() {
    await unregister("Ctrl+F2");
}