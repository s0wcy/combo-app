import { useWeb3 } from "@/context/Web3Context"

import { Button } from "@/components/Button"

import { Righteous } from "next/font/google"

const righteous = Righteous({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
})

export const Header = () => {
  const { login, logout, loggedIn } = useWeb3()

  return (
    <header className='flex flex-row justify-between items-center w-screen h-[80px] px-[16px] border-b-[1px] border-solid border-grey'>
      <h1 className={`${righteous.className} text-cream text-[32px]`}>
        Combo
        <span className='text-blue'>.</span>
      </h1>
      <div className='flex flex-row justify-between items-center h-[56px]'>
        {loggedIn ? (
          <Button label='Logout' action={logout} />
        ) : (
          <Button label='Login' action={login} />
        )}
      </div>
      <div
        className={`${righteous.className} text-[280px] text-cream font-bold rotate-[18deg] absolute top-[-150px] right-[-20px] opacity-[0.02] pointer-events-none`}
      >
        omd
      </div>
    </header>
  )
}
