import { MaxUint256 } from '@ethersproject/constants';
import { TransactionResponse } from '@ethersproject/providers';
import { useGelatoLimitOrdersLib } from '@gelatonetwork/limit-orders-react';
import { CETH, ChainId, CurrencyAmount, TokenAmount, Trade } from '@radioshackswap/sdk2';
import { useCallback, useMemo } from 'react';
import { ROUTER_ADDRESS, ROUTER_DAAS_ADDRESS, ZERO_ADDRESS } from 'src/constants';
import { useTokenAllowance } from 'src/data/Allowances';
import { Field } from 'src/state/pswap/actions';
import { useHasPendingApproval, useTransactionAdder } from 'src/state/ptransactions/hooks';
import { calculateGasMargin, waitForTransaction } from 'src/utils';
import { computeSlippageAdjustedAmounts } from '../utils/prices';
import { useTokenContract } from './useContract';
import { useChainId, useRadioShackWeb3 } from './index';

export enum ApprovalState {
  UNKNOWN,
  NOT_APPROVED,
  PENDING,
  APPROVED,
}

// returns a variable indicating the state of the approval and a function which approves if necessary or early returns
export function useApproveCallback(
  chainId: ChainId,
  amountToApprove?: CurrencyAmount,
  spender?: string,
): [ApprovalState, () => Promise<void>] {
  const { account } = useRadioShackWeb3();

  const token = amountToApprove instanceof TokenAmount ? amountToApprove.token : undefined;
  const currentAllowance = useTokenAllowance(token, account ?? undefined, spender);
  const pendingApproval = useHasPendingApproval(token?.address, spender);

  // check the current approval status
  const approvalState: ApprovalState = useMemo(() => {
    if (!amountToApprove || !spender) return ApprovalState.UNKNOWN;
    if (amountToApprove.currency === CETH[chainId]) return ApprovalState.APPROVED;
    // we might not have enough data to know whether or not we need to approve
    if (!currentAllowance) return ApprovalState.UNKNOWN;

    // amountToApprove will be defined if currentAllowance is
    return currentAllowance.lessThan(amountToApprove)
      ? pendingApproval
        ? ApprovalState.PENDING
        : ApprovalState.NOT_APPROVED
      : ApprovalState.APPROVED;
  }, [amountToApprove, currentAllowance, pendingApproval, spender]);

  const tokenContract = useTokenContract(token?.address);
  const addTransaction = useTransactionAdder();

  const approve = useCallback(async (): Promise<void> => {
    if (approvalState !== ApprovalState.NOT_APPROVED) {
      console.error('approve was called unnecessarily');
      return;
    }
    if (!token) {
      console.error('no token');
      return;
    }

    if (!tokenContract) {
      console.error('tokenContract is null');
      return;
    }

    if (!amountToApprove) {
      console.error('missing amount to approve');
      return;
    }

    if (!spender) {
      console.error('no spender');
      return;
    }

    let useExact = false;
    const estimatedGas = await tokenContract.estimateGas.approve(spender, MaxUint256).catch(() => {
      // general fallback for tokens who restrict approval amounts
      useExact = true;
      return tokenContract.estimateGas.approve(spender, amountToApprove.raw.toString());
    });

    try {
      const response: TransactionResponse = await tokenContract.approve(
        spender,
        useExact ? amountToApprove.raw.toString() : MaxUint256,
        {
          gasLimit: calculateGasMargin(estimatedGas),
        },
      );
      await waitForTransaction(response, 1);
      addTransaction(response, {
        summary: 'Approve ' + amountToApprove.currency.symbol,
        approval: { tokenAddress: token.address, spender: spender },
      });
    } catch (error) {
      console.debug('Failed to approve token', error);
      throw error;
    }
  }, [approvalState, token, tokenContract, amountToApprove, spender, addTransaction]);

  return [approvalState, approve];
}

export function useNearApproveCallback(): [ApprovalState, () => Promise<void>] {
  const approve = useCallback(async (): Promise<void> => {
    Promise.resolve(42);
  }, []);

  return [ApprovalState.APPROVED, approve];
}

// wraps useApproveCallback in the context of a swap
export function useApproveCallbackFromTrade(chainId: ChainId, trade?: Trade, allowedSlippage = 0) {
  const [amountToApprove, routerAddress] = useMemo(() => {
    if (!chainId || !trade) return [undefined, undefined];
    return [
      computeSlippageAdjustedAmounts(trade, allowedSlippage)[Field.INPUT],
      trade.feeTo === ZERO_ADDRESS ? ROUTER_ADDRESS[chainId] : ROUTER_DAAS_ADDRESS[chainId],
    ];
  }, [trade, allowedSlippage]);
  return useApproveCallback(chainId, amountToApprove, routerAddress);
}

//TODO:  Near Swap Approve dummy hook
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function useApproveCallbackFromNearTrade(_chainId: ChainId, _trade?: Trade, _allowedSlippage = 0) {
  const approve = () => {
    return Promise.resolve();
  };
  return [ApprovalState.APPROVED, approve] as [ApprovalState, () => Promise<void>];
}

// wraps useApproveCallback in the context of a swap
export function useApproveCallbackFromInputCurrencyAmount(currencyAmountIn: any | undefined) {
  const chainId = useChainId();
  const gelatoLibrary = useGelatoLimitOrdersLib();

  const newCurrencyAmountIn = currencyAmountIn
    ? new TokenAmount(currencyAmountIn?.currency, currencyAmountIn?.numerator)
    : undefined;

  return useApproveCallback(chainId, newCurrencyAmountIn, gelatoLibrary?.erc20OrderRouter.address ?? undefined);
}
