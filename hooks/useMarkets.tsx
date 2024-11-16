import axios from 'axios';
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
  markets: { [name: string]: Market[] } | undefined;
  isLoading: boolean;
  isError: boolean;
  mutate: () => void;
};

const fetcher = (q) => axios.get(q).then((d) => d.data);

export const useMarkets = (): HookMarkets => {
  const { data, error, mutate } = useSWR<{
    markets: { [name: string]: Market[] };
  }>(`/api/markets`, fetcher);

  return {
    markets: data?.markets ?? undefined,
    isLoading: !error && !data,
    isError: Boolean(error),
    mutate,
  };
};
