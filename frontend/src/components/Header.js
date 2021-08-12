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
        <img src={imgHeader} alt="" />
      </div>
      <nav>
        <p>Notre forum intranet</p>
        {!token && (
          <>
            <button>
              <Link to="/">Connexion</Link>
            </button>
            <button>
              <Link to="/signup">Inscription</Link>
            </button>
          </>
        )}
        {token && (
          <>
            <button>
              <Link to="/profile">Profil</Link>
            </button>
            <button>
              <Link to="/" onClick={logOut}>
                Déconnexion
              </Link>
            </button>
          </>
        )}
      </nav>
    </HeaderSC>
  )
}
