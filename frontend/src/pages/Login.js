import { useState } from 'react'
import { useHistory } from 'react-router'
import { fetchPost } from '../utils/fetch'
import { isValidEmail, isValidPassword } from '../utils/validation'

export default function Login() {
  // Variables contenants nos champs et nos erreurs
  const [fieldEmail, setFieldEmail] = useState('')
  const [fieldPassword, setFieldPassword] = useState('')
  const [errorEmail, setErrorEmail] = useState('')
  const [errorPassword, setErrorPassword] = useState('')

  const history = useHistory()

  // Récupération de ce qui est tapé dans les champs email et mdp
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
    setErrorEmail('')
    setErrorPassword('')
    let success = true
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

  async function handleSubmit(e) {
    e.preventDefault()

    if (canSubmit()) {
      const body = {
        email: fieldEmail,
        password: fieldPassword,
      }
      // Envoie serveur:
      const result = await fetchPost('/api/auth/login', body)
      console.log(result)
      if (result.status === 200) {
        localStorage.setItem('accessToken', JSON.stringify(result.token))
        history.push('/')
      }
    }
  }

  // Retour de la construction HTML du composant de connexion (le return gère le render, affichage):
  return (
    <>
      <h2>Connexion</h2>
      <p>Connectez-vous ci-dessous :</p>
      <form>
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
        <button onClick={handleSubmit}>Se connecter</button>
      </form>
    </>
  )
}
