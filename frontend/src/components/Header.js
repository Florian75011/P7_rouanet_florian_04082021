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
  return (
    <HeaderSC textColor={colors.primary}>
      <div>
        <img src={imgHeader} alt="" />
      </div>
      <nav>
        <p>Forum intranet</p>
        <button><Link to="/login">Connexion</Link></button>
        <button><Link to="/signup">Inscription</Link></button>
      </nav>
    </HeaderSC>
  )
}
