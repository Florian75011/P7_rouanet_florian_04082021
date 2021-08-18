import { useEffect, useRef, useState } from 'react'
import { useHistory } from 'react-router'
import Loader from '../components/Loader'
import { fetchDelete, fetchGet, fetchPost, fetchPut } from '../utils/fetch'
import queryString from 'query-string'
import { uploadFile } from '../utils/uploadFile'

// Une copie de PostCreate.js sauf pour la gestion de l'ID de Post
export default function PostEdit() {
  const [fieldTitle, setFieldTitle] = useState('')
  const [fieldText, setFieldText] = useState('')
  const [imageFilePath, setImageFilePath] = useState('') // Chemin d'une image sauvegardée
  const [imageUpload, setImageUpload] = useState(null) // Image en cours d'upload
  const [postUserId, setPostUserId] = useState('')
  const [postId, setPostId] = useState('')
  const [errorTitle, setErrorTitle] = useState('')
  const [errorText, setErrorText] = useState('')

  const history = useHistory()
  const [displayPage, setDisplayPage] = useState(false)
  const [pageError, setPageError] = useState(null)

  const inputFile = useRef(null)

  // Gestion propre de la page
  useEffect(() => {
    async function loadPost(id) {
      const result = await fetchGet('/api/post/' + id)
      console.log(result.data);
      if (result.status === 200) {
        setPostUserId(result.data.userId)
        setFieldTitle(result.data.title)
        setFieldText(result.data.text)
        setImageFilePath(result.data.imagePath)
        setPostId(result.data.id)
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

  function handleChangeImage(e) {
    e.preventDefault()
    const file = Array.from(e.target.files)[0] // Tenter de convertir les fichiers envoyés
    setImageUpload(file)
  }

  function handleDeleteImage(e) {
    e.preventDefault()
    setImageUpload(null)
    inputFile.current.value = '' // Vider l'image précédemment uploadé
    if (imageFilePath) {
      if (window.confirm("Voulez-vous supprimer l'image de publication ?")) {
        // alerte qui renvoie un bouléen vrai ou faux
        setImageFilePath('')
      }
    }
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
        image: imageFilePath,
      }
      // Envoie au serveur, cible la création de compte:
      const postId = Number(queryString.parse(history.location.search).id) // Garde les nombres pour l'id des pages
      if (imageUpload) {
        await uploadFile('put', '/api/post/' + postId, imageUpload, body)
      } else {
        await fetchPut('/api/post/' + postId, body)
      }
      // Redirection de l'utilisateur inscrit:
      history.push('/')
    }
  }

  async function handleDelete(e) {
    e.preventDefault()
    // Envoie au serveur, cible la création de compte:
    await fetchDelete('/api/post/' + postId)
      //   // Redirection de l'utilisateur inscrit:
      .then(() => {
        console.log('ok')
        history.push('/')
      })
      .catch((error) => {
        throw error
      })
  }

  return (
    <Loader loadOn={displayPage === true} error={pageError}>
      <form>
        <input
          type="file"
          ref={inputFile}
          onChange={handleChangeImage}
          accept="image/png, image/jpeg, image/gif"
        />
        {imageUpload ? (
          <img alt="" src={URL.createObjectURL(imageUpload)} />
        ) : (
          imageFilePath && (
            <img alt="" src={`http://localhost:5000/uploads/${imageFilePath}`} />
          )
        )}
        {(imageUpload || imageFilePath) && (
          <button onClick={handleDeleteImage}>Supprimer votre image</button>
        )}
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
        <button onClick={handleSubmit}>Modifier votre publication</button>
        {localStorage.userId == postUserId && (
          <button onClick={handleDelete}>Supprimer votre publication</button>
        )}
      </form>
    </Loader>
  )
}
