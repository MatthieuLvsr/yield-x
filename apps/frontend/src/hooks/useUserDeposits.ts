"use client";

import { useState, useEffect, useCallback } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { mockUserDeposits } from '@/lib/mockUserDeposits';
import { isUsingMockData, getMockDelay } from '@/lib/config';
import { useYieldProgram } from './useYieldProgram';
import { useStrategies } from './useStrategies';
import { 
  enrichDepositsWithStrategyInfo, 
  calculateEnrichedStats, 
  EnrichedUserDeposit 
} from '@/lib/depositUtils';

export interface UserDeposit {
  publicKey: string;
  amount: string;
  yieldAmount: string;
  depositDate: string;
  maturityDate: string;
  timeUntilMaturity: number;
  isMatured: boolean;
  strategyAddress: string;
  tokenAddress: string;
  yieldTokenAddress: string;
  apy: string;
}

export const useUserDeposits = () => {
  const [deposits, setDeposits] = useState<UserDeposit[]>([]);
  const [enrichedDeposits, setEnrichedDeposits] = useState<EnrichedUserDeposit[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { connected } = useWallet();
  const { getUserDeposits } = useYieldProgram();
  const { strategies } = useStrategies();

  const fetchDeposits = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (isUsingMockData()) {
        console.log('📦 Loading mock user deposits...');
        // Simuler un délai d'API
        await new Promise(resolve => setTimeout(resolve, getMockDelay()));
        setDeposits(mockUserDeposits);
        console.log('✅ Mock user deposits loaded:', mockUserDeposits.length);
      } else {
        console.log('🔗 Loading real user deposits from blockchain...');
        
        if (!connected) {
          console.log('❌ Wallet not connected, setting empty deposits');
          setDeposits([]);
          return;
        }

        // Utiliser la fonction getUserDeposits du hook useYieldProgram
        const realDeposits = await getUserDeposits();
        console.log('✅ Real user deposits loaded:', realDeposits.length);
        console.log('📊 Deposits data:', realDeposits);
        
        setDeposits(realDeposits as UserDeposit[]);
      }
    } catch (err) {
      console.error('❌ Error fetching deposits:', err);
      setError(err instanceof Error ? err.message : 'Failed to load deposits');
      // En cas d'erreur, ne pas laisser le tableau vide, garder les données précédentes
    } finally {
      setIsLoading(false);
    }
  }, [connected, getUserDeposits]);

  // Auto-fetch au montage et quand les dépendances changent
  useEffect(() => {
    // Débounce le fetch pour éviter les appels répétés
    const timer = setTimeout(() => {
      fetchDeposits();
    }, 100);

    return () => clearTimeout(timer);
  }, [fetchDeposits]);

  // Enrichir les dépôts avec les informations des stratégies
  useEffect(() => {
    if (deposits.length > 0 && strategies.length > 0) {
      console.log('🔄 Enriching deposits with strategy info...');
      const enriched = enrichDepositsWithStrategyInfo(deposits, strategies);
      setEnrichedDeposits(enriched);
      console.log('✅ Enriched deposits:', enriched.length);
    } else {
      setEnrichedDeposits([]);
    }
  }, [deposits, strategies]);

  // Debug: Log des changements de dépôts
  useEffect(() => {
    console.log('🔄 useUserDeposits state changed:', {
      depositsCount: deposits.length,
      enrichedDepositsCount: enrichedDeposits.length,
      strategiesCount: strategies.length,
      isLoading,
      error,
      connected,
      useMockData: isUsingMockData()
    });
  }, [deposits, enrichedDeposits, strategies, isLoading, error, connected]);

  // Calculer les statistiques enrichies
  const stats = enrichedDeposits.length > 0 
    ? calculateEnrichedStats(enrichedDeposits)
    : {
        totalDeposits: deposits.length,
        totalsByToken: {},
        maturedDeposits: deposits.filter(d => d.isMatured).length,
        pendingDeposits: deposits.filter(d => !d.isMatured).length,
      };

  return {
    deposits,
    enrichedDeposits,
    stats,
    isLoading,
    error,
    refetch: fetchDeposits,
  };
};
