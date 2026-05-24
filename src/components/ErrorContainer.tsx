import "../css/error-container.css";

export default function ErrorContainer({ error }: { error: string }) {
    if (!error) return null;
    return (<div className="error-container">
        <h4>Wystąpił błąd:</h4>
        <p>{error}</p>
    </div>);
}