import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { sqlQuery } from './DB/DB.mjs'
import { initTables } from './DB/init.mjs'
import { signUp, logIn, checkAuthParams } from './routes/auth.mjs'
import { auth } from './middlewares/auth.mjs'
import { test } from './routes/post.mjs'

// import dotenv from "dotenv";

// dotenv.config(); // Variable d'environnement

const app = express()
app.use(express.json()) // Permet de recevoir des corps de requête en JSON
app.use(helmet()) // Module de sécurité évitant certaines formes d'attaques informatiques courantes
app.use(cors())
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

// // Création de routes
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);
// app.use("/images", express.static(path.join(__dirname, "images"))); // Indique que le dossier possède des fichiers statiques

// Création de la route API
app.post('/api/auth/signup', checkAuthParams, signUp)
app.post('/api/auth/login', checkAuthParams, logIn)
app.get('/api/post', auth, test)

// Connexion au port backend
app.listen(5000, () => console.log('Serveur actif sur le port ' + 5000)) // Le serveur Node va tourner continuellement

// Création des tables
initTables()
