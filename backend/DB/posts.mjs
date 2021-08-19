import { sqlEscape, sqlQuery } from './DB.mjs'
import { defaultFields as commentFields } from './comments.mjs'

// Gestion des publications en MYSQL
const tableName = 'posts'
// Alias pour faire du masquage des données
const defaultFields = [
  'post_id AS id',
  'post_user_id AS userId',
  'post_title AS title',
  'post_text AS text',
  'post_image_path AS imagePath',
  'post_creation_date AS creationDate',
]

// Fonction qui crée une table de post stocké dans une variable
export async function initPostsTable() {
  try {
    // Outils nécessaires au forum
    const result = await sqlQuery(`
        CREATE TABLE IF NOT EXISTS ${tableName} (
            post_id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
            post_user_id INT(11) NOT NULL, FOREIGN KEY (post_user_id) REFERENCES users(user_id) ON DELETE CASCADE,
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
    for (const row of rows) {
      row.comments = await getPostComments(row.id)
    }
    return rows // Rows essaie d'obtenir des données
  } catch (err) {
    throw err
  }
}

export async function getPostComments(postId, fields = defaultFields) {
  try {
    const rows = await sqlQuery(`
    SELECT ${commentFields}, user_first_name AS userFirstName, user_last_name AS userLastName 
    FROM comments
    JOIN users
    ON comment_user_id = user_id
    WHERE comment_post_id = ${postId}
    `)
    return rows // Rows essaie d'obtenir des données
  } catch (err) {
    throw err
  }
}

// Récupérer un post par un ID
export async function getPostById(id, fields = defaultFields) {
  try {
    const rows = await sqlQuery(
      `SELECT ${fields} FROM ${tableName} WHERE post_id = ${id}`
    )
    // Si le tableau a quelque chose renvoie-le, sinon c'est non définit
    return rows.length > 0 ? rows[0] : null
  } catch (err) {
    throw err
  }
}

// Créer la fonction de POST d'une nouvelle publication qui sera appelée dans le fichier route/post.mjs pour faire chaque post (MYSQL)
export async function createPost(userId, title, text, image = '') {
  try {
    const result = await sqlQuery(
      `INSERT INTO ${tableName} (post_user_id, post_title, post_text, post_image_path)
      VALUES (${sqlEscape(userId)}, ${sqlEscape(title)}, ${sqlEscape(
        text
      )}, ${sqlEscape(image)})`
    )
    return result.insertId // Result est le résultat d'une action
  } catch (err) {
    throw err
  }
}

// Fonction pour éditer les post à partir de la BDD
export async function editPost(id, title, text, image = '') {
  try {
    const result = await sqlQuery(
      `UPDATE ${tableName}
        SET post_title = ${sqlEscape(title)}, post_text = ${sqlEscape(
        text
      )}, post_image_path = ${sqlEscape(image)}
        WHERE post_id = ${id}`
    )
    return result.insertId
  } catch (err) {
    throw err
  }
}

// Fonction pour supprimer les post à partir de la BDD
export async function deletePost(id) {
  try {
    const result = await sqlQuery(
      `DELETE FROM ${tableName}
        WHERE post_id = ${id}`
    )
    return 'Objet supprimé'
  } catch (err) {
    throw err
  }
}
