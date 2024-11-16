import axios from 'axios';
import useSWR from 'swr';

export type HookPositions = {
  positions: any[] | undefined;
  isLoading: boolean;
  isError: boolean;
  mutate: () => void;
};

const fetcher = (q: any) => axios.get(q).then((d) => d.data);

export const usePositions = (): HookPositions => {
  const { data, error, mutate } = useSWR<{
    data: any[];
  }>(`/api/positions`, fetcher);

  return {
    positions: data?.data ?? undefined,
    isLoading: !error && !data,
    isError: Boolean(error),
    mutate,
  };
};
