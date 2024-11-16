/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-console */

"use client"

import { useWeb3 } from "@/context/Web3Context"

import { Header } from "@/components/Header"

import { ComboMarketsPreview } from "@/components/ComboMarketsPreview"
import RPC from "../rpc/viemRPC"
import { Button } from "@/components/Button"

function App() {
  // Hooks
  const { provider, web3auth, login, logout, loggedIn } = useWeb3()
  if (!web3auth) {
    return <div>Loading...</div>
  }

  // Functions
  const getUserInfo = async () => {
    const user = await web3auth.getUserInfo()

    uiConsole(user)
  }

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

  console.log(getAccounts().then((res) => console.log("LOGGUED WITH", res)))

  const walletView = (
    <div className='flex flex-row justify-center items-center w-full'>
      <Button label='Get User Info' action={getUserInfo} />
      <Button label='Get Accounts' action={getAccounts} />
      <Button label='Get Balance' action={getBalance} />
      <Button label='Sign Message' action={signMessage} />
      <Button label='Send Transaction' action={sendTransaction} />
      <Button label='Log Out' action={logout} />
    </div>
  )

  return (
    <main className='w-full h-[calc(100%-80px)]'>
      {/* <Header /> */}

      {walletView}

      <div id='console' style={{ whiteSpace: "pre-line" }}>
        <p className='text-white' style={{ whiteSpace: "pre-line" }}></p>
      </div>

      <div className='mt-[80px]'>
        <ComboMarketsPreview />
      </div>
    </main>
  )
}

export default App
