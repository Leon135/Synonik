import "../css/search-container.css";
import useSearch from "../hooks/useSearch";
import useShortcuts from "../hooks/useShortcuts";
import ErrorMessage from "./ErrorMessage";
import SynonymsList from "./SynonymsList";

export default function SearchContainer() {
  const search = useSearch();

  useShortcuts(
    { setWordInput: search.setWordInput, get_synonyms: search.get_synonyms },
    search.inputRef,
  );

  function onKeyDown(e: any) {
    if (e.key === "Enter") search.get_synonyms(search.wordInput);
    if (e.key === "ArrowRight")
      (document.querySelector(".card") as HTMLElement)?.focus();
  }

  return (
    <>
      <form
        class="search"
        onSubmit={(e) => {
          e.preventDefault();
          search.get_synonyms(search.wordInput);
        }}
      >
        <div class="search__input-wrapper">
          <input
            ref={search.inputRef}
            class="search__input"
            placeholder="Wpisz słowo..."
            value={search.wordInput}
            onInput={search.onInputChange}
            onKeyDown={onKeyDown}
          />
          {search.wordInput && (
            <button
              type="button"
              class="search__clear"
              onClick={search.onClear}
              aria-label="Wyczyść"
            >
              <svg
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
          )}
        </div>
        <button
          type="submit"
          class="button"
          disabled={!search.wordInput.trim() || search.isLoading}
        >
          {search.isLoading ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="icon icon-tabler icons-tabler-outline icon-tabler-loader-2 button__icon button__icon--spin"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M12 3a9 9 0 1 0 9 9" />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="icon icon-tabler icons-tabler-outline icon-tabler-search button__icon"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M3 10a7 7 0 1 0 14 0a7 7 0 1 0 -14 0" />
              <path d="M21 21l-6 -6" />
            </svg>
          )}
          Szukaj
        </button>
      </form>

      {search.showSynonyms && !search.isLoading && (
        <SynonymsList
          success={search.success}
          word={search.wordInput.trim()}
          synonymGroups={search.synonymGroups}
        />
      )}
      {search.error.length > 0 && <ErrorMessage error={search.error} />}
    </>
  );
}
