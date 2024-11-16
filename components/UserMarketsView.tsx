import { useUserMarkets } from '@/hooks/useUserMarkets';

export const UserMarketsView = ({ user }: { user: string }) => {
  const { markets } = useUserMarkets(user);

  return (
    <div className="flex flex-col flex-wrap px-6">
      <h1 className="text-white text-[24px] mb-5">My Positions</h1>
      <div className="flex flex-wrap justify-between">
        {markets ? (
          Object.keys(markets).map((name: any, i) => (
            <div
              key={`${name}-${i}`}
              className="flex flex-col p-10 rounded-lg bg-grey w-[250px]"
            >
              <h3 className="test-white text-[20px]">{name}</h3>
              {markets[name].map((m: any) => (
                <div key={m.name}>
                  <h2>{m.name}</h2>
                  <div>
                    {m.tokens.map((t: any) => (
                      <div
                        key={t.token_id}
                        className="flex justify-between items-center"
                      >
                        <p>{t.outcome}</p>
                        <p>{t.price}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};
