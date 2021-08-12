import { initPostsTable } from './posts.mjs'
import { initUsersTable } from './users.mjs'

// Fonction d'initialisation de table pour chaque table
export function initTables() {
  initUsersTable()
  initPostsTable()
}
