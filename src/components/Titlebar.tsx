import { invoke } from "@tauri-apps/api/core";
import { getCurrentWindow, Window } from "@tauri-apps/api/window";
export default function Titlebar() {
    function handleWindowControl(action: string) {
        const appWindow: Window = getCurrentWindow();

        switch (action) {
            case "minimize":
                appWindow.minimize();
                appWindow.hide();
                break;
            case "close":
                invoke("quit_app_command");
                break;
        }
    }


    return (
        <>
            <header data-tauri-drag-region="deep" class="header">
                <section class="header__title-container">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-book-2 header__icon">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M19 4v16h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h12" />
                        <path d="M19 16h-12a2 2 0 0 0 -2 2" />
                        <path d="M9 8h6" />
                    </svg>
                    <span class="header__title">Synonik</span>
                </section>
                <section class="header__window-controls">
                    <button class="header__window-controls-button" title="Zminimalizuj" aria-label="Zminimalizuj" onClick={() => handleWindowControl("minimize")}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-chevron-compact-down">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M4 11l8 3l8 -3" />
                        </svg>
                    </button>
                    <button class="header__window-controls-button" title="Zamknij" aria-label="Zamknij" onClick={() => handleWindowControl("close")}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-x">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M18 6l-12 12" />
                            <path d="M6 6l12 12" />
                        </svg>
                    </button>
                </section>
            </header>
        </>
    )
}
