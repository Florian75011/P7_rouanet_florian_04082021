// Par défault le Loader n'est pas chargé, il affichera les enfants si la condition est remplie
export default function Loader({ children, loadOn = false }) {
  return loadOn ? children : <div>Chargement en cours...</div>
}
