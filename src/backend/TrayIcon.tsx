import { defaultWindowIcon } from '@tauri-apps/api/app';
import { invoke } from "@tauri-apps/api/core";
import { CheckMenuItem, Menu } from '@tauri-apps/api/menu';
import { TrayIcon } from '@tauri-apps/api/tray';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { disable, enable, isEnabled } from '@tauri-apps/plugin-autostart';

let trayInstance: TrayIcon | null = null;

async function showWindow() {
    const window = getCurrentWindow();
    await window.unminimize();
    await window.show();
    await window.setFocus();
}


export async function SetupTray() {
    if (trayInstance) {
        await trayInstance.close();
        trayInstance = null;
    }

    const autostartItem = await CheckMenuItem.new({
        id: "autostart",
        text: "Uruchamiaj przy starcie systemu",
        checked: await isEnabled(),
        action: async () => {
            if (await autostartItem.isChecked()) {
                await enable();
            } else {
                await disable();
            }
        }
    });

    const menu = await Menu.new({
        items: [
            {
                id: "show",
                text: "Pokaż",
                action: showWindow,
            },
            autostartItem,
            {
                id: "quit",
                text: "Zakończ",
                action: () => invoke("quit_app"),
            }
        ]
    })

    const options = {
        icon: await defaultWindowIcon(),
        menu,
        menuOnLeftClick: true,
        action: (event: any) => {
            if (event.type == 'DoubleClick') {
                showWindow();
            }
        }
    };

    // @ts-ignore
    trayInstance = await TrayIcon.new(options);
}

export async function CleanupTray() {
    if (trayInstance) {
        await trayInstance.close();
        trayInstance = null;
    }
}
