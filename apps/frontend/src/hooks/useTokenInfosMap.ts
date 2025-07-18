import { useEffect, useState } from 'react';
import type { Strategy } from '@/app/page';
import { getTokenInfo } from '@/lib/stats.action';
import type { TokenInfo } from './useStrategies';

/**
 * Custom hook to batch fetch token info for a list of strategies.
 * Returns a map: { [tokenAddress: string]: TokenInfo | null }
 */
export function useTokenInfosMap(strategies: Strategy[]) {
  const [tokenInfos, setTokenInfos] = useState<Record<string, TokenInfo>>({});

  useEffect(() => {
    let cancelled = false;

    // Get unique token addresses from strategies
    const uniqueTokenAddresses = Array.from(
      new Set(strategies.map((s) => s.account.tokenAddress.toString()))
    );

    if (uniqueTokenAddresses.length === 0) {
      setTokenInfos({});
      return;
    }

    (async () => {
      const entries = await Promise.all(
        uniqueTokenAddresses.map(async (address) => {
          try {
            const info = await getTokenInfo(address);
            return [address, info];
          } catch (e) {
            return [address, null];
          }
        })
      );
      if (!cancelled) {
        setTokenInfos(Object.fromEntries(entries));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [strategies]);

  return tokenInfos;
}
