/**
 * Mock data service for portfolio demonstration
 * This file contains fictional data to showcase the portfolio functionality.
 * In production, replace these functions with actual API calls.
 */

import { getMockDelay } from './config';

export interface MockPortfolioStats {
  totalValue: number;
  totalDeposited: number;
  totalRewards: number;
  totalReturn: number;
  activePositions: number;
  portfolioGrowth: number;
  monthlyEarnings: number;
  avgAPY: number;
}

export interface MockPosition {
  id: string;
  strategy: string;
  token: string;
  deposited: number;
  currentValue: number;
  apy: number;
  rewards: number;
  status: 'Active' | 'Pending' | 'Withdrawing';
  depositDate: string;
  maturityDate: string;
  timeUntilMaturity: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  platform: string;
}

export interface MockPerformanceData {
  date: string;
  value: number;
  rewards: number;
}

/**
 * Generate mock portfolio statistics
 * Replace this with actual API call: await api.getUserPortfolioStats()
 */
export const getMockPortfolioStats = (): MockPortfolioStats => {
  return {
    totalValue: 47832.45,
    totalDeposited: 42000.00,
    totalRewards: 5832.45,
    totalReturn: 13.89,
    activePositions: 8,
    portfolioGrowth: 2.34,
    monthlyEarnings: 1247.80,
    avgAPY: 16.7
  };
};

/**
 * Generate mock user positions
 * Replace this with actual API call: await api.getUserPositions()
 */
export const getMockPositions = (): MockPosition[] => {
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  
  return [
    {
      id: 'pos_1',
      strategy: 'Solana DeFi Liquidity Pool',
      token: 'SOL',
      deposited: 125.50,
      currentValue: 142.30,
      apy: 18.5,
      rewards: 16.80,
      status: 'Active',
      depositDate: new Date(now - 45 * dayMs).toISOString(),
      maturityDate: new Date(now + 15 * dayMs).toISOString(),
      timeUntilMaturity: 15 * dayMs / 1000,
      riskLevel: 'Medium',
      platform: 'Raydium'
    },
    {
      id: 'pos_2',
      strategy: 'USDC Lending Vault',
      token: 'USDC',
      deposited: 8500.00,
      currentValue: 9147.25,
      apy: 12.3,
      rewards: 647.25,
      status: 'Active',
      depositDate: new Date(now - 62 * dayMs).toISOString(),
      maturityDate: new Date(now - 2 * dayMs).toISOString(),
      timeUntilMaturity: 0,
      riskLevel: 'Low',
      platform: 'Solend'
    },
    {
      id: 'pos_3',
      strategy: 'mSOL Staking Rewards',
      token: 'mSOL',
      deposited: 89.75,
      currentValue: 98.45,
      apy: 6.8,
      rewards: 8.70,
      status: 'Active',
      depositDate: new Date(now - 89 * dayMs).toISOString(),
      maturityDate: new Date(now + 1 * dayMs).toISOString(),
      timeUntilMaturity: 1 * dayMs / 1000,
      riskLevel: 'Low',
      platform: 'Marinade'
    },
    {
      id: 'pos_4',
      strategy: 'High Yield DeFi Composite',
      token: 'USDT',
      deposited: 15000.00,
      currentValue: 17284.50,
      apy: 24.7,
      rewards: 2284.50,
      status: 'Active',
      depositDate: new Date(now - 68 * dayMs).toISOString(),
      maturityDate: new Date(now + 22 * dayMs).toISOString(),
      timeUntilMaturity: 22 * dayMs / 1000,
      riskLevel: 'High',
      platform: 'Tulip Protocol'
    },
    {
      id: 'pos_5',
      strategy: 'BTC Wrapped Yield',
      token: 'BTC',
      deposited: 0.75,
      currentValue: 0.84,
      apy: 15.2,
      rewards: 0.09,
      status: 'Active',
      depositDate: new Date(now - 34 * dayMs).toISOString(),
      maturityDate: new Date(now + 26 * dayMs).toISOString(),
      timeUntilMaturity: 26 * dayMs / 1000,
      riskLevel: 'Medium',
      platform: 'Port Finance'
    },
    {
      id: 'pos_6',
      strategy: 'ETH Liquid Staking',
      token: 'ETH',
      deposited: 3.2,
      currentValue: 3.54,
      apy: 9.1,
      rewards: 0.34,
      status: 'Pending',
      depositDate: new Date(now - 5 * dayMs).toISOString(),
      maturityDate: new Date(now + 55 * dayMs).toISOString(),
      timeUntilMaturity: 55 * dayMs / 1000,
      riskLevel: 'Low',
      platform: 'Lido'
    },
    {
      id: 'pos_7',
      strategy: 'ORCA LP Rewards',
      token: 'ORCA',
      deposited: 450.00,
      currentValue: 523.80,
      apy: 21.4,
      rewards: 73.80,
      status: 'Active',
      depositDate: new Date(now - 42 * dayMs).toISOString(),
      maturityDate: new Date(now + 18 * dayMs).toISOString(),
      timeUntilMaturity: 18 * dayMs / 1000,
      riskLevel: 'High',
      platform: 'Orca'
    },
    {
      id: 'pos_8',
      strategy: 'Stable Arbitrage Pool',
      token: 'USDC',
      deposited: 12500.00,
      currentValue: 13456.75,
      apy: 11.8,
      rewards: 956.75,
      status: 'Withdrawing',
      depositDate: new Date(now - 78 * dayMs).toISOString(),
      maturityDate: new Date(now - 8 * dayMs).toISOString(),
      timeUntilMaturity: 0,
      riskLevel: 'Low',
      platform: 'Mercurial'
    }
  ];
};

/**
 * Generate mock performance data for charts
 * Replace this with actual API call: await api.getPortfolioPerformance(timeRange)
 */
export const getMockPerformanceData = (days: number = 30): MockPerformanceData[] => {
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  const data: MockPerformanceData[] = [];
  
  const startValue = 42000;
  const endValue = 47832.45;
  const totalGrowth = endValue - startValue;
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now - i * dayMs);
    const progress = (days - i) / days;
    
    // Add some realistic volatility
    const volatility = Math.sin(progress * Math.PI * 4) * 0.02 + Math.random() * 0.01 - 0.005;
    const baseGrowth = progress * totalGrowth;
    const dailyValue = startValue + baseGrowth + (baseGrowth * volatility);
    
    const dailyRewards = progress * 5832.45 + Math.random() * 50;
    
    data.push({
      date: date.toISOString().split('T')[0],
      value: Math.max(startValue * 0.95, dailyValue),
      rewards: Math.max(0, dailyRewards)
    });
  }
  
  return data;
};

/**
 * Generate mock rewards data for detailed charts
 */
export const getMockRewardsData = (days: number = 30) => {
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  const data = [];
  
  let cumulativeRewards = 0;
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(now - i * dayMs);
    const dailyRewards = 15 + Math.random() * 30 + Math.sin(i * 0.2) * 10;
    cumulativeRewards += dailyRewards;
    
    data.push({
      date: date.toISOString().split('T')[0],
      dailyRewards: dailyRewards,
      cumulativeRewards: cumulativeRewards
    });
  }
  
  return data;
};

/**
 * Generate asset allocation data for pie chart
 */
export const getMockAssetAllocation = () => {
  const mockStats = getMockPortfolioStats();
  const mockPositions = getMockPositions();
  
  // Group by token and calculate totals
  const tokenTotals = mockPositions.reduce((acc, position) => {
    if (!acc[position.token]) {
      acc[position.token] = 0;
    }
    acc[position.token] += position.currentValue;
    return acc;
  }, {} as Record<string, number>);

  // Convert to pie chart format with colors
  const colors = {
    'SOL': '#9945FF',
    'USDC': '#2775CA', 
    'USDT': '#26A17B',
    'BTC': '#F7931A',
    'ETH': '#627EEA',
    'mSOL': '#B794F6',
    'ORCA': '#FFD700'
  };

  return Object.entries(tokenTotals).map(([token, value]) => ({
    name: token,
    y: value,
    color: colors[token as keyof typeof colors] || '#6B7280'
  }));
};

/**
 * Generate strategy performance data for bar chart
 */
export const getMockStrategyPerformance = () => {
  const mockPositions = getMockPositions();
  
  return mockPositions.map(position => ({
    name: position.strategy.split(' ').slice(0, 2).join(' '), // Shorten names
    apy: position.apy,
    value: position.currentValue,
    risk: position.riskLevel
  }));
};

/**
 * Get risk level color for UI display
 */
export const getRiskLevelColor = (riskLevel: 'Low' | 'Medium' | 'High'): string => {
  switch (riskLevel) {
    case 'Low': return 'text-green-400 bg-green-400/10 border-green-400/20';
    case 'Medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
    case 'High': return 'text-red-400 bg-red-400/10 border-red-400/20';
    default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
  }
};

/**
 * Mock API functions that simulate real API calls
 * In production, replace these with actual HTTP requests
 */
export const mockAPI = {
  /**
   * Simulate fetching user portfolio stats from API
   * Replace with: await fetch('/api/portfolio/stats')
   */
  getPortfolioStats: async (): Promise<MockPortfolioStats> => {
    // Use configured delay from environment
    await new Promise(resolve => setTimeout(resolve, getMockDelay()));
    return getMockPortfolioStats();
  },

  /**
   * Simulate fetching user positions from API
   * Replace with: await fetch('/api/portfolio/positions')
   */
  getPositions: async (): Promise<MockPosition[]> => {
    // Use configured delay from environment
    await new Promise(resolve => setTimeout(resolve, getMockDelay() + 400));
    return getMockPositions();
  },

  /**
   * Simulate fetching performance data from API
   * Replace with: await fetch(`/api/portfolio/performance?days=${days}`)
   */
  getPerformanceData: async (days: number = 30): Promise<MockPerformanceData[]> => {
    // Use configured delay from environment
    await new Promise(resolve => setTimeout(resolve, getMockDelay() - 200));
    return getMockPerformanceData(days);
  },

  /**
   * Simulate fetching rewards data from API
   */
  getRewardsData: async (days: number = 30) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return getMockRewardsData(days);
  },

  /**
   * Simulate fetching asset allocation from API
   */
  getAssetAllocation: async () => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return getMockAssetAllocation();
  },

  /**
   * Simulate fetching strategy performance from API
   */
  getStrategyPerformance: async () => {
    await new Promise(resolve => setTimeout(resolve, 450));
    return getMockStrategyPerformance();
  }
};
