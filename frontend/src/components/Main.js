import React from 'react'
import Login from '../pages/Login'
import Signup from '../pages/Signup'
import Error404 from '../pages/Error'
import { Switch, Route } from 'react-router-dom'
import Posts from '../pages/Posts'
import Profile from './Profile'
import PostCreate from '../pages/PostCreate'

// CSS dans SASS

// Switch gère les routes indépandantes l'une de l'autre et fait la vérif. de page fonctionelle
export default function Main() {
  return (
    <main>
      <Switch>
        <Route exact path="/" component={Posts} />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />
        <Route path="/profile" component={Profile} />
        <Route path="/create_post" component={PostCreate} />
        <Route component={Error404} />
      </Switch>
    </main>
  )
}
