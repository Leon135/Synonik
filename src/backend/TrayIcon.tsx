import { defaultWindowIcon } from '@tauri-apps/api/app';
import { Menu } from '@tauri-apps/api/menu';
import { TrayIcon } from '@tauri-apps/api/tray';


export async function SetupTray() {
    const menu = await Menu.new({
        items: [
            {
                id: "show",
                text: "Pokaż",
            },
            {
                id: "quit",
                text: "Zakończ",
            }
        ]
    })

    const options = {
        icon: await defaultWindowIcon(),
        menu,
        menuOnLeftClick: true,
    };

    const tray = await TrayIcon.new(options);
}
