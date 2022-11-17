import { CETH, ChainId, Currency, CurrencyAmount, Token, TokenAmount, WETH } from '@radioshackswap/sdk2';
import { NativeCurrency as UniCurrency, Token as UniToken } from '@uniswap/sdk-core';

export function wrappedCurrency(currency: Currency | undefined, chainId: ChainId | undefined): Token | undefined {
  return chainId && currency === CETH[chainId] ? WETH[chainId] : currency instanceof Token ? currency : undefined;
}

export function wrappedCurrencyAmount(
  currencyAmount: CurrencyAmount | undefined,
  chainId: ChainId | undefined,
): TokenAmount | undefined {
  const token = currencyAmount && chainId ? wrappedCurrency(currencyAmount.currency, chainId) : undefined;
  return token && currencyAmount ? new TokenAmount(token, currencyAmount.raw) : undefined;
}

function convertToRadioShackToken(token: UniToken): Token {
  return new Token(token.chainId, token.address, token.decimals, token?.symbol, token?.name);
}

export function wrappedGelatoCurrency(
  currency: UniCurrency | UniToken,
  chainId: ChainId | undefined,
): Token | undefined {
  return chainId && !currency?.isToken
    ? WETH[chainId]
    : currency.isToken
    ? convertToRadioShackToken(currency)
    : undefined;
}

export function unwrappedToken(token: Token, chainId: ChainId): Currency | Token {
  if (token?.equals?.(WETH[token.chainId])) return CETH[chainId];
  return token;
}
