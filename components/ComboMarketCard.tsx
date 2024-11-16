import { Market } from '@/hooks/useMarkets';
import { useState } from 'react';

export const ComboMarketCard = ({
  name,
  markets,
}: {
  name: string;
  markets: Market[];
}) => {
  const [selectedTokens, setSelectedTokens] = useState<Market['tokens']>([]);

  console.log(markets);

  const handleSelectToken = (token: Market['tokens'][0], market: Market) => {
    console.log(token, selectedTokens);
    // if already selected -> unselect
    if (selectedTokens.find((t) => t.token_id === token.token_id)) {
      setSelectedTokens((prev) =>
        prev.filter((i) => i.token_id !== token.token_id)
      );
      return;
    }

    // if other answer of the market is selected, switch to the newly selected one
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

  return (
    <div className="flex flex-col bg-[#1E1E1E] rounded-xl w-[400px] p-10 text-[#d3d3d3]">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-[20px] text-white">{name}</h3>
        <button className="text-underlined hover:cursor-pointer hover:underline mt-5 text-[10px]">
          Provide Liquidity
        </button>
      </div>
      <div className="flex flex-col gap-4">
        {markets.map((market) => (
          <div key={market.question_id} className="flex flex-col gap-2">
            <p className="text-[14px] text-white">{market.question}</p>
            <div className="flex flex-col gap-2 mb-5">
              {market.tokens.map((token) => (
                <div
                  className={`flex bg-[${
                    selectedTokens.find((t) => t.token_id === token.token_id)
                      ? '#2f7c5f'
                      : '#303030'
                  }] rounded-md hover:cursor-pointer hover:bg-[${
                    selectedTokens.find((t) => t.token_id === token.token_id)
                      ? '#2f7c5f'
                      : '#363636'
                  }] p-3 gap-10 items-center`}
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
      <div className="flex flex-col mt-10 items-center justify-between">
        <p className="pl-3 text-[12px] mb-4 text-[#bebebe]">
          Combined prices: {(selectedPrice * 100).toFixed(2)}%
        </p>
        {selectedTokens.length > 0 ? (
          <div className="flex items-center">
            <input
              className="p-5 rounded-xl bg-[#303030] text-[12px] w-[80px]"
              type="number"
              defaultValue={20}
            />
            <p className="text-[14px] mr-4">$</p>
            <button className="py-5 px-8 rounded-xl bg-[#24AE60] text-[12px] text-white hover:bg-[#32c06f]">
              Buy
            </button>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};
