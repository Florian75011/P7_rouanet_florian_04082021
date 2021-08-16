import React, { useState } from 'react'
import styled from 'styled-components'
import { Link, useHistory } from 'react-router-dom'
import imgHeader from '../assets/icon-above-font.png'
import colors from '../colors'

const HeaderSC = styled.header`
  display: flex;
  height: 50vh;

  div {
    display: flex;
    align-items: center;
    img {
      height: auto;
      width: 100%;
    }
  }
  nav {
    display: flex;
    flex-direction: column;

    p {
      font-size: 22px;
      font-weight: bold;
    }

    a {
      margin-bottom: 16px;
    }
    p,
    a {
      color: ${(props) => props.textColor};
    }
  }
`

// Momment permtinent où la page doit se mettre à jour (changement d'URL de la page)
export default function Header(props) {
  const history = useHistory()
  const [token, setToken] = useState(localStorage.accessToken)
  history.listen((location, action) => {
    setToken(localStorage.accessToken)
  })

  function logOut(e) {
    e.preventDefault()
    localStorage.removeItem('accessToken')
    history.push('/login')
  }

  // Return est la fonction moderne qui gère l'affichage (rendering)
  return (
    <HeaderSC textColor={colors.primary}>
      <div>
        <img src={imgHeader} alt="Groupomania" />
      </div>
      <nav>
        <p>Notre base de connexion</p>
        {!token && (
          <>
              <Link to="/">Connexion</Link>
              <Link to="/signup">Inscription</Link>
          </>
        )}
        {token && (
          <>
              <Link to="/">Forum</Link>
              <Link to="/profile">Profil</Link>
              <Link to="/" onClick={logOut}>
                Déconnexion
              </Link>
          </>
        )}
      </nav>
    </HeaderSC>
  )
}
