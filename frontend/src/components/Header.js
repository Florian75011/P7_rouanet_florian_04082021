import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
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

// Return est la fonction moderne qui gère l'affichage (rendering)
export default function Header(props) {
  const token = localStorage.usertoken
  function logOut() {
    localStorage.removeItem("usertoken")
    window.location.reload(false)
  }
  return (
    <HeaderSC textColor={colors.primary}>
      <div>
        <img src={imgHeader} alt="" />
      </div>
      <nav>
        <p>Notre forum intranet</p>
        {!token && <button><Link to="/">Connexion</Link></button>}
        {!token && <button><Link to="/signup">Inscription</Link></button>}
        {token && <button><Link to="/" onClick={() => logOut()}>Déconnexion</Link></button>}
      </nav>
    </HeaderSC>
  )
}
