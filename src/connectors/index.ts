import { Web3Provider } from '@ethersproject/providers';
import { SafeAppConnector } from '@gnosis.pm/safe-apps-web3-react';
import { ALL_CHAINS, ChainId } from '@radioshackswap/sdk2';
import { InjectedConnector } from '@radioshackswap/web3-react-injected-connector';
import { TalismanConnector } from '@talismn/web3react-v6-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { WalletLinkConnector } from '@web3-react/walletlink-connector';
import { BitKeepConnector } from './BitKeepConnector';
import { DefiConnector } from './DefiConnector';
import { HashConnector } from './HashConnector';
import { NearConnector } from './NearConnector';
import { NetworkConnector } from './NetworkConnector';
import { VenlyConnector } from './Venly';

export const SUPPORTED_EVM_CHAINS_ID: number[] = ALL_CHAINS.filter((chain) => chain.radioshack_is_live && chain.evm).map(
  (chain) => chain.chain_id ?? 43114,
);

const NETWORK_URL = 'https://api.avax.network/ext/bc/C/rpc';

export const NETWORK_CHAIN_ID: number = parseInt(process.env.REACT_APP_CHAIN_ID ?? '43114');

if (typeof NETWORK_URL === 'undefined') {
  throw new Error(`REACT_APP_NETWORK_URL must be a defined environment variable`);
}

export const network = new NetworkConnector({
  urls: { [NETWORK_CHAIN_ID]: NETWORK_URL },
  defaultChainId: NETWORK_CHAIN_ID,
});

let networkLibrary: Web3Provider | undefined;
export function getNetworkLibrary(): Web3Provider {
  networkLibrary = networkLibrary ?? new Web3Provider(network.provider as any);
  return networkLibrary;
}

export const injected = new InjectedConnector({
  supportedChainIds: SUPPORTED_EVM_CHAINS_ID,
});

export const talisman = new TalismanConnector({
  supportedChainIds: SUPPORTED_EVM_CHAINS_ID,
});

export const gnosisSafe = new SafeAppConnector({
  supportedChainIds: SUPPORTED_EVM_CHAINS_ID,
});

export const walletlink = new WalletLinkConnector({
  url: NETWORK_URL,
  supportedChainIds: SUPPORTED_EVM_CHAINS_ID,
  appName: 'RadioShack Swap',
  appLogoUrl: 'https://static.radioshack.org/images/tokens/RADIO.png',
});

export const walletconnect = new WalletConnectConnector({
  rpc: {
    43114: NETWORK_URL,
  },
  qrcode: true,
  bridge: 'https://bridge.walletconnect.org',
});

export const xDefi = new DefiConnector({
  supportedChainIds: [1, 43114, 11111, 16, 19],
});

export const bitKeep = new BitKeepConnector({
  supportedChainIds: SUPPORTED_EVM_CHAINS_ID,
});

export const venly = new VenlyConnector({
  supportedChainIds: SUPPORTED_EVM_CHAINS_ID,
});

export { NearConnector, HashConnector };
