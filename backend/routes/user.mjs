import jwt from 'jsonwebtoken'
import { updateUser, getUserById } from '../DB/users.mjs'

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
    res.status(500).json({ message: "Une erreur s'est produite" })
  }
}

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
      res.status(400).json({ message: 'Paramètres manquants ou invalides!' })
    }
  } catch (err) {
    res.status(500).json({ message: "Une erreur s'est produite" })
  }
}

// ROUTE DE SUPPRESSION DE PROFIL
