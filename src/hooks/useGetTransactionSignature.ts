import { splitSignature } from 'ethers/lib/utils';
import { useLibrary, useRadioShackWeb3 } from './index';

export function useGetTransactionSignature() {
  const { provider } = useLibrary();
  const { account } = useRadioShackWeb3();

  const getSignature = async (data) => {
    try {
      const rawSignature = await provider.execute('eth_signTypedData_v4', [account, data]);
      return splitSignature(rawSignature);
    } catch (err: any) {
      if (err?.code !== 4001) {
        throw err;
      }
    }
  };

  return getSignature;
}
