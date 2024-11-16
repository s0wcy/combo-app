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

const FACTORY_ADDRESS = process.env.NEXT_PUBLIC_FACTORY_ADDRESS;

export const resolveConditionIdsToMarketIds = (
  ids: string[]
): Promise<string[]> =>
  request(
    'https://api.goldsky.com/api/public/project_cl6mb8i9h0003e201j6li0diw/subgraphs/positions-subgraph/0.0.7/gn',
    gqQuery,
    { ids }
  ).then((res: any) => res.tokenIdConditions.map((c: any) => c.condition.id));

export const fetchMarkets = (ids: string[]): Promise<Market[]> =>
  Promise.all(
    ids.map((id) => axios.get(`https://clob.polymarket.com/markets/${id}`))
  ).then((r) => r.map((e) => e.data));

const resolveMarkets = (ids: string[]) =>
  axios
    .get(
      `https://gamma-api.polymarket.com/markets?clob_token_ids=${ids.join(
        '&clob_token_ids='
      )}`
    )
    .then((r) => {
      return r.data.map((rr: any) => {
        return {
          ...rr,
          outcomes: JSON.parse(rr.outcomes),
          clobTokenIds: JSON.parse(rr.clobTokenIds),
          outcomePrices: JSON.parse(rr.outcomePrices),
        };
      });
    });

const getMarkets = async (user: string): Promise<any> => {
  const factoryAbi = ['function getMarkets() public view returns (address[])'];

  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

  const contract = new ethers.Contract(FACTORY_ADDRESS, factoryAbi, provider);

  const markets = await contract.getMarkets();

  const marketAbi = [
    'function getOutcomes() public view returns (uint256[])',
    'function name() public view returns (string)',
  ];

  const res: any = {};

  const marketPositionAbi = [
    'function positions() public view returns (address)',
  ];

  for (const market of markets) {
    const marketContract = new ethers.Contract(
      market,
      marketPositionAbi,
      provider
    );

    const positions = await marketContract.positions();

    const marketPositionsAbi = [
      'function name() public view returns (string)',
      'function balanceOf(address owner) public view returns (uint256)',
      'function tokenOfOwnerByIndex(address owner, uint256 index) public view returns (uint256)',
    ];

    const marketPositionsContract = new ethers.Contract(
      positions,
      marketPositionsAbi,
      provider
    );

    const balance = await marketPositionsContract.balanceOf(user);

    for (let i = 0; i < balance; i++) {
      const tokenId = await marketPositionsContract.tokenOfOwnerByIndex(
        user,
        i
      );
      const marketIds = await resolveConditionIdsToMarketIds([tokenId]);

      const polyMarkets = await resolveMarkets(marketIds);
      const comboMarketName = await marketContract.name();

      res[comboMarketName] = polyMarkets;
    }
    console.log(res);
    return res;
  }
};

export async function GET(request: any) {
  try {
    const { searchParams } = new URL(request.url);
    const user = searchParams.get('user'); // Get the 'user' parameter

    if (!user) {
      return NextResponse.json(
        { message: 'User parameter is required' },
        { status: 400 }
      );
    }
    const markets = await getMarkets(user);
    if (!markets) {
      return NextResponse.json({ markets: [] }, { status: 200 });
    }
    return NextResponse.json({ markets }, { status: 200 });
  } catch (error) {
    console.error('Error fetching balances:', error);
    return NextResponse.json({ message: error }, { status: 500 });
  }
}
