import { sqlEscape, sqlQuery } from './DB.mjs'

// La route des users va gérer les profiles
const tableName = 'users'
const defaultFields = [
  'user_id AS id',
  'user_first_name AS firstName',
  'user_last_name AS lastName',
  'user_email AS email',
  'user_creation_date AS creationDate',
  'user_role AS role',
]

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
export async function getUserByEmail(email, fields = defaultFields) {
  try {
    const rows = await sqlQuery(
      `SELECT ${fields} FROM ${tableName} WHERE user_email = '${email}'`
    )
    // Si le tableau a quelque chose renvoie-le, sinon c'est non définit
    return rows.length > 0 ? rows[0] : null
  } catch (err) {
    throw err
  }
}

// Récupérer l'utilisateur par son id
export async function getUserById(id, fields = defaultFields) {
  try {
    const rows = await sqlQuery(
      `SELECT ${fields} FROM ${tableName} WHERE user_id = ${id}`
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

// Modifie prénom et nom de notre utilisateur connecté
export async function updateUser(id, firstName, lastName) {
  try {
    const result = await sqlQuery(
      `UPDATE ${tableName}
        SET user_first_name = ${sqlEscape(
          firstName
        )}, user_last_name = ${sqlEscape(lastName)}
        WHERE user_id = ${id}`
    )
    return result.insertId
  } catch (err) {
    throw err
  }
}

// Fonction pour supprimer les post à partir de la BDD
export async function userDelete(id) {
  try {
    const result = await sqlQuery(
      `DELETE FROM ${tableName}
        WHERE user_id = ${id}`
    )
    return 'Objet supprimé'
  } catch (err) {
    throw err
  }
}
