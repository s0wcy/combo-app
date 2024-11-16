import { useMarkets } from "@/hooks/useMarkets"
import { DotLoader } from "react-spinners"
import { ComboMarketCard } from "./ComboMarketCard"

export const ComboMarketsPreview = () => {
  const { markets, isLoading, isError } = useMarkets()

  console.log(markets)

  return (
    <div className='flex flex-wrap justify-between h-[calc(100%-160px)] px-[16px] overflow-hidden	'>
      {markets ? (
        Object.keys(markets).map((m) => (
          <div
            key={`combomarket-${m.replace(" ", "-")}`}
            className='w-[calc(25%-16px)] h-screen'
          >
            <ComboMarketCard name={m} markets={markets[m]} />
          </div>
        ))
      ) : (
        <div className='flex flex-col w-[100%] mt-[20%] items-center justify-center'>
          <DotLoader
            color='white'
            loading={isLoading}
            size={50}
            aria-label='Loading Markets'
            data-testid='loader'
          />
          <p className='text-[13px] text-white mt-10'>Loading Markets</p>
        </div>
      )}
    </div>
  )
}
