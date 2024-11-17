import { useWeb3 } from '@/context/Web3Context';
import axios from 'axios';
import { ethers } from 'ethers';
import useSWR from 'swr';

export type Market = {
  id: string;
  question: string;
  conditionId: string;
  slug: string;
  resolutionSource: string;
  endDate: string;
  liquidity: string;
  startDate: string;
  image: string;
  icon: string;
  description: string;
  outcomes: string[];
  outcomePrices: string[];
  volume: string;
  active: boolean;
  closed: boolean;
  marketMakerAddress: string;
  createdAt: string;
  updatedAt: string;
  new: boolean;
  featured: boolean;
  submitted_by: string;
  archived: boolean;
  resolvedBy: string;
  restricted: boolean;
  groupItemTitle: string;
  groupItemThreshold: string;
  questionID: string;
  enableOrderBook: boolean;
  orderPriceMinTickSize: number;
  orderMinSize: number;
  volumeNum: number;
  liquidityNum: number;
  endDateIso: string;
  startDateIso: string;
  hasReviewedDates: boolean;
  volume24hr: number;
  clobTokenIds: string[];
  umaBond: string;
  umaReward: string;
  volume24hrClob: number;
  volumeClob: number;
  liquidityClob: number;
  acceptingOrders: boolean;
  negRisk: boolean;
  _sync: boolean;
  events: {
    id: string;
    ticker: string;
    slug: string;
    title: string;
    description: string;
    startDate: string;
    creationDate: string;
    endDate: string;
    image: string;
    icon: string;
    active: boolean;
    closed: boolean;
    archived: boolean;
    new: boolean;
    featured: boolean;
    restricted: boolean;
    liquidity: number;
    volume: number;
    openInterest: number;
    createdAt: string;
    updatedAt: string;
    competitive: number;
    volume24hr: number;
    enableOrderBook: boolean;
    liquidityClob: number;
    _sync: boolean;
    commentCount: number;
    cyom: boolean;
    showAllOutcomes: boolean;
    showMarketImages: boolean;
    enableNegRisk: boolean;
    automaticallyActive: boolean;
    negRiskAugmented: boolean;
  }[];
  ready: boolean;
  funded: boolean;
  acceptingOrdersTimestamp: string;
  cyom: boolean;
  competitive: number;
  pagerDutyNotificationEnabled: boolean;
  approved: boolean;
  clobRewards: {
    id: string;
    conditionId: string;
    assetAddress: string;
    rewardsAmount: number;
    rewardsDailyRate: number;
    startDate: string;
    endDate: string;
  }[];
  rewardsMinSize: number;
  rewardsMaxSpread: number;
  spread: number;
  lastTradePrice: number;
  bestBid: number;
  bestAsk: number;
  automaticallyActive: boolean;
  clearBookOnStart: boolean;
  manualActivation: boolean;
  negRiskOther: boolean;
  tokens: {
    token_id: string;
    outcome: string;
    price: number;
  }[];
};

export type HookMarkets = {
  markets: (Market & { cost: string; comboMarketName: string })[] | undefined;
  isLoading: boolean;
  isError: boolean;
  mutate: () => void;
};

const fetcher = (q: any) => axios.get(q).then((d) => d.data);

export const useUserMarkets = (user: string): HookMarkets => {
  console.log(user);
  // Hooks
  const { web3auth } = useWeb3();
  if (!web3auth || !web3auth.provider) {
    console.error('Web3Auth provider not initialized');
  }

  // Polymarket API
  const { data, error, mutate } = useSWR<{
    markets: { [name: string]: Market[] };
  }>(`/api/users?user=${user}`, fetcher);

  // Read Market
  const read = async () => {
    const ethersProvider = new ethers.BrowserProvider(web3auth?.provider!);
    const signer = await ethersProvider.getSigner();
  };

  return {
    markets: data?.markets ?? undefined,
    isLoading: !error && !data,
    isError: Boolean(error),
    mutate,
  };
};
