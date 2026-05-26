import "../css/error-message.css";

export default function ErrorMessage({ error }: { error: string }) {
  if (!error) return null;

  return (
    <div className="error-message">
      <h4>Wystąpił błąd:</h4>
      <p>{error}</p>
    </div>
  );
}
