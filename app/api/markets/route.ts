import { Market } from '@/hooks/useMarkets';
import axios from 'axios';
import { ethers } from 'ethers';
import request, { gql } from 'graphql-request';
import { NextResponse } from 'next/server';

const gqQuery = gql`
  query GetTokenIdConditions($ids: [String!]!) {
    tokenIdConditions(where: { id_in: $ids }) {
      id
      condition {
        id
      }
    }
  }
`;

// const marketPositionAbi = [
//   'function positions() public view returns (address)',
// ];

// for (const market of markets) {
//   const marketContract = new ethers.Contract(
//     market,
//     marketPositionAbi,
//     provider
//   );
// }
// const positions = await marketContract.positions();

// const marketPositionsAbi = [
//   'function balanceOf() public view returns (uint256)',
//   'function tokenOfOwnerByIndex(address owner, uint256 index) public view returns (uint256)',
// ];

// const marketPositionsContract = new ethers.Contract(
//   positions,
//   marketPositionsAbi,
//   provider
// );

// const balance = await marketPositionsContract.balanceOf();

const FACTORY_ADDRESS = '0x5476f650163544f8da6cbc24b146794c90ea7d70';

export const resolveConditionIdsToMarketIds = (
  ids: string[]
): Promise<string[]> =>
  request(
    'https://api.goldsky.com/api/public/project_cl6mb8i9h0003e201j6li0diw/subgraphs/positions-subgraph/0.0.7/gn',
    gqQuery,
    { ids }
  ).then((res: any) => res.tokenIdConditions.map((c: any) => c.condition.id));

export const fetchMarkets = (ids: string[]): Promise<Market[]> =>
  axios
    .all(
      ids.map((id) => axios.get(`https://clob.polymarket.com/markets/${id}`))
    )
    .then(
      axios.spread((...res) =>
        res.map((r) => {
          console.log(r);
          return r.data;
        })
      )
    );

const getMarkets = async (): Promise<any> => {
  const factoryAbi = ['function getMarkets() public view returns (address[])'];

  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

  const contract = new ethers.Contract(FACTORY_ADDRESS, factoryAbi, provider);

  const markets = await contract.getMarkets();

  const marketAbi = [
    'function getOutcomes() public view returns (uint256[])',
    'function name() public view returns (string)',
  ];

  const res = {};

  for (const comboMarket of markets) {
    console.log('MARKET', comboMarket);

    const comboMarketContract = new ethers.Contract(
      comboMarket,
      marketAbi,
      provider
    );

    const comboMarketName = await comboMarketContract.name();

    let outcomes = await comboMarketContract.getOutcomes();
    outcomes = outcomes.map((o: BigInt) => o.toString());

    console.log('OUTCOMES', outcomes.length, outcomes);

    const conditions = await resolveConditionIdsToMarketIds(outcomes);

    console.log('CONDITIONS', conditions.length, conditions);

    let markets = await fetchMarkets(conditions);

    // remove duplicate markets
    markets = markets.filter(
      (m, i, arr) =>
        arr.findIndex((o) => o.condition_id === m.condition_id) === i
    );

    console.log('MARKETS', markets.length);

    res[comboMarketName] = markets;
  }

  return res;
};

export async function GET() {
  try {
    const markets = await getMarkets();
    return NextResponse.json({ markets }, { status: 200 });
  } catch (error) {
    console.error('Error fetching balances:', error);
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
