import React from 'react'
import styled from 'styled-components'

const { PHENOMIC_NAME, PHENOMIC_HOMEPAGE } = process.env
const year = new Date().getFullYear()
const FooterContainer = styled.footer`
  text-align: center;
  font-size: 1.4rem;
  line-height: 1.4;
  opacity: .6;
`

const Footer = () => (
  <FooterContainer>
    <p>
      &copy; {year} Ray Gesualdo. All rights reserved.
      <br />
      Website generated with <a href={PHENOMIC_HOMEPAGE}>{` <${PHENOMIC_NAME} />`}</a>
    </p>
  </FooterContainer>
)

export default Footer
