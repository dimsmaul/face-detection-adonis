import React, { useEffect } from 'react'
import { useThemeStore } from '~/hooks/use_theme'

export interface NoLayoutsProps {
  children?: React.ReactNode
}

const NoLayouts: React.FC<NoLayoutsProps> = ({ children }) => {
  const { theme } = useThemeStore()

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])
  
  return <div>{children}</div>
}

export default NoLayouts
