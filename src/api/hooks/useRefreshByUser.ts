import { useCallback, useState } from 'react';

export function useRefreshByUser<T>(refetch: () => Promise<T>) {
  const [isRefetchingByUser, setIsRefetchingByUser] = useState(false);

  const refetchByUser = useCallback(async () => {
    setIsRefetchingByUser(true);

    try {
      await refetch();
    } finally {
      setIsRefetchingByUser(false);
    }
  }, [refetch]);

  return {
    isRefetchingByUser,
    refetchByUser,
  };
}
