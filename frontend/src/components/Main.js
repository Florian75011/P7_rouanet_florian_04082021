import React from 'react'
import Login from '../pages/Login'
import Signup from '../pages/Signup'
import Error404 from '../pages/Error404'
import { Switch, Route } from 'react-router-dom'
import Posts from '../pages/Posts'
import Profile from '../pages/Profile'
import PostCreate from '../pages/PostCreate'
import PostEdit from '../pages/PostEdit'

// CSS formulaire/forum dans SASS

// Switch gère les routes indépandantes l'une de l'autre et fait la vérif. de page fonctionelle + redirection
export default function Main() {
  return (
    <main>
      <Switch>
        <Route exact path="/" component={Posts} />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        <Route path="/profile" component={Profile} />
        <Route path="/create_post" component={PostCreate} />
        <Route path="/edit_post" component={PostEdit} />
        <Route component={Error404} />
      </Switch>
    </main>
  )
}
