import { fetchMarkets, Market } from '@/hooks/useMarkets';
import { useEffect, useState } from 'react';
import { ComboMarketCard } from './ComboMarketCard';

export const ComboMarketsPreview = () => {
  const [markets, setMarkets] = useState<Market[] | undefined>(undefined);

  useEffect(() => {
    fetchMarkets([
      '0xc481b0b1bf98a3e13861d2f3a196f1173249006b7317cb295fd5f57d23b0ce3e',
      '0x36a81323d7680332a70072f4c3f80c67213a910903d6b1a4f3ff767d7582d421',
      '0x85315ee59d6ddb8524e6ec516a930bb674e77050b457161aa716e6c759f57a06',
    ]).then((markets) => setMarkets(markets));
  }, []);

  console.log(markets);

  return (
    <div className="flex flex-wrap gap-5 p-3 justify-between">
      {markets ? <ComboMarketCard markets={markets} /> : <></>}
    </div>
  );
};
