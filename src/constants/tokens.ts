import { CHAINS, ChainId, Token } from '@radioshackswap/sdk2';
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export const RADIO: { [chainId in ChainId]: Token } = {
  [ChainId.MAINNET]: new Token(
    ChainId.MAINNET,
    CHAINS[ChainId.MAINNET].contracts!.radio,
    18,
    CHAINS[ChainId.MAINNET].radio_symbol,
    'RadioShack Token',
  ),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    CHAINS[ChainId.AVALANCHE].contracts!.radio,
    18,
    CHAINS[ChainId.AVALANCHE].radio_symbol,
    'RadioShack Token',
  ),
};

export const DAIe: { [chainId in ChainId]: Token } = {
  [ChainId.MAINNET]: new Token(
    ChainId.MAINNET,
    '0x6b175474e89094c44da98b954eedeac495271d0f',
    18,
    'DAI',
    'Dai Stablecoin',
  ),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0xd586E7F844cEa2F87f50152665BCbc2C279D8d70',
    18,
    'DAI.e',
    'Dai Stablecoin',
  ),
};

export const USDCe: { [chainId in ChainId]: Token } = {
  [ChainId.MAINNET]: new Token(
    ChainId.MAINNET,
    '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    6,
    'USDC',
    'USD Coin',
  ),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664',
    6,
    'USDC.e',
    'USD Coin',
  ),
};

export const USDC: { [chainId in ChainId]: Token } = {
  [ChainId.MAINNET]: new Token(
    ChainId.MAINNET,
    '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    6,
    'USDC',
    'USD Coin',
  ),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E',
    6,
    'USDC',
    'USD Coin',
  ),
};

export const USDTe: { [chainId in ChainId]: Token } = {
  [ChainId.MAINNET]: new Token(
    ChainId.MAINNET,
    '0xdac17f958d2ee523a2206206994597c13d831ec7',
    6,
    'USDT',
    'Tether USD',
  ),
  [ChainId.AVALANCHE]: new Token(
    ChainId.AVALANCHE,
    '0xc7198437980c041c805A1EDcbA50c1Ce5db95118',
    6,
    'USDT.e',
    'Tether USD',
  ),
};
