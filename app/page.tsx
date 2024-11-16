/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-console */

"use client"

import { useEffect, useState } from "react"

import {
  CHAIN_NAMESPACES,
  IAdapter,
  IProvider,
  WEB3AUTH_NETWORK,
} from "@web3auth/base"
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider"
import { getDefaultExternalAdapters } from "@web3auth/default-evm-adapter"
import { Web3Auth, Web3AuthOptions } from "@web3auth/modal"
import RPC from "./viemRPC"

// Web3Auth Client
const clientId = process.env.NEXT_PUBLIC_WEB3AUTH_ID
if (!clientId) {
  throw new Error("Please provide clientId in .env file")
}

// Polygon Chain
const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0x89",
  rpcTarget: "https://rpc.ankr.com/polygon",
  displayName: "Polygon Mainnet",
  blockExplorerUrl: "https://polygonscan.com",
  ticker: "POL",
  tickerName: "Polygon Ecosystem Token",
  logo: "https://cryptologos.cc/logos/polygon-matic-logo.png",
}

// SDK Configuration
const privateKeyProvider = new EthereumPrivateKeyProvider({
  config: { chainConfig },
})
const web3AuthOptions: Web3AuthOptions = {
  clientId,
  web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
  privateKeyProvider,
}
const web3auth = new Web3Auth(web3AuthOptions)

function App() {
  // State
  const [provider, setProvider] = useState<IProvider | null>(null)
  const [loggedIn, setLoggedIn] = useState(false)

  // Initialization
  useEffect(() => {
    const init = async () => {
      try {
        // External Wallets
        const adapters = await getDefaultExternalAdapters({
          options: web3AuthOptions,
        })
        adapters.forEach((adapter: IAdapter<unknown>) => {
          web3auth.configureAdapter(adapter)
        })

        // SDK Initialization
        await web3auth.initModal()
        setProvider(web3auth.provider)
        if (web3auth.connected) {
          setLoggedIn(true)
        }
      } catch (error) {
        console.error(error)
      }
    }

    init()
  }, [])

  // Internal
  const login = async () => {
    const web3authProvider = await web3auth.connect()

    setProvider(web3authProvider)
    if (web3auth.connected) {
      setLoggedIn(true)
    }
  }

  const getUserInfo = async () => {
    const user = await web3auth.getUserInfo()

    uiConsole(user)
  }

  const logout = async () => {
    await web3auth.logout()

    setProvider(null)
    setLoggedIn(false)
    uiConsole("logged out")
  }

  // Blockchain
  // NOTE: Check the RPC file for the implementation
  const getAccounts = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet")
      return
    }
    const address = await RPC.getAccounts(provider)
    uiConsole(address)
  }

  const getBalance = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet")
      return
    }
    const balance = await RPC.getBalance(provider)
    uiConsole(balance)
  }

  const signMessage = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet")
      return
    }
    const signedMessage = await RPC.signMessage(provider)
    uiConsole(signedMessage)
  }

  const sendTransaction = async () => {
    if (!provider) {
      uiConsole("provider not initialized yet")
      return
    }
    uiConsole("Sending Transaction...")
    const transactionReceipt = await RPC.sendTransaction(provider)
    uiConsole(transactionReceipt)
  }

  // Helpers
  function uiConsole(...args: any[]): void {
    const el = document.querySelector("#console>p")
    if (el) {
      el.innerHTML = JSON.stringify(args || {}, null, 2)
      console.log(...args)
    }
  }

  const loggedInView = (
    <>
      <div className='flex-container'>
        <div>
          <button onClick={getUserInfo} className='card'>
            Get User Info
          </button>
        </div>
        <div>
          <button onClick={getAccounts} className='card'>
            Get Accounts
          </button>
        </div>
        <div>
          <button onClick={getBalance} className='card'>
            Get Balance
          </button>
        </div>
        <div>
          <button onClick={signMessage} className='card'>
            Sign Message
          </button>
        </div>
        <div>
          <button onClick={sendTransaction} className='card'>
            Send Transaction
          </button>
        </div>
        <div>
          <button onClick={logout} className='card'>
            Log Out
          </button>
        </div>
      </div>
    </>
  )

  const unloggedInView = (
    <button onClick={login} className='card'>
      Login
    </button>
  )

  return (
    <div className='container'>
      <h1 className='title'>
        <a
          target='_blank'
          href='https://web3auth.io/docs/sdk/pnp/web/modal'
          rel='noreferrer'
        >
          ComboMarket
        </a>
        .
      </h1>

      <div className='grid'>{loggedIn ? loggedInView : unloggedInView}</div>
      <div id='console' style={{ whiteSpace: "pre-line" }}>
        <p style={{ whiteSpace: "pre-line" }}></p>
      </div>

      <footer className='footer'>
        <a
          href='https://github.com/Web3Auth/web3auth-pnp-examples/tree/main/web-modal-sdk/quick-starts/nextjs-modal-quick-start'
          target='_blank'
          rel='noopener noreferrer'
        >
          Source code
        </a>
        <a href='https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FWeb3Auth%2Fweb3auth-pnp-examples%2Ftree%2Fmain%2Fweb-modal-sdk%2Fquick-starts%2Fnextjs-modal-quick-start&project-name=w3a-nextjs-modal&repository-name=w3a-nextjs-modal'>
          <img src='https://vercel.com/button' alt='Deploy with Vercel' />
        </a>
      </footer>
    </div>
  )
}

export default App
