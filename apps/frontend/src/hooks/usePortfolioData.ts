/**
 * Hook for managing demo/mock data vs real API data
 * This provides a clean abstraction for switching between demo and live data
 */

import { useEffect, useState } from 'react';
import { isDemoModeEnabled, isUsingMockData } from '@/lib/config';
import {
  type MockPortfolioStats,
  type MockPosition,
  mockAPI,
} from '@/lib/mockData';

interface UsePortfolioDataOptions {
  enableDemo?: boolean;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

interface PortfolioData {
  stats: MockPortfolioStats | null;
  positions: MockPosition[];
  isLoading: boolean;
  error: string | null;
  isDemoMode: boolean;
  setDemoMode: (enabled: boolean) => void;
  refresh: () => Promise<void>;
}

export const usePortfolioData = (
  options: UsePortfolioDataOptions = {}
): PortfolioData => {
  // Use configuration to determine default mode
  const defaultDemoMode = isUsingMockData() || isDemoModeEnabled();
  const {
    enableDemo = defaultDemoMode,
    autoRefresh = false,
    refreshInterval = 30_000,
  } = options;

  const [isDemoMode, setIsDemoMode] = useState(enableDemo);
  const [stats, setStats] = useState<MockPortfolioStats | null>(null);
  const [positions, setPositions] = useState<MockPosition[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!isDemoMode) {
      // When not in demo mode, clear mock data
      setStats(null);
      setPositions([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const [portfolioStats, portfolioPositions] = await Promise.all([
        mockAPI.getPortfolioStats(),
        mockAPI.getPositions(),
      ]);

      setStats(portfolioStats);
      setPositions(portfolioPositions);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Failed to load portfolio data'
      );
      console.error('Error fetching portfolio data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const setDemoMode = (enabled: boolean) => {
    setIsDemoMode(enabled);
  };

  const refresh = async () => {
    await fetchData();
  };

  // Load data when demo mode changes
  useEffect(() => {
    fetchData();
  }, [isDemoMode]);

  // Auto-refresh if enabled
  useEffect(() => {
    if (!(autoRefresh && isDemoMode)) return;

    const interval = setInterval(fetchData, refreshInterval);
    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, isDemoMode]);

  return {
    stats,
    positions,
    isLoading,
    error,
    isDemoMode,
    setDemoMode,
    refresh,
  };
};

/**
 * Utility function to format portfolio values for display
 */
export const formatPortfolioValue = (
  value: number,
  currency = 'USD'
): string => {
  if (currency === 'USD') {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  }

  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  }).format(value);
};

/**
 * Utility to calculate portfolio performance metrics
 */
export const calculatePortfolioMetrics = (stats: MockPortfolioStats) => {
  const roi =
    ((stats.totalValue - stats.totalDeposited) / stats.totalDeposited) * 100;
  const yieldPercentage = (stats.totalRewards / stats.totalDeposited) * 100;

  return {
    roi: roi.toFixed(2),
    yieldPercentage: yieldPercentage.toFixed(2),
    profitLoss: stats.totalValue - stats.totalDeposited,
    profitLossFormatted: formatPortfolioValue(
      stats.totalValue - stats.totalDeposited
    ),
  };
};

/**
 * Get performance indicators for UI display
 */
export const getPerformanceIndicators = (value: number) => {
  if (value > 0) {
    return {
      color: 'text-green-400',
      bgColor: 'bg-green-400/10',
      borderColor: 'border-green-400/20',
      icon: '↗',
      trend: 'positive' as const,
    };
  }
  if (value < 0) {
    return {
      color: 'text-red-400',
      bgColor: 'bg-red-400/10',
      borderColor: 'border-red-400/20',
      icon: '↘',
      trend: 'negative' as const,
    };
  }
  return {
    color: 'text-gray-400',
    bgColor: 'bg-gray-400/10',
    borderColor: 'border-gray-400/20',
    icon: '→',
    trend: 'neutral' as const,
  };
};
