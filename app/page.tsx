/* eslint-disable @typescript-eslint/no-use-before-define */
/* eslint-disable no-console */

'use client';

import { useWeb3 } from '@/context/Web3Context';

import { ComboMarketsPreview } from '@/components/ComboMarketsPreview';
import { Header } from '@/components/Header';
import { UserMarketsView } from '@/components/UserMarketsView';
import RPC from '@/rpc/viemRPC';
import { useEffect, useState } from 'react';

function App() {
  // Hooks
  const { provider, web3auth, login, logout, loggedIn } = useWeb3();
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    if (loggedIn) {
      getAccounts().then((res: any) => setUser(res[0]));
    } else {
      setUser(null);
    }
  }, [loggedIn]);

  if (!web3auth) {
    return <div>Loading...</div>;
  }

  // Functions
  const getUserInfo = async () => {
    const user = await web3auth.getUserInfo();
  };

  const getAccounts = async () => {
    if (!provider) {
      return;
    }
    const address = await RPC.getAccounts(provider);
    return address;
  };

  const getBalance = async () => {
    if (!provider) {
      return;
    }
    const balance = await RPC.getBalance(provider);
  };

  const signMessage = async () => {
    if (!provider) {
      return;
    }
    const signedMessage = await RPC.signMessage(provider);
  };

  const sendTransaction = async () => {
    if (!provider) {
      return;
    }
    const transactionReceipt = await RPC.sendTransaction(provider);
  };

  console.log(getAccounts().then((res) => console.log('LOGGUED WITH', res)));

  // const walletView = (
  //   <div className='flex flex-row justify-center items-center w-full'>
  //     <Button label='Get User Info' action={getUserInfo} />
  //     <Button label='Get Accounts' action={getAccounts} />
  //     <Button label='Get Balance' action={getBalance} />
  //     <Button label='Sign Message' action={signMessage} />
  //     <Button label='Send Transaction' action={sendTransaction} />
  //     <Button label='Log Out' action={logout} />
  //   </div>
  // )

  console.log('LOGGED IN', loggedIn, 'USER', user);

  return (
    <main className="w-full h-[calc(100%-80px)]">
      <Header />

      {/* {walletView} */}

      <div className="mt-[80px]">
        {loggedIn && user !== null ? <UserMarketsView user={user} /> : <></>}
        <ComboMarketsPreview />
      </div>
    </main>
  );
}

export default App;
