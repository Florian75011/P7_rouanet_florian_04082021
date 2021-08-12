import { useState } from 'react'
import { useHistory } from 'react-router'
import Loader from '../components/Loader'
import { fetchPost } from '../utils/fetch'

export default function PostCreate() {
  const [fieldTitle, setFieldTitle] = useState('')
  const [fieldText, setFieldText] = useState('')
  const [errorTitle, setErrorTitle] = useState('')
  const [errorText, setErrorText] = useState('')

  const history = useHistory()
  const [displayPage, setDisplayPage] = useState(true)

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
      console.log(body)
      //   const result = await fetchPost('/api/user/profile', body)
      //   console.log(result)
      //   // Redirection de l'utilisateur inscrit:
      //   switch (result.status) {
      //     case 200:
      //       console.log('Redirection')
      //       history.push('/')
      //       break
      //     case 400:
      //       console.log('Erreur')
      //       break
      //     default:
      //       console.log('Erreur')
      //   }
    }
  }

  return (
    <Loader loadOn={displayPage === true}>
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
