import { fetchMarkets, Market } from '@/hooks/useMarkets';
import { useEffect, useState } from 'react';
import { MarketCard } from './MarketCard';

export const MarketsPreview = () => {
  const [markets, setMarkets] = useState<Market[] | undefined>(undefined);

  useEffect(() => {
    fetchMarkets([
      '0xc481b0b1bf98a3e13861d2f3a196f1173249006b7317cb295fd5f57d23b0ce3e',
    ]).then((markets) => setMarkets(markets));
  }, []);

  console.log(markets);

  return (
    <div className="flex flex-col gap-5">
      {markets?.map((market) => (
        <MarketCard key={market.question_id} market={market} />
      ))}
    </div>
  );
};
