import { useHistory } from 'react-router'
import { useState } from 'react'
import { fetchPost } from '../utils/fetch'
import { isValidEmail, isValidPassword } from '../utils/validation'

export default function Signup() {
  // Variables contenants nos champs et nos erreurs - hooks
  const [fieldFirstName, setFieldFirstName] = useState('')
  const [fieldLastName, setFieldLastName] = useState('')
  const [fieldEmail, setFieldEmail] = useState('')
  const [fieldPassword, setFieldPassword] = useState('')
  const [errorFirstName, setErrorFirstName] = useState('')
  const [errorLastName, setErrorLastName] = useState('')
  const [errorEmail, setErrorEmail] = useState('')
  const [errorPassword, setErrorPassword] = useState('')

  const history = useHistory()

  // Récupération de ce qui est tapé dans les champs email et mdp, gestion convenable en bloquant le comportement
  function handleChangeFirstName(e) {
    e.preventDefault()
    setFieldFirstName(e.target.value)
  }

  function handleChangeLastName(e) {
    e.preventDefault()
    setFieldLastName(e.target.value)
  }

  function handleChangeEmail(e) {
    e.preventDefault()
    setFieldEmail(e.target.value)
  }

  function handleChangePassword(e) {
    e.preventDefault()
    setFieldPassword(e.target.value)
  }

  // Validation des champs:
  function canSubmit() {
    setErrorFirstName('')
    setErrorLastName('')
    setErrorEmail('')
    setErrorPassword('')
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
    // Valider email:
    if (fieldEmail === '') {
      setErrorEmail('Veuillez remplir ce champ')
      success = false
    }
    if (!isValidEmail(fieldEmail)) {
      setErrorEmail('Veuillez entrez une adresse email valide')
      success = false
    }
    // Valider mot de passe:
    if (fieldPassword === '') {
      setErrorPassword('Veuillez remplir ce champ')
      success = false
    }
    if (!isValidPassword(fieldPassword)) {
      setErrorPassword(
        'Mot de passe non valide (6 caractères minimum, une majuscule, une minuscule, un chiffre et un caractère spécial)'
      )
      success = false
    }
    return success
  }

  // Une fois que l'on peut soummetre, récupération de toutes les données d'inscription
  async function handleSubmit(e) {
    e.preventDefault()

    if (canSubmit()) {
      const body = {
        firstName: fieldFirstName,
        lastName: fieldLastName,
        email: fieldEmail,
        password: fieldPassword,
      }
      // Envoie au serveur, cible la création de compte:
      const result = await fetchPost('/api/auth/signup', body)
      // Redirection de l'utilisateur inscrit:
      switch (result.status) {
        case 201:
          history.push('/login')
          break
        case 400:
          console.log('Erreur')
          break
        default:
          console.log('Erreur')
      }
    }
  }

  // Rendering HTML & React
  return (
    <>
      <h2>Inscription</h2>
      <p>Créez votre compte ci-dessous :</p>
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
        <input
          type="email"
          placeholder="Entrez votre email"
          value={fieldEmail}
          onChange={handleChangeEmail}
        />
        {errorEmail && <p className="form-error">{errorEmail}</p>}
        <input
          type="password"
          placeholder="Entrez votre mot de passe"
          value={fieldPassword}
          onChange={handleChangePassword}
        />
        {errorPassword && <p className="form-error">{errorPassword}</p>}
        <button onClick={handleSubmit}>S'inscrire</button>
      </form>
    </>
  )
}
