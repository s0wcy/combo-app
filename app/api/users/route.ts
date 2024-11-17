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
): Promise<string[]> => {
  console.log(ids);
  return request(
    'https://api.goldsky.com/api/public/project_cl6mb8i9h0003e201j6li0diw/subgraphs/positions-subgraph/0.0.7/gn',
    gqQuery,
    { ids }
  ).then((res: any) => res.tokenIdConditions.map((c: any) => c.condition.id));
};
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

  const res: any = [];

  const marketPositionAbi = [
    'function name() public view returns (string)',
    'function positions() public view returns (address)',
  ];

  const ctf = '0x4D97DCd97eC945f40cF65F87097ACe5EA0476045';
  const ctfabi = [
    'function balanceOf(address owner, uint256 id) public view returns (uint256)',
  ];
  const ctfContract = new ethers.Contract(ctf, ctfabi, provider);

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
      'function getPosition(uint256) view returns ((uint256,uint256)[],address,address)',
    ];

    const marketPositionsContract = new ethers.Contract(
      positions,
      '[{"type":"constructor","inputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"approve","inputs":[{"name":"to","type":"address","internalType":"address"},{"name":"tokenId","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"balanceOf","inputs":[{"name":"owner","type":"address","internalType":"address"}],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"burn","inputs":[{"name":"tokenId","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"counter","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"ctf","inputs":[],"outputs":[{"name":"","type":"address","internalType":"contract IERC1155"}],"stateMutability":"view"},{"type":"function","name":"getApproved","inputs":[{"name":"tokenId","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"address","internalType":"address"}],"stateMutability":"view"},{"type":"function","name":"getPosition","inputs":[{"name":"tokenId","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"tuple","internalType":"struct MarketPositions.PositionInfo","components":[{"name":"outcomes","type":"tuple[]","internalType":"struct MarketPositions.PositionOutcomeInfo[]","components":[{"name":"outcome","type":"uint256","internalType":"uint256"},{"name":"principalAmount","type":"uint256","internalType":"uint256"}]},{"name":"market","type":"address","internalType":"contract Market"},{"name":"position","type":"address","internalType":"contract MarketPosition"}]}],"stateMutability":"view"},{"type":"function","name":"isApprovedForAll","inputs":[{"name":"owner","type":"address","internalType":"address"},{"name":"operator","type":"address","internalType":"address"}],"outputs":[{"name":"","type":"bool","internalType":"bool"}],"stateMutability":"view"},{"type":"function","name":"mint","inputs":[{"name":"account","type":"address","internalType":"address"},{"name":"outcomes","type":"tuple[]","internalType":"struct MarketPositions.PositionOutcomeInfo[]","components":[{"name":"outcome","type":"uint256","internalType":"uint256"},{"name":"principalAmount","type":"uint256","internalType":"uint256"}]},{"name":"amounts","type":"uint256[]","internalType":"uint256[]"}],"outputs":[{"name":"","type":"uint256","internalType":"uint256"},{"name":"","type":"tuple","internalType":"struct MarketPositions.PositionInfo","components":[{"name":"outcomes","type":"tuple[]","internalType":"struct MarketPositions.PositionOutcomeInfo[]","components":[{"name":"outcome","type":"uint256","internalType":"uint256"},{"name":"principalAmount","type":"uint256","internalType":"uint256"}]},{"name":"market","type":"address","internalType":"contract Market"},{"name":"position","type":"address","internalType":"contract MarketPosition"}]}],"stateMutability":"nonpayable"},{"type":"function","name":"name","inputs":[],"outputs":[{"name":"","type":"string","internalType":"string"}],"stateMutability":"view"},{"type":"function","name":"ownerOf","inputs":[{"name":"tokenId","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"address","internalType":"address"}],"stateMutability":"view"},{"type":"function","name":"positions","inputs":[{"name":"","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"market","type":"address","internalType":"contract Market"},{"name":"position","type":"address","internalType":"contract MarketPosition"}],"stateMutability":"view"},{"type":"function","name":"safeTransferFrom","inputs":[{"name":"from","type":"address","internalType":"address"},{"name":"to","type":"address","internalType":"address"},{"name":"tokenId","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"safeTransferFrom","inputs":[{"name":"from","type":"address","internalType":"address"},{"name":"to","type":"address","internalType":"address"},{"name":"tokenId","type":"uint256","internalType":"uint256"},{"name":"data","type":"bytes","internalType":"bytes"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"setApprovalForAll","inputs":[{"name":"operator","type":"address","internalType":"address"},{"name":"approved","type":"bool","internalType":"bool"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"function","name":"supportsInterface","inputs":[{"name":"interfaceId","type":"bytes4","internalType":"bytes4"}],"outputs":[{"name":"","type":"bool","internalType":"bool"}],"stateMutability":"view"},{"type":"function","name":"symbol","inputs":[],"outputs":[{"name":"","type":"string","internalType":"string"}],"stateMutability":"view"},{"type":"function","name":"tokenByIndex","inputs":[{"name":"index","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"tokenOfOwnerByIndex","inputs":[{"name":"owner","type":"address","internalType":"address"},{"name":"index","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"tokenURI","inputs":[{"name":"tokenId","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"","type":"string","internalType":"string"}],"stateMutability":"view"},{"type":"function","name":"totalSupply","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},{"type":"function","name":"transferFrom","inputs":[{"name":"from","type":"address","internalType":"address"},{"name":"to","type":"address","internalType":"address"},{"name":"tokenId","type":"uint256","internalType":"uint256"}],"outputs":[],"stateMutability":"nonpayable"},{"type":"event","name":"Approval","inputs":[{"name":"owner","type":"address","indexed":true,"internalType":"address"},{"name":"approved","type":"address","indexed":true,"internalType":"address"},{"name":"tokenId","type":"uint256","indexed":true,"internalType":"uint256"}],"anonymous":false},{"type":"event","name":"ApprovalForAll","inputs":[{"name":"owner","type":"address","indexed":true,"internalType":"address"},{"name":"operator","type":"address","indexed":true,"internalType":"address"},{"name":"approved","type":"bool","indexed":false,"internalType":"bool"}],"anonymous":false},{"type":"event","name":"Combo","inputs":[{"name":"account","type":"address","indexed":true,"internalType":"address"},{"name":"market","type":"address","indexed":true,"internalType":"contract Market"},{"name":"comboId","type":"uint256","indexed":false,"internalType":"uint256"},{"name":"info","type":"tuple","indexed":false,"internalType":"struct MarketPositions.PositionInfo","components":[{"name":"outcomes","type":"tuple[]","internalType":"struct MarketPositions.PositionOutcomeInfo[]","components":[{"name":"outcome","type":"uint256","internalType":"uint256"},{"name":"principalAmount","type":"uint256","internalType":"uint256"}]},{"name":"market","type":"address","internalType":"contract Market"},{"name":"position","type":"address","internalType":"contract MarketPosition"}]}],"anonymous":false},{"type":"event","name":"Transfer","inputs":[{"name":"from","type":"address","indexed":true,"internalType":"address"},{"name":"to","type":"address","indexed":true,"internalType":"address"},{"name":"tokenId","type":"uint256","indexed":true,"internalType":"uint256"}],"anonymous":false}]',
      provider
    );

    console.log('A');

    const balance = await marketPositionsContract.balanceOf(user);

    for (let i = 0; i < balance; i++) {
      console.log('B');
      const tokenId = await marketPositionsContract.tokenOfOwnerByIndex(
        user,
        i
      );
      console.log('C', tokenId);
      const position = await marketPositionsContract.getPosition(tokenId);
      console.log('D', position);

      let cost = BigInt(0);
      for (const outcome of position.outcomes) {
        console.log('E', outcome);
        cost += await ctfContract.balanceOf(
          position.position,
          BigInt(outcome.outcome).toString()
        );
        console.log(
          'FFF',
          position.outcomes.map((o: any) => BigInt(o.outcome).toString())
        );
      }

      let polyMarkets = await resolveMarkets(
        position.outcomes.map((o: any) => BigInt(o.outcome).toString())
      );
      polyMarkets = polyMarkets.map((m: any) => ({
        ...m,
        tokens: m.outcomes.map((o: any, i: number) => {
          return {
            token_id: m.clobTokenIds[i],
            outcome: o,
            price: m.outcomePrices[i],
          };
        }),
      }));
      const comboMarketName = await marketContract.name();
      res.push({
        ...polyMarkets,
        cost: (cost / BigInt(10 ** 6)).toString(),
        comboMarketName,
      });
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
