'use client';

import { useEffect } from 'react';
import {
  useWriteContract,
  useWaitForTransactionReceipt,
  useAccount,
} from 'wagmi';
import { toast as sonner } from 'sonner';

export function useContract(successCallback: () => void) {
  const { isConnected } = useAccount();
  const {
    data: writeContractHash,
    status: writeContractStatus,
    writeContract,
  } = useWriteContract();
  const { status: transactionStatus } = useWaitForTransactionReceipt({
    hash: writeContractHash,
  });

  useEffect(() => {
    if (writeContractStatus === 'error' || transactionStatus === 'error') {
      sonner.error('Error.', {
        description: 'Transaction failed.',
        position: 'bottom-right',
      });
    } else if (
      writeContractStatus === 'success' &&
      transactionStatus === 'pending'
    ) {
      sonner.info('Pending...', {
        description: 'Transaction is being processed...',
        position: 'bottom-right',
      });
    } else if (transactionStatus === 'success') {
      sonner.success('Success!', {
        description: 'Transaction has succeeded!',
        position: 'bottom-right',
      });
      successCallback();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactionStatus, writeContractStatus]);

  return {
    isConnected: isConnected,
    isPending:
      transactionStatus === 'pending' &&
      !['idle', 'error'].includes(writeContractStatus),
    writeContract,
  };
}
