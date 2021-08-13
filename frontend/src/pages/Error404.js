import Error from "../components/Error";

// La page de secours au cas où l'URL n'existe pas - il comprend deux props
export default function Error404() {
  return <Error code='404' message='Page introuvable' />
}
