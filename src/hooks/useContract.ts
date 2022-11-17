import { Contract } from '@ethersproject/contracts';
import RadioShackPairABI from '../constants/abis/radioshackPair.json';
import ERC20ABI from '../constants/abis/erc20.json';
import { WETH } from '@radioshackswap/sdk2';
import { useMemo } from 'react';
import { ZERO_ADDRESS } from 'src/constants';
import { ERC20_BYTES32_ABI } from 'src/constants/abis/erc20';
import ERC20_ABI from 'src/constants/abis/erc20.json';
import { REWARDER_VIA_MULTIPLIER_INTERFACE } from 'src/constants/abis/rewarderViaMultiplier';
import WETH_ABI from 'src/constants/abis/weth.json';
import { MULTICALL_ABI, MULTICALL_NETWORKS } from 'src/constants/multicall';
import { RADIO } from 'src/constants/tokens';
import { useChainId, useLibrary, useRadioShackWeb3 } from 'src/hooks';
import { getContract } from 'src/utils';

// returns null on errors
function useContract(address: string | undefined, ABI: any, withSignerIfPossible = true): Contract | null {
  const { account } = useRadioShackWeb3();
  const { library } = useLibrary();

  return useMemo(() => {
    if (!address || address === ZERO_ADDRESS || !ABI || !library) return null;
    try {
      return getContract(address, ABI, library, withSignerIfPossible && account ? account : undefined);
    } catch (error) {
      console.error('Failed to get contract', error);
      return null;
    }
  }, [address, ABI, library, withSignerIfPossible, account]);
}

export function useTokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(tokenAddress, ERC20_ABI, withSignerIfPossible);
}

export function useBytes32TokenContract(tokenAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(tokenAddress, ERC20_BYTES32_ABI, withSignerIfPossible);
}

export function useWETHContract(withSignerIfPossible?: boolean): Contract | null {
  const { chainId } = useRadioShackWeb3();
  return useContract(chainId ? WETH[chainId]?.address : undefined, WETH_ABI, withSignerIfPossible);
}

export function useMulticallContract(): Contract | null {
  const { chainId } = useRadioShackWeb3();
  return useContract(chainId && MULTICALL_NETWORKS[chainId], MULTICALL_ABI, false);
}

export function useRewardViaMultiplierContract(address?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(address, REWARDER_VIA_MULTIPLIER_INTERFACE, withSignerIfPossible);
}

export function usePairContract(pairAddress?: string, withSignerIfPossible?: boolean): Contract | null {
  return useContract(pairAddress, RadioShackPairABI, withSignerIfPossible);
}

export function useRadioContract(): Contract | null {
  const chainId = useChainId();
  return useContract(RADIO[chainId].address, ERC20ABI, true);
}
