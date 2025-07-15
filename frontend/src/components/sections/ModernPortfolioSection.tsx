"use client";

import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ChartBarIcon, 
  LockClosedIcon, 
  XMarkIcon, 
  ExclamationTriangleIcon, 
  CheckCircleIcon,
  EyeIcon,
  EyeSlashIcon 
} from '@heroicons/react/24/outline';
import { useUserDeposits } from '@/hooks/useUserDeposits';
import { useUserDepositsPagination } from '@/hooks/useUserDepositsPagination';
import { useStrategies } from '@/hooks/useStrategies';
import { useYieldProgram } from '@/hooks/useYieldProgram';
import { useWallet } from '@solana/wallet-adapter-react';
import { formatCurrency, formatDate, formatTimeRemaining } from '@/lib/formatters';
import { PublicKey } from '@solana/web3.js';
import { 
  mockAPI, 
  getMockPortfolioStats, 
  getMockPositions, 
  getRiskLevelColor,
  MockPortfolioStats,
  MockPosition 
} from '@/lib/mockData';
import { isUsingMockData, isDemoModeEnabled } from '@/lib/config';
import UserDepositsFiltersComponent from '@/components/filters/UserDepositsFilters';
import { UserDepositCard } from '@/components/ui/UserDepositCard';
import { UserDepositListItem } from '@/components/ui/UserDepositListItem';
import { UserDepositTable } from '@/components/ui/UserDepositTable';
import YieldPagination from '@/components/ui/YieldPagination';
import PortfolioLineChart from '@/components/ui/PortfolioLineChart';
import PortfolioPieChart from '@/components/ui/PortfolioPieChart';
import PortfolioBarChart from '@/components/ui/PortfolioBarChart';
import RewardsAreaChart from '@/components/ui/RewardsAreaChart';
import { Grid, List, Table, ArrowUpDown, SortAsc, SortDesc, RefreshCw } from 'lucide-react';

interface Position {
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
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Active': return 'text-green-400 bg-green-400/10 border-green-400/20';
    case 'Pending': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
    case 'Withdrawing': return 'text-red-400 bg-red-400/10 border-red-400/20';
    default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
  }
};

const ModernPortfolioSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'positions'>('overview');
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshMessage, setRefreshMessage] = useState<string | null>(null);
  
  // Use environment configuration for demo mode
  const [isDemoMode, setIsDemoMode] = useState(isUsingMockData() || isDemoModeEnabled());
  
  // Debug: Log configuration values
  useEffect(() => {
    console.log('🔧 ModernPortfolioSection Configuration:', {
      isUsingMockData: isUsingMockData(),
      isDemoModeEnabled: isDemoModeEnabled(),
      isDemoMode,
      NODE_ENV: process.env.NODE_ENV,
      NEXT_PUBLIC_USE_MOCK_DATA: process.env.NEXT_PUBLIC_USE_MOCK_DATA,
      NEXT_PUBLIC_ENABLE_DEMO_MODE: process.env.NEXT_PUBLIC_ENABLE_DEMO_MODE
    });
  }, [isDemoMode]);
  
  // Keyboard shortcut for refresh (F5 or Ctrl+R)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'F5' || (event.ctrlKey && event.key === 'r')) {
        event.preventDefault();
        handleRefresh();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  // Mock data states (only used in demo mode)
  const [mockStats, setMockStats] = useState<MockPortfolioStats | null>(null);
  const [mockPositions, setMockPositions] = useState<MockPosition[]>([]);
  const [isMockLoading, setIsMockLoading] = useState(false);
  const [chartData, setChartData] = useState<any>({
    performance: [],
    rewards: [],
    assetAllocation: [],
    strategyPerformance: []
  });
  
  const { connected } = useWallet();
  
  // Récupérer les données depuis les hooks (données réelles)
  const { deposits, enrichedDeposits, stats, isLoading: depositsLoading, error: depositsError, refetch: refetchDeposits } = useUserDeposits();
  const { strategies, isLoading: strategiesLoading, refetch: refetchStrategies } = useStrategies();
  const { redeem } = useYieldProgram();

  // Hook de pagination pour les positions
  const {
    paginatedDeposits,
    filteredDeposits,
    paginationInfo,
    sortBy,
    sortDirection,
    handleSortChange,
    viewMode,
    handleViewModeChange,
    filters,
    updateFilters,
    resetFilters,
    filterOptions,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    stats: paginationStats,
  } = useUserDepositsPagination(enrichedDeposits || [], 6);

  // Load mock data when demo mode is enabled
  useEffect(() => {
    if (isDemoMode) {
      setIsMockLoading(true);
      
      // Simulate API calls with proper delays
      Promise.all([
        mockAPI.getPortfolioStats(),
        mockAPI.getPositions(),
        mockAPI.getPerformanceData(30),
        mockAPI.getRewardsData(30),
        mockAPI.getAssetAllocation(),
        mockAPI.getStrategyPerformance()
      ]).then(([stats, positions, performance, rewards, allocation, strategyPerf]) => {
        setMockStats(stats);
        setMockPositions(positions);
        setChartData({
          performance,
          rewards,
          assetAllocation: allocation,
          strategyPerformance: strategyPerf
        });
        setIsMockLoading(false);
      }).catch((error) => {
        console.error('Error loading mock data:', error);
        setIsMockLoading(false);
      });
    } else {
      // Clear mock data when switching back to live mode
      setMockStats(null);
      setMockPositions([]);
      setChartData({
        performance: [],
        rewards: [],
        assetAllocation: [],
        strategyPerformance: []
      });
    }
  }, [isDemoMode]);
  
  // Convertir les dépôts en positions formatées pour l'UI (données réelles)
  const realPositions = useMemo(() => {
    if (!deposits || !strategies) return [];
    
    return deposits.map((deposit): Position => {
      // Trouver la stratégie correspondante
      const strategy = strategies.find(s => s.publicKey.toString() === deposit.strategyAddress);
      
      // Calculer les valeurs en unités de base (pour les calculs)
      const depositedBaseAmount = parseFloat(deposit.amount);
      const yieldBaseAmount = parseFloat(deposit.yieldAmount);
      const currentBaseValue = depositedBaseAmount + yieldBaseAmount;
      
      // Convertir en unités lisibles (diviser par 10^6 pour USDC)
      const USDC_DECIMALS = 6;
      const depositedAmount = depositedBaseAmount / Math.pow(10, USDC_DECIMALS);
      const yieldAmount = yieldBaseAmount / Math.pow(10, USDC_DECIMALS);
      const currentValue = currentBaseValue / Math.pow(10, USDC_DECIMALS);
      
      const apy = parseFloat(deposit.apy);
      
      // Déterminer le statut
      const status: 'Active' | 'Pending' | 'Withdrawing' = deposit.isMatured ? 'Active' : 'Pending';
      
      return {
        id: deposit.publicKey,
        strategy: strategy?.name || 'Unknown Strategy',
        token: strategy?.token || 'UNKNOWN',
        deposited: depositedAmount,
        currentValue: currentValue,
        apy: apy,
        rewards: yieldAmount,
        status,
        depositDate: deposit.depositDate,
        maturityDate: deposit.maturityDate,
        timeUntilMaturity: deposit.timeUntilMaturity,
      };
    });
  }, [deposits, strategies]);

  // Use mock or real data based on demo mode
  const positions = useMemo(() => {
    if (isDemoMode) {
      return mockPositions.map((mockPos): Position => ({
        id: mockPos.id,
        strategy: mockPos.strategy,
        token: mockPos.token,
        deposited: mockPos.deposited,
        currentValue: mockPos.currentValue,
        apy: mockPos.apy,
        rewards: mockPos.rewards,
        status: mockPos.status,
        depositDate: mockPos.depositDate,
        maturityDate: mockPos.maturityDate,
        timeUntilMaturity: mockPos.timeUntilMaturity,
      }));
    }
    return realPositions;
  }, [isDemoMode, mockPositions, realPositions]);
  
  // Calculer les statistiques du portfolio
  const portfolioStats = useMemo(() => {
    if (isDemoMode && mockStats) {
      return {
        totalValue: mockStats.totalValue,
        totalDeposited: mockStats.totalDeposited,
        totalRewards: mockStats.totalRewards,
        totalReturn: mockStats.totalReturn,
        activePositions: mockStats.activePositions
      };
    }
    
    // Real data calculations
    const totalValue = positions.reduce((sum, pos) => sum + pos.currentValue, 0);
    const totalDeposited = positions.reduce((sum, pos) => sum + pos.deposited, 0);
    const totalRewards = positions.reduce((sum, pos) => sum + pos.rewards, 0);
    const totalReturn = totalDeposited > 0 ? ((totalValue - totalDeposited) / totalDeposited) * 100 : 0;
    
    return {
      totalValue,
      totalDeposited,
      totalRewards,
      totalReturn,
      activePositions: positions.length
    };
  }, [isDemoMode, mockStats, positions]);
  
  // État de chargement global
  const isLoading = isDemoMode ? isMockLoading : (depositsLoading || strategiesLoading);

  // Options de tri pour les positions
  const sortOptions = [
    { value: 'depositDate', label: 'Date de dépôt' },
    { value: 'amount', label: 'Montant' },
    { value: 'yieldAmount', label: 'Rendement' },
    { value: 'apy', label: 'APY' },
    { value: 'maturityDate', label: 'Date d\'échéance' },
  ];

  const handleSort = (option: string) => {
    const newDirection = sortBy === option && sortDirection === 'asc' ? 'desc' : 'asc';
    handleSortChange(option as any, newDirection as any);
  };

  // Gestionnaires d'actions pour les positions
  const handlePositionAction = (deposit: any, action: 'withdraw' | 'claim' | 'view') => {
    if (action === 'withdraw') {
      // Convertir le deposit en Position pour compatibilité avec le modal existant
      const position: Position = {
        id: deposit.publicKey,
        strategy: deposit.strategy?.name || deposit.strategyAddress.slice(0, 8),
        token: deposit.tokenSymbol || deposit.tokenAddress.slice(0, 4).toUpperCase(),
        deposited: parseFloat(deposit.amount),
        currentValue: parseFloat(deposit.amount) + parseFloat(deposit.yieldAmount),
        apy: parseFloat(deposit.apy),
        rewards: parseFloat(deposit.yieldAmount),
        status: deposit.isMatured ? 'Active' : 'Pending',
        depositDate: deposit.depositDate,
        maturityDate: deposit.maturityDate,
        timeUntilMaturity: deposit.timeUntilMaturity,
      };
      setSelectedPosition(position);
      setShowWithdrawModal(true);
    } else if (action === 'view') {
      alert('View Details functionality coming soon!');
    }
  };

  // Fonctions de gestion des actions
  const handleAddMore = (position: Position) => {
    // Pour l'instant, on affiche juste une alerte
    alert('Add More functionality coming soon!');
  };

  const handleWithdraw = (position: Position) => {
    setSelectedPosition(position);
    setShowWithdrawModal(true);
  };

  // Fonction pour calculer le yield basé sur le temps écoulé (comme dans le smart contract)
  const calculateYieldFromTime = (position: Position) => {
    const now = Date.now() / 1000; // timestamp actuel en secondes
    const depositTimestamp = new Date(position.depositDate).getTime() / 1000;
    const elapsed = Math.max(0, now - depositTimestamp);
    const secondsInYear = 31_536_000;
    
    // Calcul identique au smart contract
    const yieldAmount = (position.deposited * position.apy * elapsed) / (100 * secondsInYear);
    return yieldAmount;
  };

  const handleConfirmWithdraw = async () => {
    if (!selectedPosition || !redeem) return;
    
    setIsWithdrawing(true);
    try {
      console.log('Starting redeem process for position:', selectedPosition.id);
      
      const depositAddress = new PublicKey(selectedPosition.id);
      const withPenalty = selectedPosition.timeUntilMaturity > 0;
      
      console.log('Redeem parameters:', {
        depositAddress: depositAddress.toString(),
        withPenalty,
      });
      
      const result = await redeem(depositAddress, withPenalty);
      
      console.log('Redeem successful:', result);
      
      // Rafraîchir les données
      await Promise.all([
        refetchDeposits(),
        refetchStrategies()
      ]);
      
      // Fermer le modal
      setShowWithdrawModal(false);
      setSelectedPosition(null);
      
      // Afficher un message de succès
      alert(`${withPenalty ? 'Early redemption' : 'Withdrawal'} successful! Transaction: ${result.signature}`);
      
    } catch (error) {
      console.error('Redeem error:', error);
      alert(`${selectedPosition.timeUntilMaturity > 0 ? 'Early redemption' : 'Withdrawal'} failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsWithdrawing(false);
    }
  };

  // Fonction pour gérer le refresh avec feedback visuel
  const handleRefresh = async () => {
    setIsRefreshing(true);
    setRefreshMessage('Refreshing portfolio data...');
    
    try {
      // Actualiser les dépôts et les stratégies en parallèle
      await Promise.all([
        refetchDeposits(),
        refetchStrategies()
      ]);
      
      setRefreshMessage('Portfolio data refreshed successfully!');
      
      // Effacer le message après 2 secondes
      setTimeout(() => {
        setRefreshMessage(null);
      }, 2000);
      
    } catch (error) {
      console.error('Refresh error:', error);
      setRefreshMessage('Failed to refresh portfolio data');
      
      // Effacer le message d'erreur après 3 secondes
      setTimeout(() => {
        setRefreshMessage(null);
      }, 3000);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleCancelWithdraw = () => {
    setShowWithdrawModal(false);
    setSelectedPosition(null);
  };

  return (
    <section className="py-24 px-6 relative min-h-screen" id="portfolio" style={{ transform: 'translateZ(0)', backfaceVisibility: 'hidden' }}>
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex justify-center items-center gap-4 mb-6">
            <h2 className="text-5xl md:text-6xl font-bold">
              <span className="text-white">Your</span>
              <span className="yieldx-text-gradient ml-4">Portfolio</span>
            </h2>
            
            {/* Demo Mode Toggle */}
            <button
              onClick={() => setIsDemoMode(!isDemoMode)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all duration-300 ${
                isDemoMode
                  ? 'bg-blue-500/20 border-blue-400/30 text-blue-300'
                  : 'bg-gray-700/20 border-gray-600/30 text-gray-400 hover:text-white'
              }`}
            >
              {isDemoMode ? <EyeIcon className="w-4 h-4" /> : <EyeSlashIcon className="w-4 h-4" />}
              <span className="text-sm font-medium">
                {isDemoMode ? 'Demo Mode' : 'Live Data'}
              </span>
            </button>
          </div>
          
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            {isDemoMode 
              ? 'Explore the portfolio interface with sample data. Toggle to "Live Data" to see your real positions.'
              : 'Track your yield farming performance and manage your active positions.'
            }
          </p>
          
          {isDemoMode && (
            <div className="mt-4 p-3 bg-blue-500/10 border border-blue-400/20 rounded-lg max-w-md mx-auto">
              <p className="text-blue-300 text-sm">
                🎯 Demo mode active - showing fictional portfolio data for demonstration
              </p>
            </div>
          )}
        </motion.div>

        {/* Portfolio Stats */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="glass-card p-6 rounded-2xl border border-white/10">
            <div className="text-3xl font-bold gradient-text mb-2">
              {isLoading ? '...' : `$${portfolioStats.totalValue.toFixed(2)}`}
            </div>
            <div className="text-white/60 text-sm uppercase tracking-wider">
              Total Value
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-white/10">
            <div className="text-3xl font-bold text-green-400 mb-2">
              {isLoading ? '...' : `$${portfolioStats.totalRewards.toFixed(2)}`}
            </div>
            <div className="text-white/60 text-sm uppercase tracking-wider">
              Total Rewards
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-white/10">
            <div className="text-3xl font-bold text-blue-400 mb-2">
              {isLoading ? '...' : `+${portfolioStats.totalReturn.toFixed(1)}%`}
            </div>
            <div className="text-white/60 text-sm uppercase tracking-wider">
              Total Return
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-white/10">
            <div className="text-3xl font-bold text-purple-400 mb-2">
              {isLoading ? '...' : portfolioStats.activePositions}
            </div>
            <div className="text-white/60 text-sm uppercase tracking-wider">
              Active Positions
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          className="flex space-x-2 mb-8 p-1 yieldx-card-glass rounded-xl border border-white/10 w-fit mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {['overview', 'positions'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as 'overview' | 'positions')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 capitalize ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white border border-blue-500/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab}
            </button>
          ))}
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="min-h-[700px]"
          style={{ 
            willChange: 'transform',
            transform: 'translateZ(0)',
            backfaceVisibility: 'hidden'
          }}
        >
          {activeTab === 'overview' && (
            <div className="space-y-8" style={{ 
              transform: 'translateZ(0)', 
              backfaceVisibility: 'hidden',
              willChange: 'transform'
            }}>
              {/* Overview Header with Refresh Button */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Portfolio Overview</h2>
                  <p className="text-gray-400">Monitor your portfolio performance and analytics</p>
                </div>
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing || depositsLoading || strategiesLoading}
                  className={`flex items-center gap-2 px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gray-700/50 ${
                    (isRefreshing || depositsLoading || strategiesLoading) 
                      ? 'text-gray-500 cursor-not-allowed' 
                      : 'text-gray-300 hover:text-white'
                  }`}
                  title="Refresh portfolio data"
                >
                  <RefreshCw className={`w-4 h-4 ${(isRefreshing || depositsLoading || strategiesLoading) ? 'animate-spin' : ''}`} />
                  {isRefreshing ? 'Refreshing...' : 'Refresh'}
                </button>
              </div>

              {/* Overview Stats Cards - Always show, with demo or real data */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="yieldx-card-glass p-6 rounded-xl border border-white/10">
                  <div className="text-2xl font-bold text-blue-400 mb-2">
                    {isLoading ? '...' : isDemoMode && mockStats ? 
                      `${mockStats.portfolioGrowth.toFixed(1)}%` : 
                      portfolioStats.totalReturn > 0 ? `+${(portfolioStats.totalReturn * 0.3).toFixed(1)}%` : '0.0%'
                    }
                  </div>
                  <div className="text-white/60 text-sm uppercase tracking-wider">
                    30-Day Growth
                  </div>
                </div>
                
                <div className="yieldx-card-glass p-6 rounded-xl border border-white/10">
                  <div className="text-2xl font-bold text-green-400 mb-2">
                    {isLoading ? '...' : isDemoMode && mockStats ? 
                      `$${mockStats.monthlyEarnings.toFixed(0)}` : 
                      portfolioStats.totalRewards > 0 ? `$${(portfolioStats.totalRewards * 1.2).toFixed(0)}` : '$0'
                    }
                  </div>
                  <div className="text-white/60 text-sm uppercase tracking-wider">
                    Monthly Earnings
                  </div>
                </div>
                
                <div className="yieldx-card-glass p-6 rounded-xl border border-white/10">
                  <div className="text-2xl font-bold text-purple-400 mb-2">
                    {isLoading ? '...' : isDemoMode && mockStats ? 
                      `${mockStats.avgAPY.toFixed(1)}%` : 
                      positions.length > 0 ? `${(positions.reduce((sum, p) => sum + p.apy, 0) / positions.length).toFixed(1)}%` : '0.0%'
                    }
                  </div>
                  <div className="text-white/60 text-sm uppercase tracking-wider">
                    Weighted Avg APY
                  </div>
                </div>
                
                <div className="yieldx-card-glass p-6 rounded-xl border border-white/10">
                  <div className="text-2xl font-bold text-yellow-400 mb-2">
                    {isLoading ? '...' : isDemoMode ? 
                      mockPositions.filter(p => p.status === 'Active').length : 
                      positions.filter(p => p.status === 'Active').length
                    }
                  </div>
                  <div className="text-white/60 text-sm uppercase tracking-wider">
                    Active Strategies
                  </div>
                </div>
              </div>

              {/* Charts Section */}
              {isDemoMode && !isMockLoading && chartData.performance.length > 0 ? (
                <div className="space-y-8">
                  {/* Portfolio Performance Chart */}
                  <PortfolioLineChart 
                    data={chartData.performance}
                    title="Portfolio Value Over Time"
                    height={350}
                  />

                  {/* Charts Grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Asset Allocation */}
                    <PortfolioPieChart 
                      data={chartData.assetAllocation}
                      title="Asset Allocation"
                      height={400}
                    />

                    {/* Rewards Chart */}
                    <RewardsAreaChart 
                      data={chartData.rewards}
                      title="Daily & Cumulative Rewards"
                      height={400}
                    />
                  </div>

                  {/* Strategy Performance Chart */}
                  <PortfolioBarChart 
                    data={chartData.strategyPerformance}
                    title="Strategy Performance (APY vs Value)"
                    height={400}
                  />
                </div>
              ) : (
                /* Chart Placeholders */
                <div className="yieldx-card-glass p-8 rounded-2xl border border-white/10">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-white mb-4">
                      Portfolio Performance
                    </h3>
                    <p className="text-gray-300 mb-8">
                      {isDemoMode 
                        ? (isMockLoading ? 'Loading interactive charts...' : 'Interactive charts will be integrated with real-time data from the API.')
                        : 'Detailed analytics coming soon. Connect with our API to track real-time performance.'
                      }
                    </p>
                    <div className="h-64 yieldx-card-glass rounded-xl flex items-center justify-center border border-white/10">
                      <div className="text-center">
                        <div className="w-16 h-16 yieldx-card-glass rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/20">
                          <ChartBarIcon className="w-8 h-8 text-blue-400" />
                        </div>
                        <p className="text-gray-400">
                          {isMockLoading ? 'Loading Charts...' : 'Performance Chart'}
                        </p>
                        <p className="text-rgb(var(--yieldx-text-tertiary)) text-sm">
                          {isDemoMode 
                            ? (isMockLoading ? 'Preparing Demo Data' : 'Demo Mode - Chart Placeholder')
                            : 'Coming Soon'
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Strategy Breakdown - Show in both modes */}
              <div className="yieldx-card-glass p-8 rounded-2xl border border-white/10">
                <h3 className="text-2xl font-bold text-white mb-6">Strategy Breakdown</h3>
                
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-spin">
                      <span className="text-white text-lg">⏳</span>
                    </div>
                    <p className="text-gray-400">Loading strategy breakdown...</p>
                  </div>
                ) : positions.length === 0 && !isDemoMode ? (
                  <div className="text-center py-8">
                    <p className="text-gray-400 mb-4">No positions to analyze yet.</p>
                    <p className="text-gray-500 text-sm">Your strategy breakdown will appear here once you start investing.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {isDemoMode ? (
                      // Demo mode: Show risk-based breakdown
                      ['Low', 'Medium', 'High'].map((risk) => {
                        const riskPositions = mockPositions.filter(p => p.riskLevel === risk);
                        const riskValue = riskPositions.reduce((sum, p) => sum + p.currentValue, 0);
                        const percentage = mockStats ? ((riskValue / mockStats.totalValue) * 100).toFixed(1) : '0';
                        
                        return (
                          <div key={risk} className="yieldx-card-glass p-4 rounded-lg border border-white/10">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-white font-medium">{risk} Risk</span>
                              <span className={`px-2 py-1 rounded text-xs ${getRiskLevelColor(risk as any)}`}>
                                {riskPositions.length} positions
                              </span>
                            </div>
                            <div className="text-lg font-bold text-white">${riskValue.toFixed(2)}</div>
                            <div className="text-sm text-gray-400">{percentage}% of portfolio</div>
                          </div>
                        );
                      })
                    ) : (
                      // Live mode: Show token-based breakdown
                      Object.entries(
                        positions.reduce((acc, pos) => {
                          acc[pos.token] = (acc[pos.token] || 0) + pos.currentValue;
                          return acc;
                        }, {} as Record<string, number>)
                      ).map(([token, value]) => {
                        const percentage = portfolioStats.totalValue > 0 ? 
                          ((value / portfolioStats.totalValue) * 100).toFixed(1) : '0';
                        const tokenPositions = positions.filter(p => p.token === token);
                        
                        return (
                          <div key={token} className="yieldx-card-glass p-4 rounded-lg border border-white/10">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-white font-medium">{token}</span>
                              <span className="px-2 py-1 rounded text-xs bg-blue-500/10 text-blue-300 border border-blue-500/20">
                                {tokenPositions.length} positions
                              </span>
                            </div>
                            <div className="text-lg font-bold text-white">${value.toFixed(2)}</div>
                            <div className="text-sm text-gray-400">{percentage}% of portfolio</div>
                          </div>
                        );
                      })
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'positions' && (
            <div className="space-y-6" style={{ 
              transform: 'translateZ(0)', 
              backfaceVisibility: 'hidden',
              willChange: 'transform',
              position: 'relative'
            }}>
              {(!connected && !isDemoMode) ? (
                <div className="yieldx-card-glass p-8 text-center">
                  <div className="w-16 h-16 yieldx-card-neon rounded-full flex items-center justify-center mx-auto mb-4">
                    <LockClosedIcon className="w-8 h-8 text-rgb(var(--yieldx-electric-blue))" />
                  </div>
                  <h3 className="text-xl font-bold text-rgb(var(--yieldx-text-primary)) mb-2">
                    Connect Your Wallet
                  </h3>
                  <p className="text-rgb(var(--yieldx-text-secondary)) mb-4">
                    Please connect your wallet to view your positions, or enable demo mode to explore the interface.
                  </p>
                  <button 
                    onClick={() => setIsDemoMode(true)}
                    className="yieldx-btn-ghost text-sm"
                  >
                    Try Demo Mode
                  </button>
                </div>
              ) : isLoading ? (
                <div className="glass-card p-8 rounded-2xl border border-white/10 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-spin">
                    <span className="text-white text-2xl">⏳</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    {isDemoMode ? 'Loading Demo Data...' : 'Loading Positions...'}
                  </h3>
                  <p className="text-white/60">
                    {isDemoMode 
                      ? 'Simulating API calls and preparing demo portfolio...'
                      : 'Fetching your portfolio data from the blockchain'
                    }
                  </p>
                </div>
              ) : (!isDemoMode && depositsError) ? (
                <div className="yieldx-card-glass p-8 border border-rgb(var(--yieldx-plasma-pink))/20 text-center">
                  <div className="w-16 h-16 bg-rgb(var(--yieldx-plasma-pink))/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <XMarkIcon className="w-8 h-8 text-rgb(var(--yieldx-plasma-pink))" />
                  </div>
                  <h3 className="text-xl font-bold text-rgb(var(--yieldx-plasma-pink)) mb-2">
                    Error Loading Positions
                  </h3>
                  <p className="text-rgb(var(--yieldx-text-secondary)) mb-4">
                    {depositsError}
                  </p>
                  <button 
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white font-medium rounded-lg hover:from-red-600 hover:to-pink-700 transition-all duration-300 text-sm"
                  >
                    Retry
                  </button>
                </div>
              ) : (deposits && deposits.length === 0) ? (
                <div className="yieldx-card-glass p-8 text-center">
                  <div className="w-16 h-16 yieldx-card-neon rounded-full flex items-center justify-center mx-auto mb-4">
                    <ChartBarIcon className="w-8 h-8 text-rgb(var(--yieldx-electric-blue))" />
                  </div>
                  <h3 className="text-xl font-bold text-rgb(var(--yieldx-text-primary)) mb-2">
                    No Positions Yet
                  </h3>
                  <p className="text-rgb(var(--yieldx-text-secondary)) mb-4">
                    You don't have any active positions. Start by depositing into a strategy!
                  </p>
                  <button 
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="yieldx-btn-primary text-sm"
                  >
                    Browse Strategies
                  </button>
                </div>
              ) : (
                <div className="space-y-6" style={{ 
                  transform: 'translateZ(0)', 
                  backfaceVisibility: 'hidden',
                  willChange: 'transform'
                }}>
                  {/* Demo Mode Indicator */}
                  {isDemoMode && (
                    <div className="yieldx-card-glass p-4 rounded-xl border border-blue-400/20 bg-blue-500/5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                          <EyeIcon className="w-4 h-4 text-blue-400" />
                        </div>
                        <div>
                          <p className="text-blue-300 font-medium text-sm">Demo Portfolio Active</p>
                          <p className="text-blue-400/70 text-xs">
                            Showing interactive positions with advanced filtering and sorting
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Filters and Controls */}
                  <div className="space-y-4 mb-6" style={{ 
                    willChange: 'transform',
                    transform: 'translateZ(0)',
                    backfaceVisibility: 'hidden'
                  }}>
                    {/* Filters */}
                    <UserDepositsFiltersComponent
                      filters={filters}
                      onUpdateFilters={updateFilters}
                      onResetFilters={resetFilters}
                      filterOptions={filterOptions}
                      totalResults={filteredDeposits.length}
                    />

                    {/* View Mode and Sort Controls */}
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                      {/* View Mode Selector */}
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-400 font-medium">View:</span>
                        <div className="flex bg-gray-800/50 rounded-lg p-1 border border-gray-700/50">
                          <button
                            onClick={() => handleViewModeChange('grid')}
                            className={`p-2 rounded-md transition-all duration-200 ${
                              viewMode === 'grid' 
                                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                            }`}
                          >
                            <Grid className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleViewModeChange('list')}
                            className={`p-2 rounded-md transition-all duration-200 ${
                              viewMode === 'list' 
                                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                            }`}
                          >
                            <List className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleViewModeChange('table')}
                            className={`p-2 rounded-md transition-all duration-200 ${
                              viewMode === 'table' 
                                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                            }`}
                          >
                            <Table className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Sort Controls and Refresh */}
                      <div className="flex items-center gap-3">
                        {/* Refresh Button */}
                        <button
                          onClick={handleRefresh}
                          disabled={isRefreshing || depositsLoading}
                          className={`flex items-center gap-2 px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-gray-700/50 ${
                            (isRefreshing || depositsLoading) 
                              ? 'text-gray-500 cursor-not-allowed' 
                              : 'text-gray-300 hover:text-white'
                          }`}
                          title="Refresh positions"
                        >
                          <RefreshCw className={`w-4 h-4 ${(isRefreshing || depositsLoading) ? 'animate-spin' : ''}`} />
                          {isRefreshing ? 'Refreshing...' : 'Refresh'}
                        </button>
                        
                        <span className="text-sm text-gray-400 font-medium">Sort by:</span>
                        <div className="flex items-center gap-2">
                          <select
                            value={sortBy}
                            onChange={(e) => handleSortChange(e.target.value as any, sortDirection)}
                            className="bg-gray-800/50 border border-gray-700/50 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                          >
                            <option value="amount">Amount</option>
                            <option value="yieldAmount">Yield Amount</option>
                            <option value="apy">APY</option>
                            <option value="depositDate">Deposit Date</option>
                            <option value="maturityDate">Maturity Date</option>
                          </select>
                          <button
                            onClick={() => handleSortChange(sortBy, sortDirection === 'asc' ? 'desc' : 'asc')}
                            className="p-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700/50 transition-all duration-200"
                          >
                            {sortDirection === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Results Summary */}
                    <div className="text-sm text-gray-400 flex items-center justify-between">
                      <span>
                        Showing {paginationInfo.startIndex + 1}-{Math.min(paginationInfo.endIndex, filteredDeposits.length)} of {filteredDeposits.length} positions
                      </span>
                      <span>
                        Total Value: {formatCurrency(paginationStats.totalValue)}
                      </span>
                    </div>
                  </div>

                  {/* Positions Display */}
                  <div className="transition-all duration-300" style={{ 
                    willChange: 'transform',
                    transform: 'translateZ(0)',
                    backfaceVisibility: 'hidden',
                    position: 'relative'
                  }}>
                    <div className="space-y-4">
                      {viewMode === 'grid' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max transition-all duration-300">
                          {paginatedDeposits.map((deposit) => (
                            <UserDepositCard
                              key={deposit.publicKey}
                              deposit={deposit}
                              onAction={handlePositionAction}
                            />
                          ))}
                        </div>
                      )}

                      {viewMode === 'list' && (
                        <div className="space-y-4 transition-all duration-300">
                          {paginatedDeposits.map((deposit) => (
                            <UserDepositListItem
                              key={deposit.publicKey}
                              deposit={deposit}
                              onAction={handlePositionAction}
                            />
                          ))}
                        </div>
                      )}

                      {viewMode === 'table' && (
                        <div className="transition-all duration-300">
                          <UserDepositTable
                            deposits={paginatedDeposits}
                            onAction={handlePositionAction}
                            sortBy={sortBy}
                            sortOrder={sortDirection}
                            onSort={(field: string) => handleSort(field)}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Pagination */}
                  {paginationInfo.totalPages > 1 && (
                    <div className="flex justify-center">
                      <YieldPagination
                        currentPage={paginationInfo.currentPage}
                        totalPages={paginationInfo.totalPages}
                        totalItems={filteredDeposits.length}
                        itemsPerPage={6}
                        startIndex={paginationInfo.startIndex}
                        endIndex={paginationInfo.endIndex}
                        onPageChange={goToPage}
                        onNextPage={goToNextPage}
                        onPreviousPage={goToPreviousPage}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>

      {/* Withdraw Confirmation Modal */}
      {showWithdrawModal && selectedPosition && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <motion.div
            className="yieldx-card-glass p-8 rounded-2xl border border-white/30 max-w-md w-full shadow-2xl"
            style={{
              background: 'rgba(20, 20, 25, 0.95)',
              backdropFilter: 'blur(20px)',
            }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-2xl font-bold text-white mb-6">
              {selectedPosition.timeUntilMaturity > 0 ? 'Early Redemption Warning' : 'Confirm Withdrawal'}
            </h3>

            {selectedPosition.timeUntilMaturity > 0 ? (
              <div className="space-y-6">
                <div className="bg-orange-500/25 border border-orange-400/50 rounded-xl p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <ExclamationTriangleIcon className="w-6 h-6 text-orange-300" />
                    <span className="text-orange-200 font-semibold text-lg">Penalty Warning</span>
                  </div>
                  <p className="text-gray-100 text-sm leading-relaxed">
                    Your position has not reached maturity yet. Early redemption will result in a 10% penalty on the total amount.
                  </p>
                </div>

                <div className="space-y-3 text-sm bg-gray-800/60 border border-gray-700/50 p-4 rounded-lg">
                  {(() => {
                    const currentYield = calculateYieldFromTime(selectedPosition);
                    const totalBeforePenalty = selectedPosition.deposited + currentYield;
                    const penalty = totalBeforePenalty * 0.1;
                    const finalAmount = totalBeforePenalty - penalty;
                    
                    return (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-200">Original Amount:</span>
                          <span className="text-white font-medium">{formatCurrency(selectedPosition.deposited)} {selectedPosition.token}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-200">Current Yield (time-based):</span>
                          <span className="text-green-300 font-medium">+{formatCurrency(currentYield)} {selectedPosition.token}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-200">Total Before Penalty:</span>
                          <span className="text-white">{formatCurrency(totalBeforePenalty)} {selectedPosition.token}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-200">Time Until Maturity:</span>
                          <span className="text-orange-300">{formatTimeRemaining(selectedPosition.timeUntilMaturity)}</span>
                        </div>
                        <div className="flex justify-between border-t border-white/20 pt-2">
                          <span className="text-gray-200">Penalty (10% of total):</span>
                          <span className="text-red-300 font-medium">-{formatCurrency(penalty)} {selectedPosition.token}</span>
                        </div>
                        <div className="flex justify-between font-semibold">
                          <span className="text-white">You'll Receive:</span>
                          <span className="text-white">{formatCurrency(finalAmount)} {selectedPosition.token}</span>
                        </div>
                      </>
                    );
                  })()}
                </div>

                <p className="text-gray-300 text-xs">
                  * Yield is calculated proportionally based on time elapsed since deposit. A 10% penalty is applied to the total amount (principal + time-based yield) for early redemption.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-green-500/25 border border-green-400/50 rounded-xl p-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <CheckCircleIcon className="w-5 h-5 text-green-300" />
                    <span className="text-green-200 font-semibold">Position Matured</span>
                  </div>
                  <p className="text-gray-100 text-sm">
                    Your position has reached maturity. You can withdraw without any penalties.
                  </p>
                </div>

                <div className="space-y-2 text-sm bg-gray-800/60 border border-gray-700/50 p-4 rounded-lg">
                  {(() => {
                    const currentYield = calculateYieldFromTime(selectedPosition);
                    const totalAmount = selectedPosition.deposited + currentYield;
                    
                    return (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-200">Original Amount:</span>
                          <span className="text-white">{formatCurrency(selectedPosition.deposited)} {selectedPosition.token}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-200">Total Yield (time-based):</span>
                          <span className="text-purple-300">+{formatCurrency(currentYield)} {selectedPosition.token}</span>
                        </div>
                        <div className="flex justify-between font-semibold border-t border-white/20 pt-2">
                          <span className="text-white">You'll Receive:</span>
                          <span className="text-green-300">{formatCurrency(totalAmount)} {selectedPosition.token}</span>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            )}

            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleCancelWithdraw}
                className="flex-1 px-4 py-2 bg-gray-700/60 border border-gray-600/50 text-gray-200 font-medium rounded-lg hover:bg-gray-600/60 hover:text-white transition-all duration-300"
                disabled={isWithdrawing}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmWithdraw}
                className={`flex-1 px-4 py-2 font-medium rounded-lg transition-all duration-300 ${
                  selectedPosition.timeUntilMaturity > 0
                    ? 'bg-orange-600 hover:bg-orange-700 text-white border border-orange-500/50'
                    : 'bg-green-600 hover:bg-green-700 text-white border border-green-500/50'
                }`}
                disabled={isWithdrawing}
              >
                {isWithdrawing ? 'Processing...' : selectedPosition.timeUntilMaturity > 0 ? 'Redeem Early' : 'Withdraw'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
      
      {/* Notification Toast */}
      {refreshMessage && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-4 right-4 z-50 max-w-sm"
        >
          <div className={`p-4 rounded-lg border backdrop-blur-sm ${
            refreshMessage.includes('success') 
              ? 'bg-green-500/10 border-green-500/30 text-green-300'
              : refreshMessage.includes('Failed') 
                ? 'bg-red-500/10 border-red-500/30 text-red-300'
                : 'bg-blue-500/10 border-blue-500/30 text-blue-300'
          }`}>
            <div className="flex items-center gap-2">
              <RefreshCw className={`w-4 h-4 ${refreshMessage.includes('Refreshing') ? 'animate-spin' : ''}`} />
              <span className="text-sm font-medium">{refreshMessage}</span>
            </div>
          </div>
        </motion.div>
      )}
    </section>
  );
};

export default ModernPortfolioSection;
