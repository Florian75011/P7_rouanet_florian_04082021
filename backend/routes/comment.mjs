import { getCommentById } from '../DB/comments.mjs'
import { editComment } from '../DB/comments.mjs'
import { createComment } from '../DB/comments.mjs'
import { isOwner } from '../middlewares/auth.mjs'
import { errorHandler } from '../middlewares/errorHandler.mjs'

export async function commentCreate(req, res, next) {
  try {
    const { userId, postId, text } = req.body
    if (text) {
      const result = await createComment(userId, postId, text)
      res.status(201).json({ data: result, message: "C'est fonctionnel" })
    } else {
      errorHandler(req, res, 400)
    }
  } catch (err) {
    errorHandler(req, res, err)
  }
}

export async function commentEdit(req, res, next) {
  try {
    if (req.params.id && !isNaN(Number(req.params.id))) {
      const searchComment = await getCommentById(req.params.id) // On récupère les paramètres d'URL si c'est bien un nombre
      if (searchComment) {
        // Permission donnée si le post est bien modifié par son créateur
        if (isOwner(req, res, searchComment.userId)) {
          // Si une image est uploadée avec
          const { text } = req.body
          if (text) {
            const result = await editComment(req.params.id, text)
            res.status(200).json({ data: result, message: 'Commentaire modifié' })
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
