import express from 'express'
import signUp from './controllers/user.mjs'
import cors from 'cors'
import helmet from "helmet"

// import helmet from "helmet";
// import dotenv from "dotenv";

// dotenv.config(); // Variable d'environnement

const app = express()
app.use(express.json()) // Permet de recevoir des corps de requête en JSON
app.use(helmet()); // Module de sécurité évitant certaines formes d'attaques informatiques courantes
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
app.get('/test', (req, res) => {
  res.json('coucou')
})
app.post('/api/user/signup', signUp)

// Connexion au port backend
app.listen(8080, () => console.log('Serveur actif sur le port ' + 8080)) // Le serveur Node va tourner continuellement
