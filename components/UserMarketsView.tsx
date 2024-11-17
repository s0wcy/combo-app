import { useUserMarkets } from '@/hooks/useUserMarkets';

export const UserMarketsView = ({ user }: { user: string }) => {
  const { markets } = useUserMarkets(user);

  console.log(markets);
  return (
    <div className="flex flex-col flex-wrap px-6">
      {markets?.length ? (
        <h1 className="text-white text-[20px] mb ">My Positions</h1>
      ) : (
        <></>
      )}
      <div className="flex flex-wrap justify-between mx-10 mb-20 mt-10">
        {markets ? (
          markets.map((market: any, i) => (
            <div
              key={`${market.comboMarketName}-${i}`}
              className="flex flex-col p-10 rounded-lg bg-[#1E1E1E] w-[250px]"
            >
              <h3 className="text-white text-[16px] mb-10">
                {market.comboMarketName}
              </h3>
              <div>
                {market.tokens?.map((t: any, ii) => (
                  <div key={t} className="flex justify-between items-center">
                    <p>{t.outcome}</p>
                    <p>{t.price}</p>
                  </div>
                ))}
                <p className="text-[14px] text-white">
                  Total Cost: ${market.cost}
                </p>
              </div>
            </div>
          ))
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};
