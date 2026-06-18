import { getCurrentWindow } from "@tauri-apps/api/window";
import "../css/titlebar.css";

export default function Titlebar({
  theme,
  onToggleTheme,
}: {
  theme: string;
  onToggleTheme: () => void;
}) {
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
        <img src="/icon.svg" alt="Synonik" class="syn-header__icon" />
        <span class="syn-header__title">Synonik</span>
      </section>
      <section class="syn-header__win-controls">
        <button
          type="button"
          class="syn-header__win-btn"
          title={theme === "dark" ? "Tryb jasny" : "Tryb ciemny"}
          aria-label={theme === "dark" ? "Tryb jasny" : "Tryb ciemny"}
          onClick={onToggleTheme}
        >
          {theme === "dark" ? (
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
              class="lucide lucide-moon-icon lucide-moon"
            >
              <path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401" />
            </svg>
          ) : (
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
              class="lucide lucide-sun-medium-icon lucide-sun-medium"
            >
              <circle cx="12" cy="12" r="4" />
              <path d="M12 3v1" />
              <path d="M12 20v1" />
              <path d="M3 12h1" />
              <path d="M20 12h1" />
              <path d="m18.364 5.636-.707.707" />
              <path d="m6.343 17.657-.707.707" />
              <path d="m5.636 5.636.707.707" />
              <path d="m17.657 17.657.707.707" />
            </svg>
          )}
        </button>
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
