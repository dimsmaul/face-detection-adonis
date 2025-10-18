import React from 'react'

export interface NoLayoutsProps {
  children?: React.ReactNode
}

const NoLayouts: React.FC<NoLayoutsProps> = ({ children }) => {
  return <div>{children}</div>
}

export default NoLayouts
