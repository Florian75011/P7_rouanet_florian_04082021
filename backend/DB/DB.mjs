import mysql2 from 'mysql2'
import dotenv from 'dotenv'

dotenv.config()

// BDD avec MYSQL dans Node.js - connection pool
const pool = mysql2.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'Groupomania',
  waitForConnections: true,
  connectionLimit: 20,
  queueLimit: 0,
})

// Promesse retournée pour gèrer l'asynchrone avec MYSQL/Node.js en connexions simultanées à partir d'une seule
export function sqlQuery(str) {
  return new Promise(async (resolve, reject) => {
    pool.query(str, function (err, results, fields) {
      if (err) reject(err)
      resolve(results)
    })
  })
}

// Permet l'échapement de caractère, remplacement automatique des apostrophes
export function sqlEscape(str) {
  return mysql2.escape(str)
}
