import DB from '../DB/DB.mjs'

// Gestion côté backend de l'inscription d'un nouvel utilisateur
function signUp(req, res) {
  const { email, firstName, lastName, password } = req.body
  console.log(req.body)
  const connection = DB()
  connection.query(
    'INSERT INTO `Users` (`first_name`, `last_name`, `email`, `password`) VALUES (?, ?, ?, ?);',
    [firstName, lastName, email, password],
    function (err, results) {
      console.log(results) // results contains rows returned by server
      DB.close()
      res.json('Coucou')
    }
  )
}

export default signUp
// INSERT INTO `Users` (`ID`, `first_name`, `last_name`, `email`, `password`) VALUES (NULL, 'Test', 'test', 'test@gmail.com', 'test');
