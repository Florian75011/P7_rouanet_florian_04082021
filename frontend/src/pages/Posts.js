import React, { Fragment, useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import Loader from '../components/Loader'
import { fetchDelete, fetchGet, fetchPost, fetchPut } from '../utils/fetch'
import styled from 'styled-components'
import colors from '../colors'
import Linkify from 'react-linkify'

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
    button {
      margin: 5px;
    }
  }
`

export default function Posts() {
  const history = useHistory()
  const [displayPage, setDisplayPage] = useState(false)
  const [posts, setPosts] = useState([])
  const [postToComment, setPostToComment] = useState(null)
  const [commentToEdit, setCommentToEdit] = useState(null)
  const [fieldComment, setFieldComment] = useState('')

  // Gestion de l'affichage des posts du site
  useEffect(() => {
    loadPosts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // lancer ceci seulement au chargement de la page après vérif (protection frontend)

  // Refresh
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

  function handleCreatePost() {
    history.push('/create_post')
  }

  function handleEditPost(e) {
    history.push('/edit_post?id=' + e.target.value)
  }

  // Bouton de supression de tous les posts qui apparaît uniquement pour l'admin
  async function handleDeleteAdmin(e) {
    e.preventDefault()
    let msg = window.confirm(
      'Êtes-vous sûr de vouloir supprimer cette publication ?'
    )
    if (msg === false) {
      return
    }
    // Envoie au serveur, cible la création de compte:
    setDisplayPage(false)
    await fetchDelete('/api/post/' + e.target.value)
    loadPosts()
    setDisplayPage(true)
  }

  // Boîte de commentaires
  function handleStartComment(e) {
    e.preventDefault()
    setPostToComment(parseInt(e.target.value))
  }

  function handleCancelComment(e) {
    e.preventDefault()
    setPostToComment(null)
    setCommentToEdit(null)
    setFieldComment('')
  }

  function handleChangeComment(e) {
    e.preventDefault()
    setFieldComment(e.target.value)
  }

  async function handleAddComment(e) {
    e.preventDefault()
    const body = {
      userId: localStorage.userId,
      postId: e.target.value,
      text: fieldComment,
    }
    setDisplayPage(false)
    const result = await fetchPost('/api/comment/', body)
    if (result.status === 201) {
      await loadPosts()
      handleCancelComment(e)
    }
    setDisplayPage(true)
  }

  async function handleEditComment(e) {
    e.preventDefault()
    const body = {
      text: fieldComment,
    }
    setDisplayPage(false)
    const result = await fetchPut('/api/comment/' + commentToEdit, body)
    if (result.status === 200) {
      await loadPosts()
      handleCancelComment(e)
    }
    setDisplayPage(true)
  }

  async function handleStartCommentEdit(e, postId, comment) {
    e.preventDefault()
    setPostToComment(parseInt(postId))
    setCommentToEdit(parseInt(comment.id))
    setFieldComment(comment.text)
  }

  async function handleDeleteComment(e) {
    e.preventDefault()
    let msg = window.confirm(
      'Êtes-vous sûr de vouloir supprimer ce commentaire ?'
    )
    if (msg === false) {
      return
    }
    // Envoie au serveur, cible la création de compte:
    await fetchDelete('/api/comment/' + e.target.value)
      //   // Redirection de l'utilisateur inscrit:
      .then(() => {
        e.target.parentElement.style.display = 'none'
        // history.push('/')
      })
      .catch((error) => {
        throw error
      })
  }

  // Affichage du forum
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
              {post.imagePath && (
                <img
                  alt=""
                  src={`http://localhost:5000/uploads/${post.imagePath}`}
                />
              )}
              <Linkify>
                <p>{post.text}</p>
              </Linkify>
              {commentToEdit === null &&
                post.comments.map((comment) => {
                  return (
                    <div key={comment.id}>
                      <p>
                        {comment.userFirstName} {comment.userLastName} a répondu
                        :
                      </p>
                      <Linkify>
                        <p>{comment.text}</p>
                      </Linkify>
                      {parseInt(localStorage.userId) ===
                        parseInt(comment.userId) && (
                        <Fragment>
                          <button
                            value={comment.id}
                            onClick={(e) =>
                              handleStartCommentEdit(e, post.id, comment)
                            }
                          >
                            Editer
                          </button>
                          <button
                            value={comment.id}
                            onClick={handleDeleteComment}
                          >
                            Supprimer
                          </button>
                        </Fragment>
                      )}
                    </div>
                  )
                })}
              {parseInt(localStorage.userRole) === 1 && (
                <button onClick={handleDeleteAdmin} value={post.id}>
                  Supprimer cette publication
                </button>
              )}
              {parseInt(localStorage.userId) === parseInt(post.userId) && (
                <button onClick={handleEditPost} value={post.id}>
                  Modifier
                </button>
              )}
              {postToComment === post.id ? (
                <div>
                  <textarea
                    value={fieldComment}
                    onChange={handleChangeComment}
                  ></textarea>
                  <button
                    onClick={
                      commentToEdit === null
                        ? handleAddComment
                        : handleEditComment
                    }
                    value={post.id}
                    disabled={fieldComment === ''}
                  >
                    Envoyer
                  </button>
                  <button onClick={handleCancelComment}>Annuler</button>
                </div>
              ) : (
                <button value={post.id} onClick={handleStartComment}>
                  Répondre
                </button>
              )}
            </div>
          )
        })}
      </PostsSC>
    </Loader>
  )
}
