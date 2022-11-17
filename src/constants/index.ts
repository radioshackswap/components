/* eslint-disable max-lines */
import { CHAINS, ChainId, Fraction, JSBI, Percent, StakingType, Token, WETH } from '@radioshackswap/sdk2';
import { AbstractConnector } from '@web3-react/abstract-connector';
import BN from 'bn.js';
import arrowRightIcon from 'src/assets/images/arrow-right.svg';
import bitKeepIcon from 'src/assets/images/bitkeep.svg';
import coinbaseWalletIcon from 'src/assets/images/coinbaseWalletIcon.png';
import gnosisSafeIcon from 'src/assets/images/gnosis_safe.png';
import metamaskIcon from 'src/assets/images/metamask.png';
import rabbyIcon from 'src/assets/images/rabby.svg';
import talismanIcon from 'src/assets/images/talisman.svg';
import venlyIcon from 'src/assets/images/venly.png';
import walletConnectIcon from 'src/assets/images/walletConnectIcon.svg';
import xDefiIcon from 'src/assets/images/xDefi.png';
import {
  bitKeep,
  gnosisSafe,
  injected,
  talisman,
  venly,
  walletconnect,
  walletlink,
  xDefi,
} from '../connectors';
import { CommonEVMProvider } from '../connectors/WalletProviders';
import { DAIe, RADIO, USDC, USDCe, USDTe } from './tokens';

export const BIG_INT_ZERO = JSBI.BigInt(0);
export const BIG_INT_TWO = JSBI.BigInt(2);
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
export const NATIVE = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';
export const BIG_INT_SECONDS_IN_WEEK = JSBI.BigInt(60 * 60 * 24 * 7);
export const ONE_TOKEN = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(18));

export const ROUTER_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: CHAINS[ChainId.MAINNET].contracts!.router,
  [ChainId.AVALANCHE]: CHAINS[ChainId.AVALANCHE].contracts!.router,
};

export const ROUTER_DAAS_ADDRESS: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: CHAINS[ChainId.MAINNET]?.contracts?.router_daas ?? ZERO_ADDRESS,
  [ChainId.AVALANCHE]: CHAINS[ChainId.AVALANCHE]?.contracts?.router_daas ?? ZERO_ADDRESS,
};

// a list of tokens by chain
type ChainTokenList = {
  readonly [chainId in ChainId]: Token[];
};

/**
 * Some tokens can only be swapped via certain pairs, so we override the list of bases that are considered for these
 * tokens.
 */
export const CUSTOM_BASES: { [chainId in ChainId]?: { [tokenAddress: string]: Token[] } } = {
  [ChainId.AVALANCHE]: {},
};

export const NetworkContextName = 'NETWORK';

// default allowed slippage, in bips
export const INITIAL_ALLOWED_SLIPPAGE = 50;
// 10 minutes, denominated in seconds
export const DEFAULT_DEADLINE_FROM_NOW = '600';

// these tokens can be directly linked to (via url params) in the swap page without prompting a warning
export const TRUSTED_TOKEN_ADDRESSES: { readonly [chainId in ChainId]: string[] } = {
  [ChainId.MAINNET]: [WETH[ChainId.MAINNET].address, RADIO[ChainId.MAINNET].address],
  [ChainId.AVALANCHE]: [WETH[ChainId.AVALANCHE].address, RADIO[ChainId.AVALANCHE].address],
};

export const SWAP_DEFAULT_CURRENCY = {
  [ChainId.MAINNET]: {
    inputCurrency: 'ETH',
    outputCurrency: USDC[ChainId.MAINNET].address,
  },
  [ChainId.AVALANCHE]: {
    inputCurrency: 'AVAX',
    outputCurrency: USDC[ChainId.AVALANCHE].address,
  },
};

// used to construct intermediary pairs for trading
export const BASES_TO_CHECK_TRADES_AGAINST: ChainTokenList = {
  [ChainId.MAINNET]: [
    WETH[ChainId.MAINNET],
    RADIO[ChainId.MAINNET],
    USDTe[ChainId.MAINNET],
    DAIe[ChainId.MAINNET],
    USDCe[ChainId.MAINNET],
    USDC[ChainId.MAINNET],
  ],
  [ChainId.AVALANCHE]: [
    WETH[ChainId.AVALANCHE],
    RADIO[ChainId.AVALANCHE],
    USDTe[ChainId.AVALANCHE],
    DAIe[ChainId.AVALANCHE],
    USDCe[ChainId.AVALANCHE],
    USDC[ChainId.AVALANCHE],
  ],
};

// one basis point
export const ONE_BIPS = new Percent(JSBI.BigInt(1), JSBI.BigInt(10000));
export const BIPS_BASE = JSBI.BigInt(10000);

// used for warning states
export const ALLOWED_PRICE_IMPACT_LOW: Percent = new Percent(JSBI.BigInt(100), BIPS_BASE); // 1%
export const ALLOWED_PRICE_IMPACT_MEDIUM: Percent = new Percent(JSBI.BigInt(300), BIPS_BASE); // 3%
export const ALLOWED_PRICE_IMPACT_HIGH: Percent = new Percent(JSBI.BigInt(500), BIPS_BASE); // 5%
// if the price slippage exceeds this number, force the user to type 'confirm' to execute
export const PRICE_IMPACT_WITHOUT_FEE_CONFIRM_MIN: Percent = new Percent(JSBI.BigInt(1000), BIPS_BASE); // 10%
// for non expert mode disable swaps above this
export const BLOCKED_PRICE_IMPACT_NON_EXPERT: Percent = new Percent(JSBI.BigInt(1500), BIPS_BASE); // 15%

// used to ensure the user doesn't send so much ETH so they end up with <.01
export const MIN_ETH: JSBI = JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(16)); // .01 ETH

export const RADIOSHACK_TOKENS_REPO_RAW_BASE_URL = `https://raw.githubusercontent.com/radioshackswap/tokens`;

export type LogoSize = 24 | 48;

export const ANALYTICS_PAGE = 'https://info43114.radioshack.org';
export const RADIOSHACK_API_BASE_URL = `https://api.radioshack.org`;
export const TIMEFRAME = [
  {
    description: 'DAY',
    label: '1D',
    interval: 3600,
    momentIdentifier: 'day',
    days: '1',
  },
  {
    description: 'WEEK',
    label: '1W',
    interval: 86400,
    momentIdentifier: 'week',
    days: '7',
  },
  {
    description: 'MONTH',
    label: '1M',
    interval: 604800,
    momentIdentifier: 'month',
    days: '30',
  },
  {
    description: 'YEAR',
    label: '1Y',
    interval: 2629746,
    momentIdentifier: 'year',
    days: '365',
  },
  {
    description: 'ALL',
    label: 'ALL',
    interval: 2629746,
    momentIdentifier: '',
    days: 'max',
  },
];

export const SUBGRAPH_BASE_URL = `https://api.thegraph.com/subgraphs/name/radioshackcreator`;

export const LANDING_PAGE = 'https://app.radioshack.org';

export const SUPPORTED_WALLETS: { [key: string]: WalletInfo } = {
  INJECTED: {
    connector: injected,
    name: 'Injected',
    iconName: arrowRightIcon,
    description: 'Injected web3 provider.',
    href: null,
    color: '#010101',
    primary: true,
    isEVM: true,
  },
  METAMASK: {
    connector: injected,
    name: 'MetaMask',
    iconName: metamaskIcon,
    description: 'Easy-to-use browser extension.',
    href: null,
    color: '#E8831D',
    isEVM: true,
  },
  GNOSISSAFE: {
    connector: gnosisSafe,
    name: 'Gnosis Safe',
    iconName: gnosisSafeIcon,
    description: 'Gnosis Safe Multisig Wallet.',
    href: null,
    color: '#010101',
    isEVM: true,
  },
  WALLET_LINK: {
    connector: walletlink,
    name: 'Coinbase Wallet',
    iconName: coinbaseWalletIcon,
    description: 'Use Coinbase Wallet app on mobile device',
    href: null,
    color: '#315CF5',
    isEVM: true,
  },
  WALLET_CONNECT: {
    connector: walletconnect,
    name: 'Wallet Connect',
    iconName: walletConnectIcon,
    description: 'Use Wallet Connect',
    href: null,
    color: '#315CF5',
    isEVM: true,
  },
  XDEFI: {
    connector: xDefi,
    name: 'XDEFI Wallet',
    iconName: xDefiIcon,
    description: window.xfi && window.xfi.ethereum ? 'Easy-to-use browser extension.' : 'Please Install',
    href: null,
    color: '#315CF5',
    isEVM: true,
  },
  RABBY: {
    connector: injected,
    name: 'Rabby Wallet',
    iconName: rabbyIcon,
    description: 'Easy-to-use browser extension.',
    href: null,
    color: '#7a7cff',
    isEVM: true,
  },
  TALISMAN: {
    connector: talisman,
    name: 'Talisman',
    iconName: talismanIcon,
    description: 'Enter the Paraverse.',
    href: null,
    color: '#FF3D23',
    isEVM: true,
  },
  BITKEEP: {
    connector: bitKeep,
    name: 'BitKeep',
    iconName: bitKeepIcon,
    description: 'Easy-to-use browser extension.',
    href: null,
    color: '#7524f9',
    isEVM: true,
  },
  VENLY: {
    connector: venly,
    name: 'Venly Wallet',
    iconName: venlyIcon,
    description: 'Venly Wallet Connect',
    href: null,
    color: '#7735ea',
    primary: true,
    isEVM: true,
  },
};

export const PROVIDER_MAPPING: { [chainId in ChainId]: (provider: any) => any } = {
  [ChainId.MAINNET]: CommonEVMProvider,
  [ChainId.AVALANCHE]: CommonEVMProvider,
};

export const AVALANCHE_CHAIN_PARAMS = {
  chainId: '0xa86a', // A 0x-prefixed hexadecimal chainId
  chainName: 'Avalanche Mainnet C-Chain',
  nativeCurrency: {
    name: 'Avalanche',
    symbol: 'AVAX',
    decimals: 18,
  },
  rpcUrls: ['https://api.avax.network/ext/bc/C/rpc'],
  blockExplorerUrls: ['https://snowtrace.io//'],
};
export const IS_IN_IFRAME = window.parent !== window;

export interface WalletInfo {
  connector?: AbstractConnector | any;
  name: string;
  iconName: string;
  description: string;
  href: string | null;
  color: string;
  primary?: true;
  mobile?: true;
  mobileOnly?: true;
  isEVM?: boolean;
}
export const DIRECTUS_URL_NEWS = `https://radioshack.directus.app`;

export const COINGEKO_BASE_URL = `https://api.coingecko.com/api/v3`;
export const NEAR_API_BASE_URL = `https://testnet-indexer.ref-finance.com`;
// TODO: this needs to be based on chain id
export const HEDERA_API_BASE_URL = `https://testnet.mirrornode.hedera.com`;

export const OPEN_API_DEBANK = 'https://openapi.debank.com/v1/user';
export const ONE_YOCTO_NEAR = '0.000000000000000000000001';
export const NEAR_STORAGE_PER_TOKEN = '0.005';
export const NEAR_STORAGE_TO_REGISTER_WITH_FT = '0.1';
export const NEAR_MIN_DEPOSIT_PER_TOKEN = new BN('5000000000000000000000');
export const NEAR_MIN_DEPOSIT_PER_TOKEN_FARM = new BN('45000000000000000000000');
export const NEAR_ACCOUNT_MIN_STORAGE_AMOUNT = '0.005';
export const NEAR_LP_STORAGE_AMOUNT = '0.01';
export const ONLY_ZEROS = /^0*\.?0*$/;

const WETH_AND_RADIO_ONLY: ChainTokenList = {
  [ChainId.MAINNET]: [WETH[ChainId.MAINNET], RADIO[ChainId.MAINNET]],
  [ChainId.AVALANCHE]: [WETH[ChainId.AVALANCHE], RADIO[ChainId.AVALANCHE]],
};

// used to construct the list of all pairs we consider by default in the frontend
export const BASES_TO_TRACK_LIQUIDITY_FOR: ChainTokenList = {
  ...WETH_AND_RADIO_ONLY,
};

export const PINNED_PAIRS: { readonly [chainId in ChainId]?: [Token, Token][] } = {
  [ChainId.AVALANCHE]: [],
};

const getSarAddress = (chainId: ChainId) => {
  return CHAINS[chainId]?.contracts?.staking?.find((c) => c.type === StakingType.SAR_POSITIONS && c.active)?.address;
};

/* eslint-enable max-lines */

export enum SwapTypes {
  MARKET = 'MARKET',
  LIMIT = 'LIMIT',
}

export const ONE_FRACTION = new Fraction('1');

export const COINGECKO_CURRENCY_ID: { [chainId in ChainId]: string | undefined } = {
  [ChainId.MAINNET]: 'ethereum',
  [ChainId.AVALANCHE]: 'avalanche-2',
};
