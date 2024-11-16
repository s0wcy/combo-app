/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-console */

"use client"

import { useWeb3 } from "@/context/Web3Context"

import { Header } from "@/components/Header"

import { ComboMarketsPreview } from "@/components/ComboMarketsPreview"
import RPC from "@/rpc/viemRPC"
import { Button } from "@/components/Button"

function Wallet() {
  // Hooks
  const { web3auth } = useWeb3()
  if (!web3auth) {
    return <div>Loading...</div>
  }

  // Functions

  // Render
  return (
    <main className='w-full h-[calc(100%-80px)]'>
      <Header />

      <div className='mt-[80px]'>
        <ComboMarketsPreview />
      </div>
    </main>
  )
}

export default Wallet
