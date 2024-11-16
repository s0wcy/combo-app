import { useMarkets } from '@/hooks/useMarkets';
import { ComboMarketCard } from './ComboMarketCard';

export const ComboMarketsPreview = () => {
  const { markets, isLoading, isError } = useMarkets();

  console.log(markets);

  return (
    <div className="flex flex-wrap gap-5 p-3 justify-between">
      {markets ? (
        Object.keys(markets).map((m) => (
          <ComboMarketCard name={m} markets={markets[m]} />
        ))
      ) : (
        <></>
      )}
    </div>
  );
};
