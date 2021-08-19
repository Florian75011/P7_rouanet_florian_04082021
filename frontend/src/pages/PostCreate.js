import { useRef, useState } from 'react'
import { useHistory } from 'react-router'
import Loader from '../components/Loader'
import { fetchPost } from '../utils/fetch'
import { uploadFile } from '../utils/uploadFile'
import { toast } from 'react-toastify'

export default function PostCreate() {
  const [fieldTitle, setFieldTitle] = useState('')
  const [fieldText, setFieldText] = useState('')
  const [imageFilePath, setImageFilePath] = useState('') // Chemin d'une image sauvegardée
  const [imageUpload, setImageUpload] = useState(null) // Image en cours d'upload
  const [errorTitle, setErrorTitle] = useState('')
  const [errorText, setErrorText] = useState('')

  const history = useHistory()
  const [displayPage, setDisplayPage] = useState(true)

  const inputFile = useRef(null)

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

  // La création de publication
  async function handleSubmit(e) {
    e.preventDefault()

    if (canSubmit()) {
      const body = {
        userId: localStorage.userId,
        title: fieldTitle,
        text: fieldText,
        image: imageFilePath,
      }
      // Envoie au serveur, cible la création de compte:
      setDisplayPage(false)
      let result
      if (imageUpload) {
        result = await uploadFile('post', '/api/post/', imageUpload, body)
      } else {
        result = await fetchPost('/api/post', body)
      }
      if (result.status === 201) {
        toast.success(result.message, {autoClose: 2000})
      } else {
        toast.error(result.message, {autoClose: 2000})
      }
      setDisplayPage(true)
      // Redirection de l'utilisateur inscrit:
      history.push('/')
    }
  }

  return (
    <Loader loadOn={displayPage === true}>
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
            <img
              alt=""
              src={`http://localhost:5000/uploads/${imageFilePath}`}
            />
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
        <button onClick={handleSubmit}>Envoyer votre publication</button>
      </form>
    </Loader>
  )
}
