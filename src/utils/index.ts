import { getAddress } from '@ethersproject/address';
import { BigNumber } from '@ethersproject/bignumber';
import { AddressZero } from '@ethersproject/constants';
import { Contract } from '@ethersproject/contracts';
import { JsonRpcSigner, TransactionResponse, Web3Provider } from '@ethersproject/providers';
import RadioShackRouterABI from '../constants/abis/radioshackRouter.json';
import RadioShackRouterSupportingFeesABI from '../constants/abis/radioshackRouterSupportingFees.json';
import {
  ALL_CHAINS,
  CETH,
  CHAINS,
  Chain,
  ChainId,
  Currency,
  CurrencyAmount,
  Fraction,
  JSBI,
  Percent,
  Token,
  Trade,
  currencyEquals,
} from '@radioshackswap/sdk2';
import { ROUTER_ADDRESS, ROUTER_DAAS_ADDRESS, ZERO_ADDRESS } from '../constants';
import { TokenAddressMap } from '../state/plists/hooks';
import { wait } from './retry';

// returns the checksummed address if the address is valid, otherwise returns false
export function isAddress(value: any): string | false {
  try {
    return getAddress(value);
  } catch {
    return false;
  }
}

export function isDummyAddress(value: any): string | false {
  return value;
}

export const isAddressMapping: { [chainId in ChainId]: (value: any) => string | false } = {
  [ChainId.MAINNET]: isAddress,
  [ChainId.AVALANCHE]: isAddress,
};

const ETHERSCAN_PREFIXES: { [chainId in ChainId]: string } = {
  1: CHAINS[ChainId.MAINNET].blockExplorerUrls?.[0] || '',
  43114: CHAINS[ChainId.AVALANCHE].blockExplorerUrls?.[0] || '',
};

const transactionPath: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: 'tx',
  [ChainId.AVALANCHE]: 'tx',
};

const addressPath: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: 'address',
  [ChainId.AVALANCHE]: 'address',
};

const blockPath: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: 'block',
  [ChainId.AVALANCHE]: 'block',
};

const tokenPath: { [chainId in ChainId]: string } = {
  [ChainId.MAINNET]: 'token',
  [ChainId.AVALANCHE]: 'token',
};

export function getEtherscanLink(
  chainId: ChainId,
  data: string,
  type: 'transaction' | 'token' | 'address' | 'block',
): string {
  const prefix = `${ETHERSCAN_PREFIXES[chainId] || ETHERSCAN_PREFIXES[43114]}`;

  switch (type) {
    case 'transaction': {
      return `${prefix}/${transactionPath[chainId]}/${data}`;
    }
    case 'token': {
      return `${prefix}/${tokenPath[chainId]}/${data}`;
    }
    case 'block': {
      return `${prefix}/${blockPath[chainId]}/${data}`;
    }
    case 'address':
    default: {
      return `${prefix}/${addressPath[chainId]}/${data}`;
    }
  }
}

// shorten the checksummed version of the input address to have 0x + 4 characters at start and end
export function shortenAddress(address: string, chainId: ChainId = ChainId.AVALANCHE, chars = 4): string {
  const parsed = isEvmChain(chainId) ? isAddress(address) : address;
  if (!parsed) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }
  return `${parsed.substring(0, chars)}...${parsed.substring(parsed.length - chars)}`;
}

// add 10%
export function calculateGasMargin(value: BigNumber): BigNumber {
  return value.mul(BigNumber.from(10000).add(BigNumber.from(1000))).div(BigNumber.from(10000));
}

// converts a basis points value to a sdk percent
export function basisPointsToPercent(num: number): Percent {
  return new Percent(JSBI.BigInt(num), JSBI.BigInt(10000));
}

// account is not optional
export function getSigner(library: Web3Provider, account: string): JsonRpcSigner {
  return library?.getSigner(account).connectUnchecked();
}

// account is optional
export function getProviderOrSigner(library: Web3Provider, account?: string): Web3Provider | JsonRpcSigner {
  return account ? getSigner(library, account) : library;
}

// account is optional
export function getContract(address: string, ABI: any, library: Web3Provider, account?: string): Contract | null {
  if (!isAddress(address) || address === AddressZero) {
    return null;
  }

  return new Contract(address, ABI, getProviderOrSigner(library, account) as any);
}

// account is optional
export function getRouterContract(chainId: ChainId, library: Web3Provider, account?: string): Contract | null {
  return getContract(ROUTER_ADDRESS[chainId], RadioShackRouterABI, library, account);
}
export function getRouterContractDaaS(chainId: ChainId, library: Web3Provider, account?: string): Contract | null {
  return getContract(ROUTER_DAAS_ADDRESS[chainId], RadioShackRouterSupportingFeesABI, library, account);
}

export function isTokenOnList(defaultTokens: TokenAddressMap, chainId: ChainId, currency?: Currency): boolean {
  if (chainId && currency === CETH[chainId]) return true;
  return Boolean(currency instanceof Token && defaultTokens[currency.chainId]?.[currency.address]);
}

/**
 * Returns true if the trade requires a confirmation of details before we can submit it
 * @param tradeA trade A
 * @param tradeB trade B
 */
export function tradeMeaningfullyDiffers(tradeA: Trade, tradeB: Trade): boolean {
  return (
    tradeA.tradeType !== tradeB.tradeType ||
    !currencyEquals(tradeA.inputAmount.currency, tradeB.inputAmount.currency) ||
    !tradeA.inputAmount.equalTo(tradeB.inputAmount) ||
    !currencyEquals(tradeA.outputAmount.currency, tradeB.outputAmount.currency) ||
    !tradeA.outputAmount.equalTo(tradeB.outputAmount)
  );
}

export function getChainByNumber(chainId: ChainId | number): Chain | undefined {
  return ALL_CHAINS.find((chain) => chain.chain_id === chainId);
}

export function calculateSlippageAmount(value: CurrencyAmount, slippage: number): [JSBI, JSBI] {
  if (slippage < 0 || slippage > 10000) {
    throw Error(`Unexpected slippage value: ${slippage}`);
  }
  return [
    JSBI.divide(JSBI.multiply(value.raw, JSBI.BigInt(10000 - slippage)), JSBI.BigInt(10000)),
    JSBI.divide(JSBI.multiply(value.raw, JSBI.BigInt(10000 + slippage)), JSBI.BigInt(10000)),
  ];
}

// https://github.com/ethers-io/ethers.js/issues/945#issuecomment-1074683436
// wait for transaction confirmation or set timeout
export async function waitForTransaction(
  tx: TransactionResponse,
  confirmations?: number,
  timeout = 10000, // 10 seconds
) {
  await Promise.race([
    tx.wait(confirmations),
    (async () => {
      await wait(timeout);
    })(),
  ]);
}

export function getBuyUrl(token: Token, chainId?: ChainId): string {
  const origin = window.location.origin;
  const path = `/#/swap?inputCurrency=${chainId ? CETH[chainId].symbol : ZERO_ADDRESS}&outputCurrency=${
    token.address
  }`;
  return origin.includes('localhost') || origin.includes('radioshack.org') ? path : `app.radioshack.org${path}`;
}

// some browsers do not support scrollIntoView
// https://stackoverflow.com/a/50411076/18268694
export function scrollElementIntoView(element: HTMLElement | null, behavior?: 'smooth' | 'auto') {
  if (element) {
    const scrollTop = window.scrollY || element.scrollTop;

    const finalOffset = element.getBoundingClientRect().top + scrollTop;

    window.parent.scrollTo({
      top: finalOffset,
      behavior: behavior || 'auto',
    });
  }
}

export function isEvmChain(chainId: ChainId = 43114): boolean {
  if (CHAINS[chainId]?.evm) {
    return true;
  }
  return false;
}

// http://jsfiddle.net/5QrhQ/5/
export function decimalToFraction(number: number): Fraction {
  const gcd = (a, b) => {
    if (b < 0.0000001) return a; // Since there is a limited precision we need to limit the value.

    return gcd(b, Math.floor(a % b)); // Discard any fractions due to limitations in precision.
  };

  const len = number.toString().length - 2;

  let denominator = Math.pow(10, len);
  let numerator = number * denominator;

  const divisor = gcd(numerator, denominator);

  numerator /= divisor;
  denominator /= divisor;
  return new Fraction(Math.floor(numerator).toString(), Math.floor(denominator).toString());
}

export function capitalizeWord(word = '') {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}
