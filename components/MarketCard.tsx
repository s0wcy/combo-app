import { Market } from '@/hooks/useMarkets';

export const MarketCard = ({ market }: { market: Market }) => {
  return (
    <div className="flex flex-col bg-blue rounded-sm text-[30px]">
      <h3>{market.market_slug}</h3>
      <p>{market.description}</p>
    </div>
  );
};
