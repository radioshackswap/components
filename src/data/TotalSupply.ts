import { BigNumber } from '@ethersproject/bignumber';
import { Pair, Token, TokenAmount } from '@radioshackswap/sdk2';
import { useTokenContract } from '../hooks/useContract';
import { useSingleCallResult } from '../state/pmulticall/hooks';

// returns undefined if input token is undefined, or fails to get token contract,
// or contract total supply cannot be fetched
export function useTotalSupply(token?: Token): TokenAmount | undefined {
  const contract = useTokenContract(token?.address, false);

  const totalSupply: BigNumber = useSingleCallResult(contract, 'totalSupply')?.result?.[0];

  return token && totalSupply ? new TokenAmount(token, totalSupply.toString()) : undefined;
}

/**
 * this hook is used to fetch total supply of given EVM pair
 * @param pair pair object
 * @returns total supply in form of TokenAmount or undefined
 */
export function useEvmPairTotalSupply(pair?: Pair): TokenAmount | undefined {
  const token = pair?.liquidityToken;
  return useTotalSupply(token);
}
