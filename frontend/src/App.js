import './App.css'
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Error404 from './pages/Error'

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
