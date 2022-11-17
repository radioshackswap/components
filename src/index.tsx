import { Web3Provider } from '@ethersproject/providers';
import { ChainId } from '@radioshackswap/sdk2';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';
import SelectTokenDrawer from 'src/components/SwapWidget/SelectTokenDrawer';
import { usePair } from 'src/data/Reserves';
import { useTotalSupply } from 'src/data/TotalSupply';
import { useTotalSupplyHook } from 'src/data/multiChainsHooks';
import { RadioShackWeb3Provider, useLibrary } from 'src/hooks';
import { useAllTokens } from 'src/hooks/Tokens';
import { useUSDCPriceHook } from 'src/hooks/multiChainsHooks';
import useParsedQueryString from 'src/hooks/useParsedQueryString';
import { useUSDCPrice } from 'src/hooks/useUSDCPrice';
import ApplicationUpdater from 'src/state/papplication/updater';
import ListsUpdater from 'src/state/plists/updater';
import MulticallUpdater from 'src/state/pmulticall/updater';
import {
  LimitOrderInfo,
  useDerivedSwapInfo,
  useGelatoLimitOrderDetail,
  useGelatoLimitOrderList,
  useSwapActionHandlers,
} from 'src/state/pswap/hooks';
import { useAllTransactions, useAllTransactionsClearer } from 'src/state/ptransactions/hooks';
import TransactionUpdater from 'src/state/ptransactions/updater';
import { useGetUserLP, useTokenBalance } from 'src/state/pwallet/hooks';
import { useAccountBalanceHook, useTokenBalanceHook } from 'src/state/pwallet/multiChainsHooks';
import { getEtherscanLink, isEvmChain, shortenAddress } from 'src/utils';
import { wrappedCurrency } from 'src/utils/wrappedCurrency';
import i18n, { availableLanguages } from './i18n';
import store, { RADIOSHACK_PERSISTED_KEYS, StoreContext, radioshackReducers } from './state';
import SwapUpdater from './state/pswap/updater';
import { default as ThemeProvider } from './theme';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 1000 * 60,
      refetchOnWindowFocus: false,
    },
  },
});

export function RadioShackProvider({
  chainId = ChainId.AVALANCHE,
  library,
  children,
  account,
  theme,
}: {
  chainId: number | undefined;
  library: any | undefined;
  account: string | undefined;
  children?: React.ReactNode;
  theme?: any;
}) {
  const ethersLibrary = library && !library?._isProvider ? new Web3Provider(library) : library;

  return (
    <Provider store={store} context={StoreContext}>
      <RadioShackWeb3Provider chainId={chainId} library={library} account={account}>
        <ThemeProvider theme={theme}>
          <QueryClientProvider client={queryClient}>
            <ListsUpdater />
            <ApplicationUpdater />
            <MulticallUpdater />
            <TransactionUpdater />
            <SwapUpdater />
            {children}
          </QueryClientProvider>
        </ThemeProvider>
      </RadioShackWeb3Provider>
    </Provider>
  );
}

export * from './constants';
export * from './connectors';
export * from './components';
export * from './state/papplication/hooks';
export * from './state/papplication/actions';

export * from '@gelatonetwork/limit-orders-react';
export type {
  LimitOrderInfo,
};

// components
export { SelectTokenDrawer };

// galeto hooks
export { useGelatoLimitOrderDetail, useGelatoLimitOrderList };

// hooks
export {
  useDerivedSwapInfo,
  useUSDCPrice,
  useAllTokens,
  usePair,
  useSwapActionHandlers,
  useLibrary,
  useAllTransactions,
  useAllTransactionsClearer,
  useAccountBalanceHook,
  useTranslation,
  useGetUserLP,
  useTotalSupplyHook,
  useTotalSupply,
  useTokenBalanceHook,
  useTokenBalance,
  useUSDCPriceHook,
  useParsedQueryString,
};

// misc
export {
  radioshackReducers,
  RADIOSHACK_PERSISTED_KEYS,
  wrappedCurrency,
  i18n,
  availableLanguages,
  Trans,
  getEtherscanLink,
  shortenAddress,
};
