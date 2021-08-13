// Fonction qui gère globalement nos erreurs
export function errorHandler(req, res, errCode, errMessage = '') {
  let message = errMessage
  if (errCode instanceof Error) {
    console.log('errorHandler 500', errCode.message)
    errCode = 500
  }
  if (!message) {
    message = {
      // Tableau à paire clé-valeur
      400: 'Paramètre invalide ou manquant',
      401: 'Non connecté',
      403: 'Non autorisé',
      404: 'Ressource introuvable',
      500: 'Erreur interne au serveur',
    }[errCode]
  }
  res.status(errCode).json({ message })
}
