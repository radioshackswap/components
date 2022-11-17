import { ChainId } from '@radioshackswap/sdk2';
import {
  useAddLiquidity,
  useDummyCreatePair,
  useDummyGetUserLP,
  useETHBalances,
  useGetUserLP,
  useRemoveLiquidity,
  useTokenBalance,
  useTokenBalances,
} from './hooks';

export type UseTokenBalancesHookType = {
  [chainId in ChainId]: typeof useTokenBalances;
};

export const useTokenBalancesHook: UseTokenBalancesHookType = {
  [ChainId.MAINNET]: useTokenBalances,
  [ChainId.AVALANCHE]: useTokenBalances,
};

export type UseTokenBalanceHookType = {
  [chainId in ChainId]: typeof useTokenBalance;
};

export const useTokenBalanceHook: UseTokenBalanceHookType = {
  [ChainId.MAINNET]: useTokenBalance,
  [ChainId.AVALANCHE]: useTokenBalance,
};

export type UseAccountBalanceHookType = {
  [chainId in ChainId]: typeof useETHBalances;
};

export const useAccountBalanceHook: UseAccountBalanceHookType = {
  [ChainId.MAINNET]: useETHBalances,
  [ChainId.AVALANCHE]: useETHBalances,
};

export type UseAddLiquidityHookType = {
  [chainId in ChainId]: typeof useAddLiquidity;
};

export const useAddLiquidityHook: UseAddLiquidityHookType = {
  [ChainId.MAINNET]: useAddLiquidity,
  [ChainId.AVALANCHE]: useAddLiquidity,
};

export type UseRemoveLiquidityHookType = {
  [chainId in ChainId]: typeof useRemoveLiquidity;
};

export const useRemoveLiquidityHook: UseRemoveLiquidityHookType = {
  [ChainId.MAINNET]: useRemoveLiquidity,
  [ChainId.AVALANCHE]: useRemoveLiquidity,
};

export type UseGetUserLPHookType = {
  [chainId in ChainId]: typeof useGetUserLP | typeof useDummyGetUserLP;
};

export const useGetUserLPHook: UseGetUserLPHookType = {
  [ChainId.MAINNET]: useGetUserLP,
  [ChainId.AVALANCHE]: useGetUserLP,
};

export type UseCreatePairHookType = {
  [chainId in ChainId]: typeof useDummyCreatePair;
};

/**
 * Create Pair related hooks
 * Basically takes 2 tokens to create a pair
 */
export const useCreatePairHook: UseCreatePairHookType = {
  [ChainId.MAINNET]: useDummyCreatePair,
  [ChainId.AVALANCHE]: useDummyCreatePair,
};
