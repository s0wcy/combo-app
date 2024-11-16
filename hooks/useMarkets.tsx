import axios from 'axios';
import { gql, request } from 'graphql-request';
import useSWR from 'swr';

export type Market = {
  enable_order_book: boolean;
  active: boolean;
  closed: boolean;
  archived: boolean;
  accepting_orders: boolean;
  accepting_order_timestamp: string | null;
  minimum_order_size: number;
  minimum_tick_size: number;
  condition_id: string;
  question_id: string;
  question: string;
  description: string;
  market_slug: string;
  end_date_iso: string;
  game_start_time: string | null;
  seconds_delay: number;
  fpmm: string;
  maker_base_fee: number;
  taker_base_fee: number;
  notifications_enabled: boolean;
  neg_risk: boolean;
  neg_risk_market_id: string;
  neg_risk_request_id: string;
  icon: string;
  image: string;
  rewards: {
    rates: number | null;
    min_size: number;
    max_spread: number;
  };
  is_50_50_outcome: boolean;
  tokens: {
    token_id: string;
    outcome: string;
    price: number;
    winner: boolean;
  }[];
  tags: string[];
};

export type HookMarkets = {
  markets: Market[] | undefined;
  isLoading: boolean;
  isError: boolean;
  mutate: () => void;
};

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

export const useMarkets = (ids: string[] | undefined): HookMarkets => {
  const { data, error, mutate } = useSWR<Market[]>(
    `https://clob.polymarket.com/markets/${ids[0]}`
  );

  return {
    markets: data ?? undefined,
    isLoading: !error && !data,
    isError: Boolean(error),
    mutate,
  };
};
