'use client';

import { useAccount } from 'wagmi';
import { DataType } from '@/contexts/data-provider';

export function useData(): DataType {
  const { isConnected, address } = useAccount();

  return {
    account: {
      address,
      isConnected,
    },
    data: {
      // TODO: data
    },
  };
}
