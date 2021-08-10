import { sqlEscape } from './DB.mjs'
import { sqlQuery } from './DB.mjs'

const tableName = 'users'

// Une fonction qui crée une table stocké dans une variable
export async function initUsersTable() {
  try {
    const result = await sqlQuery(`
        CREATE TABLE IF NOT EXISTS ${tableName} (
            user_id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
            user_first_name VARCHAR(255) NOT NULL,
            user_last_name VARCHAR(255) NOT NULL,
            user_email VARCHAR(255) NOT NULL,
            user_password VARCHAR(255) NOT NULL,
            user_creation_date DATETIME DEFAULT CURRENT_TIMESTAMP,
            user_role INT(11) NOT NULL DEFAULT 0
        )
        `)
  } catch (err) {
    throw err
  }
}

// Récupérer l'utilisateur par son email
export async function getUserByEmail(email) {
  try {
    const rows = await sqlQuery(
      `SELECT * FROM ${tableName} WHERE user_email = '${email}'`
    )
    // Si le tableau a quelque chose renvoie-le, sinon c'est non définit
    return rows.length > 0 ? rows[0] : null
  } catch (err) {
    throw err
  }
}

// Crée notre utilisateur
export async function createUser(firstName, lastName, email, password) {
  try {
    const result = await sqlQuery(
      `INSERT INTO ${tableName} (user_first_name, user_last_name, user_email, user_password)
      VALUES (${sqlEscape(firstName)}, ${sqlEscape(lastName)}, ${sqlEscape(
        email
      )}, ${sqlEscape(password)})`
    )
    return result.insertId
  } catch (err) {
    throw err
  }
}

createUser("Leo'", 'Dupont', 'ld@gmail.com', 'abc123')
