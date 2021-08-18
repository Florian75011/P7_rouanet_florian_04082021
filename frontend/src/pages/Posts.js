import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import Loader from '../components/Loader'
import { fetchDelete, fetchGet } from '../utils/fetch'
import styled from 'styled-components'
import colors from '../colors'

const PostsSC = styled.div`
  div {
    border: 1px solid black;
    padding: 2rem;
    box-shadow: 22px 12px 12px ${(props) => props.shadowColor};
    margin-top: 1.75rem;
    img {
      height: auto;
      width: 100%;
    }
  }
`

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
        // Trier les publications dans l'ordre du plus récent
        result.data.sort(function sortPosts(itemA, itemB) {
          const dateA = new Date(itemA.creationDate).getTime()
          const dateB = new Date(itemB.creationDate).getTime()
          if (dateA > dateB) return -1
          if (dateB > dateA) return 1
          if (dateA < dateB) return 1
          if (dateB < dateA) return -1
          return 0
        })
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

  // Bouton de supression de tous les posts qui apparaît uniquement pour l'admin
  async function handleDeleteAdmin(e) {
    // e.preventDefault()
    let msg = window.confirm("Êtes-vous sûr de vouloir supprimer cette publication ?")
    if (msg === false) {
      return
    }
    // Envoie au serveur, cible la création de compte:
    await fetchDelete('/api/post/' + e.target.value)
      //   // Redirection de l'utilisateur inscrit:
      .then(() => {
        // Gestion de suppression frontend du message par l'admin
        e.target.parentElement.style.display = 'none'
        console.log(e.target);
      })
      .catch((error) => {
        throw error
      })
  }

  return (
    <Loader loadOn={displayPage === true}>
      <div>Bienvenue sur le forum de notre boîte</div>
      <button onClick={handleCreatePost}>Créer une publication</button>
      <PostsSC shadowColor={colors.tertiary}>
        {posts.map((post) => {
          return (
            <div key={post.id}>
              <h2>{post.title}</h2>
              <h2>
                {post.userFirstName} {post.userLastName}
              </h2>
              <time>
                {new Date(post.creationDate).toLocaleString('fr-FR', {
                  timeZone: 'UTC',
                })}
              </time>
              <p>{post.text}</p>
              {localStorage.userRole === '1' && (
                <button onClick={handleDeleteAdmin} value={post.id}>
                  Supprimer cette publication
                </button>
              )}
              {localStorage.userId == post.userId && (
                <button onClick={handleEditPost} value={post.id}>
                  Modifier
                </button>
              )}
            </div>
          )
        })}
      </PostsSC>
    </Loader>
  )
}
