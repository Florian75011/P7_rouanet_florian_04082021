import React, { useEffect } from 'react'
import { useHistory } from 'react-router'
import { fetchGet } from '../utils/fetch'

export default function Posts() {
  const history = useHistory()
  useEffect(() => {
    async function loadPosts() {
      console.log('useEffect')
      const result = await fetchGet('/api/post')
      if (result.status === 200) {
        console.log(result.message)
      } else {
        // Redirection du non-authentifié en page connnexion
        if (result.status === 401) {
          history.push('/login')
        }
        // Gérer autres erreurs
      }
    }
    loadPosts()
  }, []) // lancer ceci seulement au chargement de la page
  return <div>Bienvenue sur le forum de notre boîte</div>
}
