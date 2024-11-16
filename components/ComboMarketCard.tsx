import MarketABI from '@/abi/Market.json';
import { useWeb3 } from '@/context/Web3Context';
import { Market } from '@/hooks/useMarkets';
import { ethers, Interface } from 'ethers';
import { useState } from 'react';
import { erc20Abi } from 'viem';

export const ComboMarketCard = ({
  name,
  markets,
}: {
  name: string;
  markets: Market[];
}) => {
  const [selectedTokens, setSelectedTokens] = useState<Market['tokens']>([]);
  const [selectedAmount, setSelectedAmount] = useState<string>('1');

  const { web3auth } = useWeb3();

  const handleSelectToken = (token: Market['tokens'][0], market: Market) => {
    if (selectedTokens.find((t) => t.token_id === token.token_id)) {
      setSelectedTokens((prev) =>
        prev.filter((i) => i.token_id !== token.token_id)
      );
      return;
    }

    for (let i = 0; i < market.tokens.length; i++) {
      setSelectedTokens((prev) =>
        prev.filter((ii) => ii.token_id !== market.tokens[i].token_id)
      );
    }
    setSelectedTokens((prev) => [...prev, token]);
  };

  const selectedPrice =
    selectedTokens.length === 0
      ? 0
      : selectedTokens
          .map((t) => t.price)
          .reduce((prev, current) => prev * current);

  const handleBuy = async () => {
    const betsLength = selectedTokens.length;
    let positionOutcome = [];
    let purchaseParams = [];
    for (let i = 0; i < betsLength; i++) {
      const USDCamount =
        Math.floor(parseInt(selectedAmount) / betsLength) * 10 ** 6;
      positionOutcome.push({
        outcome: selectedTokens[i].token_id,
        principalAmount: USDCamount,
      });

      const market = markets.find((m) =>
        m.tokens.find((t) => t.token_id === selectedTokens[i].token_id)
      );
      const outcomesLength = market?.outcomes.map((o, i) => 0b1 << i);
      const pricePerUnit = selectedTokens[i].price * 10 ** 6;

      purchaseParams.push({
        parentCollectionId:
          '0x0000000000000000000000000000000000000000000000000000000000000000',
        conditionId: market?.conditionId,
        indexSets: outcomesLength,
        pricePerUnit: pricePerUnit,
      });
    }

    const marketMaker = process.env.NEXT_PUBLIC_MARKET_MAKER_ADDRESS;

    const ethersProvider = new ethers.BrowserProvider(web3auth?.provider!);
    const signer = await ethersProvider.getSigner();
    const fees = await ethersProvider.getFeeData();

    // 1. Approve Market USDC
    let tx = await signer.sendTransaction({
      to: process.env.NEXT_PUBLIC_USDC_ADDRESS,
      data: new Interface(erc20Abi).encodeFunctionData('approve', [
        process.env.NEXT_PUBLIC_MARKET_ADDRESS,
        BigInt(parseInt(selectedAmount) * 10 ** 6),
      ]),
      maxPriorityFeePerGas: fees.maxPriorityFeePerGas,
      maxFeePerGas: fees.maxFeePerGas,
      gasLimit: BigInt('2000000'),
    });

    await tx.wait();

    console.log('Approve TX', tx);

    // 2. Comboooooo

    console.log('AAAAA', positionOutcome, purchaseParams, marketMaker);
    tx = await signer.sendTransaction({
      to: process.env.NEXT_PUBLIC_MARKET_ADDRESS,
      data: new Interface(MarketABI).encodeFunctionData('combo', [
        positionOutcome,
        purchaseParams,
        marketMaker,
      ]),
      maxPriorityFeePerGas: fees.maxPriorityFeePerGas,
      maxFeePerGas: fees.maxFeePerGas,
      gasLimit: BigInt('2000000'),
    });

    await tx.wait();

    console.log('Purchase TX:', tx);
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#1E1E1E] rounded-[4px] text-[#d3d3d3]">
      {/* Head */}
      <div className="sticky top-0 left-0 z-10 w-full bg-[#1E1E1E] p-4">
        <h3 className="text-[20px] text-white border-b-[1px] border-solid border-grey mb-4">
          {name}
        </h3>
        <button className="rounded-lg p-5 bg-[#1a1f54] w-[100%] hover:bg-[#1f2563]">
          Provide Liquidity
        </button>
      </div>

      {/* Main */}
      <div className="flex-grow overflow-auto px-[8px] mt-2">
        <div className="flex justify-center items-center w-full text-[14px] mb-[16px] pb-[12px] border-b-[1px] border-solid border-grey">
          or
        </div>
        <div className="flex flex-col gap-4">
          {markets.map((market) => (
            <div key={market.questionID} className="flex flex-col gap-2">
              <div className="flex gap-4">
                <img
                  className="rounded-lg w-[25px] h-[25px]"
                  src={market.icon}
                  alt=""
                />
                <p className="text-[14px] text-white">{market.question}</p>
              </div>
              <div className="flex flex-col gap-2 mb-5">
                {market.tokens.map((token) => (
                  <div
                    key={token.token_id}
                    style={{
                      backgroundColor: selectedTokens.find(
                        (t) => t.token_id === token.token_id
                      )
                        ? token.outcome === 'No'
                          ? '#E84142'
                          : '#2f7c5f'
                        : '#303030',
                    }}
                    className="flex rounded-md hover:cursor-pointer p-3 gap-10 items-center"
                    onClick={() => handleSelectToken(token, market)}
                  >
                    <p className="text-[10px] w-[50px]">
                      {(token.price * 100).toFixed(1)}%
                    </p>
                    <p className="text-[12px]">{token.outcome}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Submit */}
      <div className="sticky bottom-0 left-0 w-full bg-[#1E1E1E] p-4 border-t border-grey">
        <div className="flex flex-col items-center">
          <p className="text-[12px] mb-4 text-[#bebebe]">
            Combined chances: {(selectedPrice * 100).toFixed(2)}%
          </p>
          {selectedTokens.length > 0 ? (
            <div className="flex items-center">
              <input
                className="p-2 rounded-xl bg-[#303030] text-[12px] w-[80px]"
                type="number"
                value={selectedAmount}
                onChange={(e) => setSelectedAmount(e.target.value)}
              />
              <p className="text-[14px] mx-2">$</p>
              <button
                className="py-2 px-4 rounded-xl bg-[#24AE60] text-[12px] text-white hover:bg-[#32c06f]"
                onClick={handleBuy}
              >
                Buy
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
