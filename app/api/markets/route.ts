import { Market } from "@/hooks/useMarkets"
import axios from "axios"
import { ethers } from "ethers"
import request, { gql } from "graphql-request"
import { NextResponse } from "next/server"

const gqQuery = gql`
  query GetTokenIdConditions($ids: [String!]!) {
    tokenIdConditions(where: { id_in: $ids }) {
      id
      condition {
        id
      }
    }
  }
`

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

const FACTORY_ADDRESS = process.env.NEXT_PUBLIC_FACTORY_ADDRESS

export const resolveConditionIdsToMarketIds = (
  ids: string[]
): Promise<string[]> =>
  request(
    "https://api.goldsky.com/api/public/project_cl6mb8i9h0003e201j6li0diw/subgraphs/positions-subgraph/0.0.7/gn",
    gqQuery,
    { ids }
  ).then((res: any) => res.tokenIdConditions.map((c: any) => c.condition.id))

export const fetchMarkets = (ids: string[]): Promise<Market[]> =>
  Promise.all(
    ids.map((id) => axios.get(`https://clob.polymarket.com/markets/${id}`))
  ).then((r) => r.map((e) => e.data))

const resolveMarkets = (ids: string[]) =>
  axios
    .get(
      `https://gamma-api.polymarket.com/markets?clob_token_ids=${ids.join(
        "&clob_token_ids="
      )}`
    )
    .then((r) => {
      return r.data.map((rr: any) => {
        return {
          ...rr,
          outcomes: JSON.parse(rr.outcomes),
          clobTokenIds: JSON.parse(rr.clobTokenIds),
          outcomePrices: JSON.parse(rr.outcomePrices),
        }
      })
    })

const getMarkets = async (): Promise<any> => {
  const factoryAbi = ["function getMarkets() public view returns (address[])"]

  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL)

  const contract = new ethers.Contract(FACTORY_ADDRESS, factoryAbi, provider)

  const markets = await contract.getMarkets()

  const marketAbi = [
    "function getOutcomes() public view returns (uint256[])",
    "function name() public view returns (string)",
  ]

  const res: any = {}

  for (const comboMarket of markets) {
    console.log("MARKET", comboMarket)

    const comboMarketContract = new ethers.Contract(
      comboMarket,
      marketAbi,
      provider
    )

    const comboMarketName = await comboMarketContract.name()

    let outcomes = await comboMarketContract.getOutcomes()
    outcomes = outcomes.map((o: BigInt) => o.toString())

    let polyMarkets = await resolveMarkets(outcomes)

    polyMarkets = polyMarkets.map((m: any) => ({
      ...m,
      tokens: m.outcomes.map((o: any, i: number) => {
        return {
          token_id: m.clobTokenIds[i],
          outcome: o,
          price: m.outcomePrices[i],
        }
      }),
    }))

    res[comboMarketName] = polyMarkets
  }

  return res
}

export async function GET() {
  try {
    const markets = await getMarkets()
    return NextResponse.json({ markets }, { status: 200 })
  } catch (error) {
    console.error("Error fetching balances:", error)
    return NextResponse.json({ message: error }, { status: 500 })
  }
}
