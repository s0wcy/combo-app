import { useMarkets } from "@/hooks/useMarkets"
import { DotLoader } from "react-spinners"
import { ComboMarketCard } from "./ComboMarketCard"

export const ComboMarketsPreview = () => {
  const { markets, isLoading, isError } = useMarkets()
  // const { markets: marketsState, setMarkets } = useMarketsContext()

  console.log(markets)
  // console.log(marketsState.length)

  return (
    <div className='flex flex-wrap p-5 justify-between'>
      {markets ? (
        Object.keys(markets).map((m) => (
          <ComboMarketCard name={m} markets={markets[m]} />
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
