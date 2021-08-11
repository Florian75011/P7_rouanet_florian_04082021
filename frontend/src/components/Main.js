import React from 'react'
import Login from '../pages/Login'
import Signup from '../pages/Signup'
import Error404 from '../pages/Error'
import { Switch, Route } from 'react-router-dom'
import Home from './Home'

// CSS dans SASS

// Switch gère les routes indépandantes l'une de l'autre et fait la vérif. de page fonctionelle
export default function Main() {
  const token = localStorage.usertoken
  return (
    <main>
      {!token ? (
        <Switch>
          <Route exact path="/" component={Login} />
          <Route path="/login" component={Login} />
          <Route path="/signup" component={Signup} />
          <Route component={Error404} />
        </Switch>
      ) : (
        <Route exact path="/" component={Home} />
      )}
    </main>
  )
}

/*
export default function App() {
  return (
    <BrowserRouter>
      <header>
        <p>Logo</p>
        <nav>
          <Link to="/login">Connexion</Link>
          <Link to="/signup">Inscription</Link>
        </nav>
      </header>
      <main>
        <Switch>
          <Route exact path="/" component={Login} />
          <Route path="/login" component={Login} />
          <Route path="/signup" component={Signup} />
          <Route component={Error404} />
        </Switch>
      </main>
      <footer>
        <p>Footer</p>
      </footer>
    </BrowserRouter>
  )
}
*/
