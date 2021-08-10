import mysql2 from 'mysql2'
import dotenv from 'dotenv'

dotenv.config()

// Base de donnée MYSQL. Create the connection pool. The pool-specific settings are the defaults
const pool = mysql2.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'Groupomania',
  waitForConnections: true,
  connectionLimit: 20,
  queueLimit: 0,
})

// Promesse retournée
export function sqlQuery(str) {
  return new Promise(async (resolve, reject) => {
    pool.query(str, function (err, results, fields) {
      if (err) reject(err)
      resolve(results)
    })
  })
}

// Permet l'échapement de caractère, remplacement automatique
export function sqlEscape(str) {
  return mysql2.escape(str)
}
