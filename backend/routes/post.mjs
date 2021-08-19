import {
  createPost,
  deletePost,
  editPost,
  getPostById,
  getAllPosts,
} from '../DB/posts.mjs'
import { isOwner } from '../middlewares/auth.mjs'
import { errorHandler } from '../middlewares/errorHandler.mjs'
import { upload } from '../middlewares/upload.mjs'
import fs from 'fs'

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
    let body = req.body
    // Si une image est uploadée
    if (req.file) {
      body = JSON.parse(req.body.data)
      body.image = req.file.filename
    }
    const { userId, title, text, image } = body
    if (title && text) {
      const result = await createPost(userId, title, text, image)
      res.status(201).json({ data: result, message: "Message crée" })
    } else {
      errorHandler(req, res, 400)
    }
  } catch (err) {
    errorHandler(req, res, err)
  }
}

// Appeler la fonction pour modifier les posts
export async function postEdit(req, res, next) {
  try {
    if (req.params.id && !isNaN(Number(req.params.id))) {
      const searchPost = await getPostById(req.params.id) // On récupère les paramètres d'URL si c'est bien un nombre
      if (searchPost) {
        // Permission donnée si le post est bien modifié par son créateur
        if (isOwner(req, res, searchPost.userId)) {
          let body = { title: '', text: '', image: '' }
          // Si une image est uploadée avec
          if (req.file) {
            if (searchPost.imagePath) {
              // fonction FS de suppression d'image
              fs.unlink(`uploads/${searchPost.imagePath}`, async (err) => {
                if (err) console.log(err)
              })
            }
            body = JSON.parse(req.body.data)
            body.image = req.file.filename
          } else {
            body = req.body
            // Si une image était bien enregistrée et qu'elle a été supprimée du frontend, on supprime l'image précédente
            if (searchPost.imagePath && !body.image) {
              fs.unlink(`uploads/${searchPost.imagePath}`, async (err) => {
                if (err) console.log(err)
              })
            }
          }
          const { title, text, image } = body
          if (title && text) {
            const result = await editPost(req.params.id, title, text, image)
            res.status(200).json({ data: result, message: 'Message modifié' })
          } else {
            errorHandler(req, res, 400)
          }
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

// Appeler la fonction pour supprimer les posts
export async function postDelete(req, res, next) {
  try {
    if (req.params.id && !isNaN(Number(req.params.id))) {
      const searchPost = await getPostById(req.params.id) // On récupère les paramètres d'URL
      if (searchPost) {
        // Permission donnée si le post est bien modifier par son créateur
        if (isOwner(req, res, searchPost.userId)) {
          // Gestion de la suppression d'image
          if (searchPost.imagePath) {
            // fonction FS de suppression d'image
            fs.unlink(`uploads/${searchPost.imagePath}`, async (err) => {
              if (err) console.log(err)
            })
          }
          await deletePost(searchPost.id)
            .then(() => res.status(200).json({ message: 'Message supprimé' }))
            .catch((error) => errorHandler(req, res, error.status))
        }
      }
    }
  } catch (err) {
    errorHandler(req, res, err)
  }
}
