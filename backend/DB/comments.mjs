import { sqlEscape, sqlQuery } from './DB.mjs'

// Gestion des commentaires en MYSQL
const tableName = 'comments'
// Alias pour faire du masquage des données
export const defaultFields = [
  'comment_id AS id',
  'comment_user_id AS userId',
  'comment_post_id AS postId',
  'comment_text AS text',
  'comment_creation_date AS creationDate',
]

// Fonction qui crée une table de post stocké dans une variable
export async function initCommentsTable() {
  try {
    // Outils nécessaires au forum
    const result = await sqlQuery(`
        CREATE TABLE IF NOT EXISTS ${tableName} (
            comment_id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
            comment_user_id INT(11) NOT NULL,
            comment_post_id INT(11) NOT NULL,
            comment_text TEXT NOT NULL,
            comment_creation_date DATETIME DEFAULT CURRENT_TIMESTAMP
        )
        `)
  } catch (err) {
    throw err
  }
}

// Récupérer un commentaire par un ID
export async function getCommentById(id, fields = defaultFields) {
  try {
    const rows = await sqlQuery(
      `SELECT ${fields} FROM ${tableName} WHERE comment_id = ${id}`
    )
    // Si le tableau a quelque chose on le renvoie, sinon c'est non définit
    return rows.length > 0 ? rows[0] : null
  } catch (err) {
    throw err
  }
}

// Créer un nouveau commentaire
export async function createComment(userId, postId, text) {
  try {
    const result = await sqlQuery(
      `INSERT INTO ${tableName} (comment_user_id, comment_post_id, comment_text)
      VALUES (${sqlEscape(userId)}, ${sqlEscape(postId)}, ${sqlEscape(text)})`
    )
    return result.insertId // Result est le résultat d'une action sur l'ID
  } catch (err) {
    throw err
  }
}

// Fonction pour éditer les commentaires à partir de la BDD
export async function editComment(id, text) {
  try {
    const result = await sqlQuery(
      `UPDATE ${tableName}
        SET comment_text = ${sqlEscape(text)}
        WHERE comment_id = ${id}`
    )
    return result.insertId
  } catch (err) {
    throw err
  }
}

// Fonction pour supprimer les commentaire à partir de la BDD
export async function deleteComment(userId) {
  try {
    const result = await sqlQuery(
      `DELETE FROM ${tableName}
        WHERE comment_id = ${id}`
    )
    return 'Commentaire supprimé'
  } catch (err) {
    throw err
  }
}
