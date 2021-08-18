import { useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import { fetchGet, fetchPost } from '../utils/fetch'
import Loader from '../components/Loader'

export default function Profile() {
  const [fieldFirstName, setFieldFirstName] = useState('')
  const [fieldLastName, setFieldLastName] = useState('')
  const [errorFirstName, setErrorFirstName] = useState('')
  const [errorLastName, setErrorLastName] = useState('')

  const history = useHistory()
  const [displayPage, setDisplayPage] = useState(false)

  // Gestion de l'affichage du profile du site
  useEffect(() => {
    async function loadProfile() {
      // On reçoit des données du backend quand la réponse est ok pour les mettre à jour
      const result = await fetchGet('/api/user/profile')
      if (result.status === 200) {
        setFieldFirstName(result.data.firstName)
        setFieldLastName(result.data.lastName)
        setDisplayPage(true)
      } else {
        // Redirection du non-authentifié en page connnexion
        if (result.status === 401) {
          history.push('/login')
        }
        // Gérer autres erreurs
      }
    }
    loadProfile()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // lancer ceci seulement au chargement de la page après vérif (protection frontend)

  function handleChangeFirstName(e) {
    e.preventDefault()
    setFieldFirstName(e.target.value)
  }

  function handleChangeLastName(e) {
    e.preventDefault()
    setFieldLastName(e.target.value)
  }

  function canSubmit() {
    setErrorFirstName('')
    setErrorLastName('')
    let success = true
    // Valider prénom:
    if (fieldFirstName === '') {
      setErrorFirstName('Veuillez remplir ce champ')
      success = false
    }
    // Valider nom:
    if (fieldLastName === '') {
      setErrorLastName('Veuillez remplir ce champ')
      success = false
    }
    return success
  }

  async function handleSubmit(e) {
    e.preventDefault()

    if (canSubmit()) {
      const body = {
        firstName: fieldFirstName,
        lastName: fieldLastName,
      }
      // Envoie au serveur, cible la création de compte:
      const result = await fetchPost('/api/user/profile', body)
      // Redirection de l'utilisateur inscrit:
      switch (result.status) {
        case 200:
          history.push('/')
          break
        case 400:
          console.log('Erreur')
          break
        default:
          console.log('Erreur')
      }
    }
  }

  return (
    <Loader loadOn={displayPage === true}>
      <form>
        <input
          type="text"
          placeholder="Entrez votre prénom"
          value={fieldFirstName}
          onChange={handleChangeFirstName}
        />
        {errorFirstName && <p className="form-error">{errorFirstName}</p>}
        <input
          type="text"
          placeholder="Entrez votre nom"
          value={fieldLastName}
          onChange={handleChangeLastName}
        />
        {errorLastName && <p className="form-error">{errorLastName}</p>}
        <button onClick={handleSubmit}>Modifier le profil</button>
        <button>Supprimer le profil</button>
      </form>
    </Loader>
  )
}
