// context/Web3AuthContext.tsx
"use client"

import React, { createContext, useContext, useEffect, useState } from "react"

import { CHAIN_NAMESPACES, IProvider, WEB3AUTH_NETWORK } from "@web3auth/base"
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider"
import { getDefaultExternalAdapters } from "@web3auth/default-evm-adapter"
import { Web3Auth, Web3AuthOptions } from "@web3auth/modal"
import {
  AccountAbstractionProvider,
  BiconomySmartAccount,
} from "@web3auth/account-abstraction-provider"
import RPC from "@/rpc/viemRPC"

// Web3Auth Client
const clientId = process.env.NEXT_PUBLIC_WEB3AUTH_ID
if (!clientId) {
  throw new Error("Please provide clientId in .env file")
}

// Polygon Chain
const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0x89",
  rpcTarget: process.env.NEXT_PUBLIC_RPC_URL as string,
  displayName: "Polygon Mainnet",
  blockExplorerUrl: "https://polygon.blockscout.com/",
  ticker: "POL",
  tickerName: "Polygon Ecosystem Token",
  logo: "https://cryptologos.cc/logos/polygon-matic-logo.png",
}

// AA Provider
const pimlicoApi = `https://api.pimlico.io/v2/${parseInt(
  chainConfig.chainId,
  16
)}/rpc?apikey=${process.env.NEXT_PUBLIC_PIMLICO_API}`
const accountAbstractionProvider = new AccountAbstractionProvider({
  config: {
    chainConfig,
    smartAccountInit: new BiconomySmartAccount(),
    bundlerConfig: { url: pimlicoApi },
    paymasterConfig: { url: pimlicoApi },
  },
})

// SDK Configuration
const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: { chainConfig },
})
const web3AuthOptions: Web3AuthOptions = {
  clientId,
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
  privateKeyProvider,
  // accountAbstractionProvider,
  // useAAWithExternalWallet: false,
}
const web3auth = new Web3Auth(web3AuthOptions)

// Context
type TContext = {
  provider: IProvider | null
  web3auth: Web3Auth | null
  login: () => Promise<void>
  logout: () => Promise<void>
  loggedIn: boolean
}
const Web3AuthContext = createContext<TContext>({
  provider: null,
  web3auth: null,
  login: async () => {},
  logout: async () => {},
  loggedIn: false,
})

export const Web3AuthProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [provider, setProvider] = useState<IProvider | null>(null)
  const [loggedIn, setLoggedIn] = useState<boolean>(false)

  useEffect(() => {
    const init = async () => {
      const adapters = getDefaultExternalAdapters({
        options: web3AuthOptions,
      })
      adapters.forEach((adapter) => web3auth.configureAdapter(adapter))

      await web3auth.initModal()
      setProvider(web3auth.provider)
      setLoggedIn(web3auth.connected)
    }

    init()
  }, [])

  const login = async () => {
    const web3authProvider = await web3auth.connect()
    setProvider(web3authProvider)
    setLoggedIn(true)
  }

  const logout = async () => {
    await web3auth.logout()
    setProvider(null)
    setLoggedIn(false)
  }

  return (
    <Web3AuthContext.Provider
      value={{ provider, web3auth, login, logout, loggedIn }}
    >
      {children}
    </Web3AuthContext.Provider>
  )
}

// Utilitaire pour utiliser le contexte
export const useWeb3 = () => useContext(Web3AuthContext)
