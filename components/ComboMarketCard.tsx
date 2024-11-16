import { Market } from "@/hooks/useMarkets"
import { useState } from "react"
import { Button } from "@/components/Button"

export const ComboMarketCard = ({
  name,
  markets,
}: {
  name: string
  markets: Market[]
}) => {
  const [selectedTokens, setSelectedTokens] = useState<Market["tokens"]>([])

  console.log(markets)

  const handleSelectToken = (token: Market["tokens"][0], market: Market) => {
    console.log(token, selectedTokens)
    // if already selected -> unselect
    if (selectedTokens.find((t) => t.token_id === token.token_id)) {
      setSelectedTokens((prev) =>
        prev.filter((i) => i.token_id !== token.token_id)
      )
      return
    }

    // if other answer of the market is selected, switch to the newly selected one
    for (let i = 0; i < market.tokens.length; i++) {
      setSelectedTokens((prev) =>
        prev.filter((ii) => ii.token_id !== market.tokens[i].token_id)
      )
    }
    setSelectedTokens((prev) => [...prev, token])
  }

  const selectedPrice =
    selectedTokens.length === 0
      ? 0
      : selectedTokens
          .map((t) => t.price)
          .reduce((prev, current) => prev * current)

  return (
    <div className='flex flex-col bg-[#1E1E1E] rounded-xl w-full max-h-[calc(100%-112px)] p-10 text-[#d3d3d3] overflow-scroll'>
      {/* Head */}
      <div className='flex flex-col justify-between items-center mt-[8px] w-full'>
        <h3 className='w-full pb-[12px] mb-[4px] text-[20px] text-white text-nowrap border-b-[1px] border-solid border-grey'>
          {name}
        </h3>
        <Button label='Provide Liquidity' />
      </div>

      {/* Spacer */}
      <div className='flex justify-center items-center w-full text-[14px] mb-[16px] pb-[12px] border-b-[1px] border-solid border-grey'>
        or
      </div>

      {/* Mask */}
      <div className='w-full h-[80px] absolute left-0 bottom-0 bg-gradient-to-b from-transparent from-0% via-slate-400 via-60% to-black to-100%'></div>

      {/* Markets */}
      <div className='flex flex-col gap-4'>
        {markets.map((market) => (
          <div key={market.question_id} className='flex flex-col gap-2'>
            <div className='flex gap-4'>
              <img
                className='rounded-lg w-[25px] h-[25px]'
                src={market.icon}
                alt=''
              />
              <p className='text-[14px] text-white'>{market.question}</p>
            </div>
            <div className='flex flex-col gap-2 mb-5'>
              {market.tokens.map((token) => (
                <div
                  style={{
                    backgroundColor: selectedTokens.find(
                      (t) => t.token_id === token.token_id
                    )
                      ? token.outcome === "No"
                        ? "#E84142"
                        : "#2f7c5f"
                      : "#303030",
                  }}
                  className={`flex rounded-md hover:cursor-pointer p-3 gap-10 items-center`}
                  onClick={() => handleSelectToken(token, market)}
                >
                  <p className='text-[10px] w-[50px]'>
                    {(token.price * 100).toFixed(1)}%
                  </p>
                  <p className='text-[12px]'>{token.outcome}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Buy */}
      <div className='flex flex-col mt-10 items-center justify-between'>
        <p className='pl-3 text-[12px] mb-4 text-[#bebebe]'>
          Combined prices: {(selectedPrice * 100).toFixed(2)}%
        </p>
        {selectedTokens.length > 0 ? (
          <div className='flex items-center'>
            <input
              className='p-5 rounded-xl bg-[#303030] text-[12px] w-[80px]'
              type='number'
              defaultValue={20}
            />
            <p className='text-[14px] mr-4'>$</p>
            <button className='py-5 px-8 rounded-xl bg-[#24AE60] text-[12px] text-white hover:bg-[#32c06f]'>
              Buy
            </button>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  )
}
