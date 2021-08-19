import jwt from 'jsonwebtoken'
import { updateUser, getUserById, userDelete } from '../DB/users.mjs'
import { errorHandler } from '../middlewares/errorHandler.mjs'

// Gestion back du profile utilisateur (récupération et modification)
export async function getProfile(req, res, next) {
  try {
    const decoded = jwt.decode(req.accessToken)
    const searchUser = await getUserById(decoded.userId) // await car communique avec la base de donnée
    if (searchUser) {
      res.status(200).json({
        data: searchUser,
        message: "Données de l'utilisateur récupérée",
      })
    } else {
      throw new Error('Utilisateur connecté introuvable') // Création d'erreur éventuelle
    }
  } catch (err) {
    errorHandler(req, res, err)
  }
}

// Route de modification de profil
export async function setProfile(req, res, next) {
  try {
    const { firstName, lastName } = req.body
    if (firstName && firstName !== '' && lastName && lastName !== '') {
      const decoded = jwt.decode(req.accessToken)
      const searchUser = await getUserById(decoded.userId) // await car communique avec la base de donnée
      if (searchUser) {
        await updateUser(decoded.userId, firstName, lastName)
        res.status(200).json({ message: 'Compte mis à jour !' })
      } else {
        throw new Error('Utilisateur connecté introuvable') // Création d'erreur éventuelle
      }
    } else {
      errorHandler(req, res, 400)
    }
  } catch (err) {
    errorHandler(req, res, err)
  }
}

// Route de suppression de profil
export async function deleteProfile(req, res, next) {
  try {
      const decoded = jwt.decode(req.accessToken)
      const searchUser = await getUserById(decoded.userId) // await car communique avec la base de donnée
      if (searchUser) {
        await userDelete(decoded.userId)
        res.status(200).json({ message: 'Compte supprimé !' })
      } else {
        throw new Error('Utilisateur connecté introuvable') // Création d'erreur éventuelle
      }
  } catch (err) {
    errorHandler(req, res, err)
  }
}
