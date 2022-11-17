import { ChainId } from '@radioshackswap/sdk2';
import { useTokenAllowance } from './Allowances';
import { usePairs } from './Reserves';
import {
  useEvmPairTotalSupply,
  useTotalSupply,
} from './TotalSupply';

export type UsePairsHookType = {
  [chainId in ChainId]: typeof usePairs;
};

export const usePairsHook: UsePairsHookType = {
  [ChainId.MAINNET]: usePairs,
  [ChainId.AVALANCHE]: usePairs,
};

export type UseTokenAllowanceHookType = {
  [chainId in ChainId]: typeof useTokenAllowance;
};

export const useTokenAllowanceHook: UseTokenAllowanceHookType = {
  [ChainId.MAINNET]: useTokenAllowance,
  [ChainId.AVALANCHE]: useTokenAllowance,
};

export type UseTotalSupplyHookType = {
  [chainId in ChainId]: typeof useTotalSupply;
};

/**
 * this hook is used to fetch total supply of given token based on chain
 * @param pair pair object
 * @returns total supply in form of TokenAmount or undefined
 */
export const useTotalSupplyHook: UseTotalSupplyHookType = {
  [ChainId.MAINNET]: useTotalSupply,
  [ChainId.AVALANCHE]: useTotalSupply,
};

export type UsePairTotalSupplyHookType = {
  [chainId in ChainId]: typeof useEvmPairTotalSupply;
};

/**
 * this hook is used to fetch total supply of given pair based on chain
 * @param pair pair object
 * @returns total supply in form of TokenAmount or undefined
 */
export const usePairTotalSupplyHook: UsePairTotalSupplyHookType = {
  [ChainId.MAINNET]: useEvmPairTotalSupply,
  [ChainId.AVALANCHE]: useEvmPairTotalSupply,
};
