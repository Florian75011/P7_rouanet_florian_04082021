import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import Loader from '../components/Loader'
import { fetchGet } from '../utils/fetch'

export default function Posts() {
  const history = useHistory()
  const [displayPage, setDisplayPage] = useState(false)
  const [posts, setPosts] = useState([])

  // Gestion de l'affichage des posts du site
  useEffect(() => {
    async function loadPosts() {
      // On reçoit des données quand la réponse est ok
      const result = await fetchGet('/api/post')
      if (result.status === 200) {
        console.log(result.data)
        setPosts(result.data)
        setDisplayPage(true)
      } else {
        // Redirection du non-authentifié en page connnexion
        if (result.status === 401) {
          history.push('/login')
        }
        // Gérer autres erreurs
      }
    }
    loadPosts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // lancer ceci seulement au chargement de la page après vérif (protection frontend)

  function handleCreatePost() {
    history.push('/create_post')
  }

  function handleEditPost(e) {
    history.push('/edit_post?id=' + e.target.value)
  }

  return (
    <Loader loadOn={displayPage === true}>
      <div>Bienvenue sur le forum de notre boîte</div>
      <button onClick={handleCreatePost}>Créer une publication</button>
      <div>
        {posts.map((post) => {
          return (
            <div key={post.id}>
              <h2>{post.title}</h2>
              <h2>
                {post.userFirstName} {post.userLastName}
              </h2>
              <time>{new Date(post.creationDate).toLocaleString('fr-FR', { timeZone: 'UTC' })}</time>
              <p>{post.text}</p>
              {localStorage.userId == post.userId &&<button onClick={handleEditPost} value={post.id}>
                Modifier
              </button>}
            </div>
          )
        })}
      </div>
    </Loader>
  )
}
