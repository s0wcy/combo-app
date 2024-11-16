// context/Web3AuthContext.tsx
"use client"

import React, { createContext, useContext, useEffect, useState } from "react"

// Context
type TCombo = {
  id: string
  marketsIds: string[]
  results: boolean[]
  settled: boolean
}
type TMarkets = {
  markets: TCombo[]
  setMarkets: (markets: TCombo[]) => void
}
const MarketsContext = createContext<TMarkets>({
  markets: [],
  setMarkets: () => {},
})

export const MarketsProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [markets, setMarkets] = useState<TCombo[]>([])

  return (
    <MarketsContext.Provider value={{ markets, setMarkets }}>
      {children}
    </MarketsContext.Provider>
  )
}

// Utilitaire pour utiliser le contexte
export const useMarketsContext = () => useContext(MarketsContext)
