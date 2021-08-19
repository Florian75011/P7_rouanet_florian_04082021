import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { sqlQuery } from './DB/DB.mjs'
import { initTables } from './DB/init.mjs'
import { signUp, logIn, checkAuthParams } from './routes/auth.mjs'
import { auth } from './middlewares/auth.mjs'
import {
  getPostsList,
  postCreate,
  postEdit,
  getPostForEdit,
  postDelete,
} from './routes/post.mjs'
import { getProfile, setProfile } from './routes/user.mjs'
import { userDelete } from './DB/users.mjs'
import { upload } from './middlewares/upload.mjs'
import path, { dirname } from 'path' // Module Node pour gérer les chemins de fichiers
import { fileURLToPath } from 'url'
import { commentCreate, commentEdit, commentDelete } from './routes/comment.mjs'
import { deleteProfile } from './routes/user.mjs'

const app = express()
app.use(express.json()) // Permet de recevoir des corps de requête en JSON
app.use('/images/assets', express.static('assets')) // Si on copie
app.use(helmet()) // Module de sécurité évitant certaines formes d'attaques informatiques courantes
app.use(cors())

// Création de routes
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))) // Indique que le dossier possède des fichiers statiques

// Création de la route API
app.post('/api/auth/signup', checkAuthParams, signUp) // Connexion
app.post('/api/auth/login', checkAuthParams, logIn)
app.get('/api/user/profile', auth, getProfile) // Profil
app.post('/api/user/profile', auth, setProfile)
app.get('/api/post', auth, getPostsList) // Récupération
app.post('/api/post', auth, upload, postCreate) // Création & modification + image
app.get('/api/post/:id', auth, getPostForEdit)
app.put('/api/post/:id', auth, upload, postEdit)
app.delete('/api/post/:id', auth, postDelete) // Suppression
app.delete('/api/user', auth, deleteProfile)
app.delete('/api/comment/:id', auth, commentDelete)
app.post('/api/comment', auth, commentCreate) // Additionnel
app.put('/api/comment/:id', auth, commentEdit)

// Connexion au port backend
app.listen(5000, () => console.log('Serveur actif sur le port ' + 5000)) // Le serveur Node va tourner continuellement

// Création des tables
initTables()

// import dotenv from "dotenv";
// dotenv.config(); // Variable d'environnement

// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', '*') // Tout le monde a le droit d'accéder à l'API
//   res.setHeader(
//     'Access-Control-Allow-Headers',
//     'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
//   ) // Authorisation d'utiliser certaines en-têtes
//   res.setHeader(
//     'Access-Control-Allow-Methods',
//     'GET, POST, PUT, DELETE, PATCH, OPTIONS'
//   ) // Authorisation d'utiliser certaines méthodes
//   next()
// })
