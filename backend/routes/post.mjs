import { createPost, editPost, getPostById, getAllPosts } from '../DB/posts.mjs'
import { isOwner } from '../middlewares/auth.mjs'
import { errorHandler } from '../middlewares/errorHandler.mjs'

export async function getPostsList(req, res, next) {
  try {
    const posts = await getAllPosts()
    res.status(200).json({ data: posts, message: 'Okay' })
  } catch (err) {
    errorHandler(req, res, err)
  }
}

// Récupérer un post pour le modifier
export async function getPostForEdit(req, res, next) {
  try {
    if (req.params.id && !isNaN(Number(req.params.id))) {
      const searchPost = await getPostById(req.params.id) // On récupère les paramètres d'URL
      if (searchPost) {
        // Permission donnée si le post est bien modifier par son créateur
        if (isOwner(req, res, searchPost.userId)) {
          res.status(200).json({
            data: searchPost,
            message: 'Les données du post sont récupérées',
          })
        } else {
          errorHandler(req, res, 403)
        }
      } else {
        errorHandler(req, res, 404)
      }
    } else {
      errorHandler(req, res, 400)
    }
  } catch (err) {
    errorHandler(req, res, err)
  }
}

// Appeler la fonction POST
export async function postCreate(req, res, next) {
  try {
    const { userId, title, text } = req.body
    const result = await createPost(userId, title, text)
    res.status(201).json({ data: result, message: "C'est fonctionnel" })
  } catch (err) {
    errorHandler(req, res, err)
  }
}

// Appeler la fonction pour modifier les posts
export async function postEdit(req, res, next) {
  try {
    if (req.params.id && !isNaN(Number(req.params.id))) {
      const searchPost = await getPostById(req.params.id) // On récupère les paramètres d'URL
      if (searchPost) {
        // Permission donnée si le post est bien modifier par son créateur
        if (isOwner(req, res, searchPost.userId)) {
          const { title, text } = req.body
          const result = await editPost(req.params.id, title, text)
          res.status(200).json({ data: result, message: 'Message modifié' })
        } else {
          errorHandler(req, res, 403)
        }
      } else {
        errorHandler(req, res, 404)
      }
    } else {
      errorHandler(req, res, 400)
    }
  } catch (err) {
    errorHandler(req, res, err)
  }
}
