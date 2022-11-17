import { ChainId } from '@radioshackswap/sdk2';
import { useToken, useTokens } from './Tokens';
import {
  useApproveCallback,
  useApproveCallbackFromNearTrade,
  useApproveCallbackFromTrade,
  useNearApproveCallback,
} from './useApproveCallback';
import { useSwapCallback } from './useSwapCallback';
import { useNearUSDCPrice, useUSDCPrice } from './useUSDCPrice';
import { useWrapCallback } from './useWrapCallback';

export type UseWrapCallbackHookType = {
  [chainId in ChainId]: typeof useWrapCallback;
};

export const useWrapCallbackHook: UseWrapCallbackHookType = {
  [ChainId.MAINNET]: useWrapCallback,
  [ChainId.AVALANCHE]: useWrapCallback,
};

export type UseTokenHookType = {
  [chainId in ChainId]: typeof useToken;
};

export const useTokenHook: UseTokenHookType = {
  [ChainId.MAINNET]: useToken,
  [ChainId.AVALANCHE]: useToken,
};

export type UseApproveCallbackFromTradeHookType = {
  [chainId in ChainId]:
    | typeof useApproveCallbackFromTrade
    | typeof useApproveCallbackFromNearTrade
};

export const useApproveCallbackFromTradeHook: UseApproveCallbackFromTradeHookType = {
  [ChainId.MAINNET]: useApproveCallbackFromTrade,
  [ChainId.AVALANCHE]: useApproveCallbackFromTrade,
};

export type UseSwapCallbackHookType = {
  [chainId in ChainId]: typeof useSwapCallback;
};

export const useSwapCallbackHook: UseSwapCallbackHookType = {
  [ChainId.MAINNET]: useSwapCallback,
  [ChainId.AVALANCHE]: useSwapCallback,
};

export type UseApproveCallbackHookType = {
  [chainId in ChainId]: typeof useApproveCallback | typeof useNearApproveCallback;
};

export const useApproveCallbackHook: UseApproveCallbackHookType = {
  [ChainId.MAINNET]: useApproveCallback,
  [ChainId.AVALANCHE]: useApproveCallback,
};

export type UseUSDCPriceHookType = {
  [chainId in ChainId]: typeof useUSDCPrice | typeof useNearUSDCPrice;
};

export const useUSDCPriceHook: UseUSDCPriceHookType = {
  [ChainId.MAINNET]: useUSDCPrice,
  [ChainId.AVALANCHE]: useUSDCPrice,
};

export type UseTokensHookType = {
  [chainId in ChainId]: typeof useTokens;
};

export const useTokensHook: UseTokensHookType = {
  [ChainId.MAINNET]: useTokens,
  [ChainId.AVALANCHE]: useTokens,
};
