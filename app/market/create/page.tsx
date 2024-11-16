/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-console */

"use client"

import { useEffect } from "react"

import { IProvider } from "@web3auth/base"

type TProps = {
  provider: IProvider | null
  loggedIn: boolean
}

function Create(props: TProps) {
  // Props
  const { provider, loggedIn } = props

  // Initialization
  useEffect(() => {}, [])

  const loggedInView = (
    <>
      <div className='flex-container'>
        <div>
          <button className='card'>Create a market</button>
        </div>
      </div>
    </>
  )

  const unloggedInView = <button className='card'>Login first</button>

  return (
    <div className='container'>
      <h1 className='title'>
        Create a{" "}
        <a
          target='_blank'
          href='https://web3auth.io/docs/sdk/pnp/web/modal'
          rel='noreferrer'
        >
          Combo
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

export default Create
