import { getCurrentWindow } from "@tauri-apps/api/window";

export function SetupTitleBar() {
    const window = getCurrentWindow();

    window.onCloseRequested(async (event) => {
        event.preventDefault();
        await window.hide();
    })
}