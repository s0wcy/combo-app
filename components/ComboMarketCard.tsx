import { Button } from '@/components/Button';
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

  return (
    <div className="flex flex-col h-full w-full bg-[#1E1E1E] rounded-[4px] text-[#d3d3d3]">
      {/* Head */}
      <div className="sticky top-0 left-0 z-10 w-full bg-[#1E1E1E] p-4">
        <h3 className="text-[20px] text-white border-b-[1px] border-solid border-grey mb-4">
          {name}
        </h3>
        <Button label="Provide Liquidity" />
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
            Combined prices: {(selectedPrice * 100).toFixed(2)}%
          </p>
          {selectedTokens.length > 0 ? (
            <div className="flex items-center">
              <input
                className="p-2 rounded-xl bg-[#303030] text-[12px] w-[80px]"
                type="number"
                defaultValue={20}
              />
              <p className="text-[14px] mx-2">$</p>
              <button className="py-2 px-4 rounded-xl bg-[#24AE60] text-[12px] text-white hover:bg-[#32c06f]">
                Buy
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
