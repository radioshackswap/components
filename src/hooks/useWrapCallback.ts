import { CETH, Currency, WETH, currencyEquals } from '@radioshackswap/sdk2';
import { parseUnits } from 'ethers/lib/utils';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { tryParseAmount } from '../state/pswap/hooks';
import { useTransactionAdder } from '../state/ptransactions/hooks';
import { useCurrencyBalance } from '../state/pwallet/hooks';
import { useWETHContract } from './useContract';
import { useChainId, useRadioShackWeb3 } from './index';

export enum WrapType {
  NOT_APPLICABLE,
  WRAP,
  UNWRAP,
}

const NOT_APPLICABLE = { wrapType: WrapType.NOT_APPLICABLE };
/**
 * Given the selected input and output currency, return a wrap callback
 * @param inputCurrency the selected input currency
 * @param outputCurrency the selected output currency
 * @param typedValue the user input value
 */
export function useWrapCallback(
  inputCurrency: Currency | undefined,
  outputCurrency: Currency | undefined,
  typedValue: string | undefined,
): { wrapType: WrapType; execute?: undefined | (() => Promise<void>); inputError?: string } {
  const { account } = useRadioShackWeb3();

  const chainId = useChainId();

  const { t } = useTranslation();

  const wethContract = useWETHContract();
  const balance = useCurrencyBalance(chainId, account ?? undefined, inputCurrency);
  // we can always parse the amount typed as the input currency, since wrapping is 1:1
  const inputAmount = useMemo(() => tryParseAmount(typedValue, inputCurrency), [inputCurrency, typedValue]);
  const addTransaction = useTransactionAdder();

  return useMemo(() => {
    if (!wethContract || !chainId || !inputCurrency || !outputCurrency) return NOT_APPLICABLE;

    const sufficientBalance = inputAmount && balance && !balance.lessThan(inputAmount);

    let inputError = !typedValue ? t('swapHooks.enterAmount') : undefined;

    if (inputCurrency === CETH[chainId] && currencyEquals(WETH[chainId], outputCurrency)) {
      inputError =
        inputError ??
        (sufficientBalance ? undefined : t('swapHooks.insufficientBalance', { symbol: CETH[chainId].symbol }));

      return {
        wrapType: WrapType.WRAP,
        execute:
          sufficientBalance && inputAmount
            ? async () => {
                try {
                  const txReceipt = await wethContract.deposit({ value: `0x${inputAmount.raw.toString(16)}` });
                  addTransaction(txReceipt, { summary: `Wrap ${inputAmount.toSignificant(6)} AVAX to WETH` });
                } catch (error) {
                  console.error('Could not deposit', error);
                }
              }
            : undefined,
        inputError: inputError,
      };
    } else if (currencyEquals(WETH[chainId], inputCurrency) && outputCurrency === CETH[chainId]) {
      inputError =
        inputError ??
        (sufficientBalance ? undefined : t('swapHooks.insufficientBalance', { symbol: WETH[chainId].symbol }));

      return {
        wrapType: WrapType.UNWRAP,
        execute:
          sufficientBalance && inputAmount
            ? async () => {
                try {
                  const txReceipt = await wethContract.withdraw(`0x${inputAmount.raw.toString(16)}`);
                  addTransaction(txReceipt, { summary: `Unwrap ${inputAmount.toSignificant(6)} WETH to AVAX` });
                } catch (error) {
                  console.error('Could not withdraw', error);
                }
              }
            : undefined,
        inputError: inputError,
      };
    } else {
      return NOT_APPLICABLE;
    }
  }, [wethContract, chainId, inputCurrency, outputCurrency, inputAmount, balance, addTransaction]);
}
