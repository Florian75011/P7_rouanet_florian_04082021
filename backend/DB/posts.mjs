import { sqlEscape } from './DB.mjs'
import { sqlQuery } from './DB.mjs'

const tableName = 'posts'
// Alias pour faire du masquage des données
const defaultFields = [
  'post_id AS id',
  'post_user_id AS userId',
  'post_title AS title',
  'post_text AS text',
  'post_image_path AS imgPath',
  'post_creation_date AS creationDate',
]

// Fonction qui crée une table de post stocké dans une variable
export async function initPostsTable() {
  try {
    // Outils nécessaires au forum
    const result = await sqlQuery(`
        CREATE TABLE IF NOT EXISTS ${tableName} (
            post_id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
            post_user_id INT(11) NOT NULL,
            post_title VARCHAR(255) NOT NULL,
            post_text TEXT NOT NULL,
            post_image_path VARCHAR(255),
            post_creation_date DATETIME DEFAULT CURRENT_TIMESTAMP
        )
        `)
  } catch (err) {
    throw err
  }
}

// Ramène la liste entière des posts (en récupérant les données prénom et nom de l'user dans le post) et la retourne
export async function getAllPosts(fields = defaultFields) {
  try {
    const rows = await sqlQuery(`
    SELECT ${fields}, user_first_name AS userFirstName, user_last_name AS userLastName 
    FROM ${tableName}
    JOIN users
    ON post_user_id = user_id
    `)
    return rows
  } catch (err) {
    throw err
  }
}
