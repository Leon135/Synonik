import "../css/error-message.css";

export default function ErrorMessage({ error }: { error: string }) {
  if (!error) return null;

  return (
    <div class="syn-error">
      <h4 class="syn-error__title">Wystąpił błąd:</h4>
      <p class="syn-error__text">{error}</p>
    </div>
  );
}
