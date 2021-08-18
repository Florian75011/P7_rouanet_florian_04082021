import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { getUserByEmail } from '../DB/users.mjs'
import { createUser } from '../DB/users.mjs'
import { errorHandler } from '../middlewares/errorHandler.mjs'

dotenv.config() // Permet d'user des variables d'environnement

// Filtre avant la fonction d'inscription/connexion + Validation des paramètres en backend par rapport au frontend + Vérif email/MDP non vide
export function checkAuthParams(req, res, next) {
  if (
    // On teste strictement les égalités/inégalités par rapport à la dataBase
    req.body.email &&
    req.body.email !== '' &&
    req.body.password &&
    req.body.password !== ''
  ) {
    // Vérifier l'email
    if (!isValidEmail(req.body.email)) {
      errorHandler(req, res, 400, 'Email non valide')
    }
    // Vérifier mot de passe
    else if (!isValidPassword(req.body.password)) {
      errorHandler(
        req,
        res,
        400,
        'Mot de passe non valide (6 caractères minimum, une majuscule, une minuscule, un chiffre et un caractère spécial)'
      )
      // Contraint à faire un MDP sécurisé
    } else {
      next()
    }
  } else {
    errorHandler(req, res, 400)
  }
}

// REGEX pour que les critères correspondent au champ en fortifiant email & MDP
function isValidEmail(value) {
  if (
    /\S+@\S+\.\S+/.test(value) &&
    !/[`!#$%^&*()+_ /\=\[\]{};':"\\|,<>?~]/.test(value) // Texte séparé par un arobase puis un point, puis empêche de mettre des caractères spéciaux
  ) {
    return true
  }
  return false
}

// Regex pour renforcer le MDP (au moins 1 chiffre-majuscule-minuscule-alphanumérique, 6 charactères min)
function isValidPassword(value) {
  const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{6,}$/
  return re.test(value)
}

// Possibilité de création de comptes inscrits uniques
export async function signUp(req, res, next) {
  try {
    // Destructuration des variables et vérification que les champs de prénom/nom ne sont pas vides
    const { firstName, lastName, email, password } = req.body
    if (firstName && firstName !== '' && lastName && lastName !== '') {
      const searchUser = await getUserByEmail(email)
      if (searchUser === null) {
        const hash = await bcrypt.hash(password, 10) // Hashé le MDP côté backend pour ne rien stocker dans la dataBase
        const result = await createUser(firstName, lastName, email, hash)
        // res.status(201).json({
        //   data: result,
        //   message: "Inscription de l'utilisateur réussie",
        // }) // 201 dit que le compte est créé avec succès
        const obj = {
          userId: result, // Basculer sur logIn après inscription
          token: jwt.sign(
            { userId: result, userRole: 'result.role' },
            process.env.TOKEN_SECRET,
            { expiresIn: '12h' }
          ), // L'utilisateur existe vraiment, donc on lui renvoie un jeton/token ; Crypte information pour la décrypter ensuite
        }
        res.status(200).json(obj)
      } else {
        errorHandler(req, res, 400, 'Email déjà utilisé')
      }
    } else {
      errorHandler(req, res, 400)
    }
  } catch (err) {
    errorHandler(req, res, err)
  }
}

// Gestion de la connexion au site avec recherche utilisateur
export async function logIn(req, res, next) {
  try {
    const { email, password } = req.body
    // Vérifier que cet email existe
    const searchUser = await getUserByEmail(email, [
      'user_id AS id',
      'user_password AS password',
      'user_role AS role',
    ])
    if (searchUser) {
      const match = bcrypt.compareSync(password, searchUser.password)
      if (match === true) {
        // Créer le token, et envoyer une réponse - Créer un objet prenant en compte un userId avec le résultat du searchUser + le token secret
        const obj = {
          userId: searchUser.id,
          userRole: searchUser.role, // Envoie user et role
          token: jwt.sign(
            { userId: searchUser.id, userRole: searchUser.role },
            process.env.TOKEN_SECRET,
            { expiresIn: '12h' }
          ), // L'utilisateur existe vraiment, donc on lui renvoie un jeton/token ; Crypte information pour la décrypter ensuite
        }
        res.status(200).json(obj)
      } else {
        errorHandler(req, res, 400, 'Identifiants invalides')
      }
    } else {
      errorHandler(req, res, 400, 'Identifiants invalides')
    }
  } catch (err) {
    errorHandler(req, res, err)
  }
}
