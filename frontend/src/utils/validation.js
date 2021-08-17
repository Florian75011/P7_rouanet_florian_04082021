// 2 fonctions permettant de renforcer la création de compte utilisateur

// Texte séparé par un arobase puis un point qui empêche aussi de mettre des caractères spéciaux
export function isValidEmail(value) {
  if (
    /\S+@\S+\.\S+/.test(value) &&
    !/[`!#$%^&*()+_ /=[\]{};':"\\|,<>?~]/.test(value)
  ) {
    return true
  }
  return false
}

// Regex pour renforcer le MDP (au moins 1 chiffre-majuscule-minuscule-alphanumérique, 6 charactères min)
export function isValidPassword(value) {
  const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{6,}$/
  return re.test(value)
}
