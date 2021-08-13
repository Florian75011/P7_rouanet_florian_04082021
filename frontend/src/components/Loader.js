import Error from "./Error"

// Par défault le Loader n'est pas chargé, il affichera dynamiquement les enfants si la condition est remplie
export default function Loader({ children, loadOn = false, error = null }) {
  if (error) {
    return <Error code={error.code} message={error.message} />
  }
  return loadOn ? children : <div>Chargement en cours...</div>
}
