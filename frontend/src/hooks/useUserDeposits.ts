"use client";

import { useState, useEffect, useCallback } from 'react';
import { useYieldProgram } from './useYieldProgram';
import { useWallet } from '@solana/wallet-adapter-react';

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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { getUserDeposits, isReady } = useYieldProgram();
  const { connected, publicKey } = useWallet();

  const fetchDeposits = useCallback(async () => {
    if (!isReady || !connected || !publicKey) {
      setDeposits([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('Fetching user deposits...');
      const userDeposits = await getUserDeposits();
      setDeposits(userDeposits);
      console.log('User deposits loaded:', userDeposits.length);
    } catch (err) {
      console.error('Error fetching deposits:', err);
      setError(err instanceof Error ? err.message : 'Failed to load deposits');
    } finally {
      setIsLoading(false);
    }
  }, [getUserDeposits, isReady, connected, publicKey]);

  // Auto-fetch au montage et quand les dépendances changent
  useEffect(() => {
    fetchDeposits();
  }, [fetchDeposits]);

  // Calculer les statistiques
  const stats = {
    totalDeposits: deposits.length,
    totalValue: deposits.reduce((sum, deposit) => sum + parseFloat(deposit.amount), 0),
    totalYieldValue: deposits.reduce((sum, deposit) => sum + parseFloat(deposit.yieldAmount), 0),
    maturedDeposits: deposits.filter(d => d.isMatured).length,
    pendingDeposits: deposits.filter(d => !d.isMatured).length,
  };

  return {
    deposits,
    stats,
    isLoading,
    error,
    refetch: fetchDeposits,
  };
};
