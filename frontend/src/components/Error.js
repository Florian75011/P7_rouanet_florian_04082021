// Composant universel de l'affichage des erreurs
export default function Error({code, message}) {
    return (
        <div>
            <h1>Erreur {code}</h1>
            <p>{message}</p>
        </div>
    )
}