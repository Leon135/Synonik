import { getCurrentWindow } from "@tauri-apps/api/window";
import "../css/titlebar.css";

export default function Titlebar() {
  function handleWindowControl(action: string) {
    const appWindow = getCurrentWindow();

    switch (action) {
      case "minimize":
        appWindow.minimize();
        break;
      case "close":
        appWindow.minimize();
        appWindow.hide();
        break;
    }
  }

  return (
    <header data-tauri-drag-region="deep" class="syn-header">
      <section class="syn-header__title-container">
        <svg
          aria-hidden={true}
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="icon icon-tabler icons-tabler-outline icon-tabler-book-2 syn-header__icon"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M19 4v16h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h12" />
          <path d="M19 16h-12a2 2 0 0 0 -2 2" />
          <path d="M9 8h6" />
        </svg>
        <span class="syn-header__title">Synonik</span>
      </section>
      <section class="syn-header__win-controls">
        <button
          type="button"
          class="syn-header__win-btn"
          title="Zminimalizuj"
          aria-label="Zminimalizuj"
          onClick={() => handleWindowControl("minimize")}
        >
          <svg
            aria-hidden={true}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="icon icon-tabler icons-tabler-outline icon-tabler-chevron-compact-down"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M4 11l8 3l8 -3" />
          </svg>
        </button>
        <button
          type="button"
          class="syn-header__win-btn"
          title="Zamknij"
          aria-label="Zamknij"
          onClick={() => handleWindowControl("close")}
        >
          <svg
            aria-hidden={true}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="icon icon-tabler icons-tabler-outline icon-tabler-x"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M18 6l-12 12" />
            <path d="M6 6l12 12" />
          </svg>
        </button>
      </section>
    </header>
  );
}
