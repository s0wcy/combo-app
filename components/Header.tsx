import { useWeb3Auth } from "@/context/Web3AuthContext"

import { Button } from "@/components/Button"

export const Header = () => {
  const { provider, web3auth, login, logout, loggedIn } = useWeb3Auth()

  return (
    <header className='flex flex-row justify-between items-center w-screen h-[80px] px-[16px] absolute top-0 left-0'>
      <h1 className='font-markazi text-cream text-[24px]'>
        ComboMarket
        <span className='text-blue'>.</span>
      </h1>
      <div className='flex flex-row justify-between items-center h-[56px]'>
        {loggedIn ? (
          <Button label='Logout' action={logout} />
        ) : (
          <Button label='Login' action={login} />
        )}
      </div>
    </header>
  )
}
