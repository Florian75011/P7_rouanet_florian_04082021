import { initPostsTable } from './posts.mjs'
import { initUsersTable } from './users.mjs'
import { initCommentsTable } from './comments.mjs'

// Fonction d'initialisation de table pour chaque table de la BDD
export function initTables() {
  initUsersTable()
  initPostsTable()
  initCommentsTable()
}
