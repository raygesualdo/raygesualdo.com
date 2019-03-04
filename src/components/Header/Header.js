import React from 'react'
import { HeaderBackground, HeaderLayout } from './styles'
import { MenuSection } from './MenuSection'
import { IconSection } from './IconSection'
import { SiteTitleSection } from './SiteTitleSection'

const Header = () => {
  return (
    <HeaderBackground>
      <HeaderLayout>
        <SiteTitleSection />
        <MenuSection />
        <IconSection />
      </HeaderLayout>
    </HeaderBackground>
  )
}

export default Header
