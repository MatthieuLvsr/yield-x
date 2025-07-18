import { useConnection } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { useCallback, useEffect, useState } from 'react';
import type { Strategy } from '@/app/page';
import { type app, getTokenInfo } from '@/lib/stats.action';
import { PROGRAM_ID, TOKEN_MINTS } from '../lib/constants';

/*
apy
:
1200
description
:
"Earn stable yield on USDC through optimized lending protocols"
id
:
"5ikFDxYx"
lockPeriod
:
"30 days"
name
:
"Enhanced USDC Yield"
protocol
:
"Yield-X Protocol"
publicKey
:
PublicKey {_bn: BN}
risk
:
"High"
token
:
"USDC"
tokenMint
:
PublicKey {_bn: BN}
tvl
:
"$0"
*/

// Interface pour les stratégies formatées pour l'UI
export interface FormattedStrategy {
  id: string;
  name: string;
  token: string;
  tokenMint: PublicKey;
  apy: number;
  risk: 'Low' | 'Medium' | 'High';
  tvl: string;
  description: string;
  protocol: string;
  lockPeriod: string;
  publicKey: PublicKey;
}

export type TokenInfo = NonNullable<
  Awaited<ReturnType<ReturnType<typeof app.contract.token>['get']>>['data']
>;

export const useTokenInfo = (strategy: Strategy) => {
  const [tokenInfo, setTokenInfo] = useState<TokenInfo | null>(null);

  useEffect(() => {
    const getToken = async () => {
      const data = await getTokenInfo(strategy.account.tokenAddress.toString());
      setTokenInfo(data ? data : null);
    };
    getToken();
  }, [strategy]);

  return { tokenInfo };
};

export function useTokenInfosMap(strategies: Strategy[]) {
  const [tokenInfos, setTokenInfos] = useState<Record<string, TokenInfo>>({});

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const entries = await Promise.all(
        strategies.map(async (s) => {
          const info = await getTokenInfo(s.account.tokenAddress.toString());
          return [s.account.tokenAddress.toString(), info];
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

// Fonction pour mapper les adresses de tokens vers leurs symboles
const getTokenSymbol = (tokenAddress: PublicKey): string => {
  const addressStr = tokenAddress.toString();

  if (addressStr === TOKEN_MINTS.USDC.toString()) return 'USDC';
  if (addressStr === TOKEN_MINTS.SOL.toString()) return 'SOL';
  if (addressStr === TOKEN_MINTS.RAY.toString()) return 'RAY';

  return 'UNKNOWN';
};

// Fonction pour déterminer le niveau de risque basé sur l'APY
const getRiskLevel = (apy: number): 'Low' | 'Medium' | 'High' => {
  if (apy < 10) return 'Low';
  if (apy < 20) return 'Medium';
  return 'High';
};

// Fonction pour générer un nom de stratégie basé sur le token
const getStrategyName = (tokenSymbol: string, apy: number): string => {
  const riskLevel = getRiskLevel(apy);

  switch (tokenSymbol) {
    case 'USDC':
      return riskLevel === 'Low' ? 'Stable Yield' : 'Enhanced USDC Yield';
    case 'SOL':
      return 'SOL Staking Plus';
    case 'RAY':
      return 'DeFi Boost';
    default:
      return `Custom Strategy ${tokenSymbol}`;
  }
};

// Fonction pour générer une description basée sur le token
const getStrategyDescription = (tokenSymbol: string): string => {
  switch (tokenSymbol) {
    case 'USDC':
      return 'Earn stable yield on USDC through optimized lending protocols';
    case 'SOL':
      return 'Enhanced SOL staking with DeFi yield optimization';
    case 'RAY':
      return 'High-yield DeFi strategy with liquidity farming';
    default:
      return 'Custom yield strategy with optimized returns';
  }
};

// Fonction pour parser les données de compte Strategy depuis les données raw
const parseStrategyAccount = (data: Buffer): Strategy['account'] | null => {
  try {
    console.log('Parsing account data, length:', data.length);
    console.log('First 16 bytes (hex):', data.slice(0, 16).toString('hex'));

    // Structure du compte Strategy d'après votre IDL:
    // Discriminator: 8 bytes (ajouté par Anchor)
    // tokenAddress: PublicKey (32 bytes)
    // tokenYieldAddress: PublicKey (32 bytes)
    // date: i64 (8 bytes)
    // rewardApy: u64 (8 bytes)
    // Total: 8 + 32 + 32 + 8 + 8 = 88 bytes

    if (data.length < 88) {
      console.warn(
        'Strategy account data too short:',
        data.length,
        'expected at least 88 bytes'
      );
      return null;
    }

    // Skip les 8 premiers bytes (discriminator Anchor)
    const tokenAddress = new PublicKey(data.slice(8, 40));
    const tokenYieldAddress = new PublicKey(data.slice(40, 72));
    const date = data.readBigInt64LE(72);
    const rewardApy = data.readBigUInt64LE(80);

    // Convertir en strings comme Solana Playground pour la compatibilité
    const result = {
      tokenAddress,
      tokenYieldAddress,
      date: date.toString(),
      rewardApy: rewardApy.toString(),
    };

    console.log('Parsed strategy account:', {
      tokenAddress: tokenAddress.toString(),
      tokenYieldAddress: tokenYieldAddress.toString(),
      date: result.date,
      rewardApy: result.rewardApy,
      dateAsNumber: Number(result.date),
      rewardApyAsNumber: Number(result.rewardApy),
    });

    return result;
  } catch (error) {
    console.error('Error parsing strategy account:', error);
    return null;
  }
};

export const useStrategies = () => {
  const { connection } = useConnection();
  const [strategies, setStrategies] = useState<FormattedStrategy[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStrategies = useCallback(async () => {
    if (!connection) {
      return;
    }

    setIsLoading(true);

    try {
      const accounts = await connection.getProgramAccounts(PROGRAM_ID, {
        filters: [
          {
            dataSize: 88, // Taille du compte Strategy avec discriminator (8+32+32+8+8 bytes)
          },
        ],
      });

      const formattedStrategies: FormattedStrategy[] = [];
      for (const { pubkey, account } of accounts) {
        console.log(
          'Processing account:',
          pubkey.toString(),
          'with data size:',
          account.data.length
        );

        const parsedAccount = parseStrategyAccount(account.data);

        if (!parsedAccount) {
          console.warn('Failed to parse strategy account:', pubkey.toString());
          continue;
        }

        const tokenSymbol = getTokenSymbol(parsedAccount.tokenAddress);
        const rewardApyNumber = Number.parseFloat(parsedAccount.rewardApy);

        formattedStrategies.push({
          id: pubkey.toString().slice(0, 8),
          name: getStrategyName(tokenSymbol, rewardApyNumber),
          token: tokenSymbol,
          tokenMint: parsedAccount.tokenAddress,
          apy: rewardApyNumber,
          risk: getRiskLevel(rewardApyNumber),
          tvl: '$0',
          description: getStrategyDescription(tokenSymbol),
          protocol: 'Yield-X Protocol',
          lockPeriod: '30 days',
          publicKey: pubkey,
        });
      }

      console.log('Formatted strategies:', formattedStrategies);
      setStrategies(formattedStrategies);
    } catch (err) {
      console.error('Error fetching strategies:', err);
      setError(
        err instanceof Error ? err.message : 'Failed to fetch strategies'
      );

      // Fallback sur une stratégie par défaut en cas d'erreur
      setStrategies([
        {
          id: 'error-fallback',
          name: 'Stable Yield',
          token: 'USDC',
          tokenMint: TOKEN_MINTS.USDC,
          apy: 8.5,
          risk: 'Low',
          tvl: '$0',
          description: 'Conservative yield strategy with minimal risk',
          protocol: 'Yield-X Protocol',
          lockPeriod: '30 days',
          publicKey: PublicKey.default,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [connection]);

  useEffect(() => {
    fetchStrategies();
  }, [fetchStrategies]);

  return {
    strategies,
    isLoading,
    error,
    refetch: fetchStrategies,
  };
};
