import React from 'react'
import styled from 'styled-components'
import colors from '../colors'

const FooterSC = styled.footer`
  display: flex;
  flex-direction: column;
  margin: 32px 16px 0px 0px;
  p {
    font-size: 16px;
    font-style: italic;
    color: ${(props) => props.textColor};
  }
`

export default function Footer(props) {
  return (
    <FooterSC textColor={colors.secondary}>
      <footer>
        <p>Groupomania</p>
        <p>contact@groupomania.fr</p>
      </footer>
    </FooterSC>
  )
}
