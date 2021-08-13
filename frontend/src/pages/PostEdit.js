import { useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import Loader from '../components/Loader'
import { fetchGet, fetchPost } from '../utils/fetch'
import queryString from 'query-string'

// Une copie de PostCreate.js sauf pour la gestion de l'ID de Post
export default function PostEdit() {
  const [fieldTitle, setFieldTitle] = useState('')
  const [fieldText, setFieldText] = useState('')
  const [errorTitle, setErrorTitle] = useState('')
  const [errorText, setErrorText] = useState('')

  const history = useHistory()
  const [displayPage, setDisplayPage] = useState(false)
  const [pageError, setPageError] = useState(null)

  // Gestion propre de la page
  useEffect(() => {
    async function loadPost(id) {
      const result = await fetchGet('/api/post/' + id)
      if (result.status === 200) {
        setFieldTitle(result.data.title)
        setFieldText(result.data.text)
        setDisplayPage(true) // réactivation de la page
      } else {
        // Signalement d'erreur
        setPageError({ code: result.status, message: result.message })
      }
    }
    const postId = Number(queryString.parse(history.location.search).id) // Garde les nombres pour l'id des pages
    if (!isNaN(postId)) {
      loadPost(postId)
    } else {
      setPageError({ code: 404, message: 'Page introuvable' }) // ID inexistant, donc erreur 404
    }
  }, [])

  function handleChangeTitle(e) {
    e.preventDefault()
    setFieldTitle(e.target.value)
  }

  function handleChangeText(e) {
    e.preventDefault()
    setFieldText(e.target.value)
  }

  function canSubmit() {
    setErrorTitle('')
    setErrorText('')
    let success = true
    // Valider titre:
    if (fieldTitle === '') {
      setErrorTitle('Veuillez remplir ce champ')
      success = false
    }
    // Valider texte:
    if (fieldText === '') {
      setErrorText('Veuillez remplir ce champ')
      success = false
    }
    return success
  }

  async function handleSubmit(e) {
    e.preventDefault()

    if (canSubmit()) {
      const body = {
        title: fieldTitle,
        text: fieldText,
      }
      // Envoie au serveur, cible la création de compte:
      const postId = Number(queryString.parse(history.location.search).id) // Garde les nombres pour l'id des pages
      await fetchPost('/api/post/' + postId, body)
        //   // Redirection de l'utilisateur inscrit:
        .then((res) => {
          history.push('/')
        })
        .catch((error) => {
          throw error
        })
    }
  }

  return (
    <Loader loadOn={displayPage === true} error={pageError}>
      <form>
        <input
          type="text"
          placeholder="Entrez le titre"
          value={fieldTitle}
          onChange={handleChangeTitle}
        />
        {errorTitle && <p className="form-error">{errorTitle}</p>}
        <textarea
          placeholder="Entrez le texte"
          value={fieldText}
          onChange={handleChangeText}
        />
        {errorText && <p className="form-error">{errorText}</p>}
        <button onClick={handleSubmit}>Envoyer votre publication</button>
      </form>
    </Loader>
  )
}
