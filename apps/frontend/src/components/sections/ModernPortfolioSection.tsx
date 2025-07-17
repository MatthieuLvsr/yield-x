'use client';

import {
  ChartBarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  EyeSlashIcon,
  LockClosedIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { motion } from 'framer-motion';
import {
  ArrowUpDown,
  Grid,
  List,
  RefreshCw,
  SortAsc,
  SortDesc,
  Table,
} from 'lucide-react';
import type React from 'react';
import { useEffect, useMemo, useState } from 'react';
import UserDepositsFiltersComponent from '@/components/filters/UserDepositsFilters';
import PortfolioBarChart from '@/components/ui/PortfolioBarChart';
import PortfolioLineChart from '@/components/ui/PortfolioLineChart';
import PortfolioPieChart from '@/components/ui/PortfolioPieChart';
import RewardsAreaChart from '@/components/ui/RewardsAreaChart';
import { UserDepositCard } from '@/components/ui/UserDepositCard';
import { UserDepositListItem } from '@/components/ui/UserDepositListItem';
import { UserDepositTable } from '@/components/ui/UserDepositTable';
import YieldPagination from '@/components/ui/YieldPagination';
import { useStrategies } from '@/hooks/useStrategies';
import { useUserDeposits } from '@/hooks/useUserDeposits';
import { useUserDepositsPagination } from '@/hooks/useUserDepositsPagination';
import { useYieldProgram } from '@/hooks/useYieldProgram';
import { isDemoModeEnabled, isUsingMockData } from '@/lib/config';
import {
  formatCurrency,
  formatDate,
  formatTimeRemaining,
} from '@/lib/formatters';
import {
  getMockPortfolioStats,
  getMockPositions,
  getRiskLevelColor,
  type MockPortfolioStats,
  type MockPosition,
  mockAPI,
} from '@/lib/mockData';

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
    case 'Active':
      return 'text-green-400 bg-green-400/10 border-green-400/20';
    case 'Pending':
      return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
    case 'Withdrawing':
      return 'text-red-400 bg-red-400/10 border-red-400/20';
    default:
      return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
  }
};

const ModernPortfolioSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'positions'>(
    'overview'
  );
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(
    null
  );
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshMessage, setRefreshMessage] = useState<string | null>(null);

  // Use environment configuration for demo mode
  const [isDemoMode, setIsDemoMode] = useState(
    isUsingMockData() || isDemoModeEnabled()
  );

  // Debug: Log configuration values
  useEffect(() => {
    console.log('🔧 ModernPortfolioSection Configuration:', {
      isUsingMockData: isUsingMockData(),
      isDemoModeEnabled: isDemoModeEnabled(),
      isDemoMode,
      NODE_ENV: process.env.NODE_ENV,
      NEXT_PUBLIC_USE_MOCK_DATA: process.env.NEXT_PUBLIC_USE_MOCK_DATA,
      NEXT_PUBLIC_ENABLE_DEMO_MODE: process.env.NEXT_PUBLIC_ENABLE_DEMO_MODE,
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
    strategyPerformance: [],
  });

  const { connected } = useWallet();

  // Récupérer les données depuis les hooks (données réelles)
  const {
    deposits,
    enrichedDeposits,
    stats,
    isLoading: depositsLoading,
    error: depositsError,
    refetch: refetchDeposits,
  } = useUserDeposits();
  const {
    strategies,
    isLoading: strategiesLoading,
    refetch: refetchStrategies,
  } = useStrategies();
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
        mockAPI.getStrategyPerformance(),
      ])
        .then(
          ([
            stats,
            positions,
            performance,
            rewards,
            allocation,
            strategyPerf,
          ]) => {
            setMockStats(stats);
            setMockPositions(positions);
            setChartData({
              performance,
              rewards,
              assetAllocation: allocation,
              strategyPerformance: strategyPerf,
            });
            setIsMockLoading(false);
          }
        )
        .catch((error) => {
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
        strategyPerformance: [],
      });
    }
  }, [isDemoMode]);

  // Convertir les dépôts en positions formatées pour l'UI (données réelles)
  const realPositions = useMemo(() => {
    if (!(deposits && strategies)) return [];

    return deposits.map((deposit): Position => {
      // Trouver la stratégie correspondante
      const strategy = strategies.find(
        (s) => s.publicKey.toString() === deposit.strategyAddress
      );

      // Calculer les valeurs en unités de base (pour les calculs)
      const depositedBaseAmount = Number.parseFloat(deposit.amount);
      const yieldBaseAmount = Number.parseFloat(deposit.yieldAmount);
      const currentBaseValue = depositedBaseAmount + yieldBaseAmount;

      // Convertir en unités lisibles (diviser par 10^6 pour USDC)
      const USDC_DECIMALS = 6;
      const depositedAmount = depositedBaseAmount / 10 ** USDC_DECIMALS;
      const yieldAmount = yieldBaseAmount / 10 ** USDC_DECIMALS;
      const currentValue = currentBaseValue / 10 ** USDC_DECIMALS;

      const apy = Number.parseFloat(deposit.apy);

      // Déterminer le statut
      const status: 'Active' | 'Pending' | 'Withdrawing' = deposit.isMatured
        ? 'Active'
        : 'Pending';

      return {
        id: deposit.publicKey,
        strategy: strategy?.name || 'Unknown Strategy',
        token: strategy?.token || 'UNKNOWN',
        deposited: depositedAmount,
        currentValue,
        apy,
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
      return mockPositions.map(
        (mockPos): Position => ({
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
        })
      );
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
        activePositions: mockStats.activePositions,
      };
    }

    // Real data calculations
    const totalValue = positions.reduce(
      (sum, pos) => sum + pos.currentValue,
      0
    );
    const totalDeposited = positions.reduce(
      (sum, pos) => sum + pos.deposited,
      0
    );
    const totalRewards = positions.reduce((sum, pos) => sum + pos.rewards, 0);
    const totalReturn =
      totalDeposited > 0
        ? ((totalValue - totalDeposited) / totalDeposited) * 100
        : 0;

    return {
      totalValue,
      totalDeposited,
      totalRewards,
      totalReturn,
      activePositions: positions.length,
    };
  }, [isDemoMode, mockStats, positions]);

  // État de chargement global
  const isLoading = isDemoMode
    ? isMockLoading
    : depositsLoading || strategiesLoading;

  // Options de tri pour les positions
  const sortOptions = [
    { value: 'depositDate', label: 'Date de dépôt' },
    { value: 'amount', label: 'Montant' },
    { value: 'yieldAmount', label: 'Rendement' },
    { value: 'apy', label: 'APY' },
    { value: 'maturityDate', label: "Date d'échéance" },
  ];

  const handleSort = (option: string) => {
    const newDirection =
      sortBy === option && sortDirection === 'asc' ? 'desc' : 'asc';
    handleSortChange(option as any, newDirection as any);
  };

  // Gestionnaires d'actions pour les positions
  const handlePositionAction = (
    deposit: any,
    action: 'withdraw' | 'claim' | 'view'
  ) => {
    if (action === 'withdraw') {
      // Convertir le deposit en Position pour compatibilité avec le modal existant
      const position: Position = {
        id: deposit.publicKey,
        strategy: deposit.strategy?.name || deposit.strategyAddress.slice(0, 8),
        token:
          deposit.tokenSymbol || deposit.tokenAddress.slice(0, 4).toUpperCase(),
        deposited: Number.parseFloat(deposit.amount),
        currentValue:
          Number.parseFloat(deposit.amount) +
          Number.parseFloat(deposit.yieldAmount),
        apy: Number.parseFloat(deposit.apy),
        rewards: Number.parseFloat(deposit.yieldAmount),
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
    const yieldAmount =
      (position.deposited * position.apy * elapsed) / (100 * secondsInYear);
    return yieldAmount;
  };

  const handleConfirmWithdraw = async () => {
    if (!(selectedPosition && redeem)) return;

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
      await Promise.all([refetchDeposits(), refetchStrategies()]);

      // Fermer le modal
      setShowWithdrawModal(false);
      setSelectedPosition(null);

      // Afficher un message de succès
      alert(
        `${withPenalty ? 'Early redemption' : 'Withdrawal'} successful! Transaction: ${result.signature}`
      );
    } catch (error) {
      console.error('Redeem error:', error);
      alert(
        `${selectedPosition.timeUntilMaturity > 0 ? 'Early redemption' : 'Withdrawal'} failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
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
      await Promise.all([refetchDeposits(), refetchStrategies()]);

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
    <section
      className="relative min-h-screen px-6 py-24"
      id="portfolio"
      style={{ transform: 'translateZ(0)', backfaceVisibility: 'hidden' }}
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/3 h-96 w-96 rounded-full bg-indigo-500/5 blur-3xl" />
        <div className="absolute right-1/3 bottom-1/4 h-80 w-80 rounded-full bg-purple-500/5 blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto">
        {/* Section Header */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          <div className="mb-6 flex items-center justify-center gap-4">
            <h2 className="font-bold text-5xl md:text-6xl">
              <span className="text-white">Your</span>
              <span className="yieldx-text-gradient ml-4">Portfolio</span>
            </h2>

            {/* Demo Mode Toggle */}
            <button
              className={`flex items-center gap-2 rounded-lg border px-4 py-2 transition-all duration-300 ${
                isDemoMode
                  ? 'border-blue-400/30 bg-blue-500/20 text-blue-300'
                  : 'border-gray-600/30 bg-gray-700/20 text-gray-400 hover:text-white'
              }`}
              onClick={() => setIsDemoMode(!isDemoMode)}
            >
              {isDemoMode ? (
                <EyeIcon className="h-4 w-4" />
              ) : (
                <EyeSlashIcon className="h-4 w-4" />
              )}
              <span className="font-medium text-sm">
                {isDemoMode ? 'Demo Mode' : 'Live Data'}
              </span>
            </button>
          </div>

          <p className="mx-auto max-w-2xl text-gray-300 text-xl">
            {isDemoMode
              ? 'Explore the portfolio interface with sample data. Toggle to "Live Data" to see your real positions.'
              : 'Track your yield farming performance and manage your active positions.'}
          </p>

          {isDemoMode && (
            <div className="mx-auto mt-4 max-w-md rounded-lg border border-blue-400/20 bg-blue-500/10 p-3">
              <p className="text-blue-300 text-sm">
                🎯 Demo mode active - showing fictional portfolio data for
                demonstration
              </p>
            </div>
          )}
        </motion.div>

        {/* Portfolio Stats */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-4"
          initial={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="glass-card rounded-2xl border border-white/10 p-6">
            <div className="gradient-text mb-2 font-bold text-3xl">
              {isLoading ? '...' : `$${portfolioStats.totalValue.toFixed(2)}`}
            </div>
            <div className="text-sm text-white/60 uppercase tracking-wider">
              Total Value
            </div>
          </div>

          <div className="glass-card rounded-2xl border border-white/10 p-6">
            <div className="mb-2 font-bold text-3xl text-green-400">
              {isLoading ? '...' : `$${portfolioStats.totalRewards.toFixed(2)}`}
            </div>
            <div className="text-sm text-white/60 uppercase tracking-wider">
              Total Rewards
            </div>
          </div>

          <div className="glass-card rounded-2xl border border-white/10 p-6">
            <div className="mb-2 font-bold text-3xl text-blue-400">
              {isLoading ? '...' : `+${portfolioStats.totalReturn.toFixed(1)}%`}
            </div>
            <div className="text-sm text-white/60 uppercase tracking-wider">
              Total Return
            </div>
          </div>

          <div className="glass-card rounded-2xl border border-white/10 p-6">
            <div className="mb-2 font-bold text-3xl text-purple-400">
              {isLoading ? '...' : portfolioStats.activePositions}
            </div>
            <div className="text-sm text-white/60 uppercase tracking-wider">
              Active Positions
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="yieldx-card-glass mx-auto mb-8 flex w-fit space-x-2 rounded-xl border border-white/10 p-1"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {['overview', 'positions'].map((tab) => (
            <button
              className={`rounded-lg px-6 py-3 font-medium capitalize transition-all duration-300 ${
                activeTab === tab
                  ? 'border border-blue-500/30 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`}
              key={tab}
              onClick={() => setActiveTab(tab as 'overview' | 'positions')}
            >
              {tab}
            </button>
          ))}
        </motion.div>

        {/* Tab Content */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="min-h-[700px]"
          initial={{ opacity: 0, y: 20 }}
          key={activeTab}
          style={{
            willChange: 'transform',
            transform: 'translateZ(0)',
            backfaceVisibility: 'hidden',
          }}
          transition={{ duration: 0.5 }}
        >
          {activeTab === 'overview' && (
            <div
              className="space-y-8"
              style={{
                transform: 'translateZ(0)',
                backfaceVisibility: 'hidden',
                willChange: 'transform',
              }}
            >
              {/* Overview Header with Refresh Button */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="mb-2 font-bold text-2xl text-white">
                    Portfolio Overview
                  </h2>
                  <p className="text-gray-400">
                    Monitor your portfolio performance and analytics
                  </p>
                </div>
                <button
                  className={`flex items-center gap-2 rounded-lg border border-gray-700/50 bg-gray-800/50 px-4 py-2 font-medium text-sm transition-all duration-200 hover:bg-gray-700/50 ${
                    isRefreshing || depositsLoading || strategiesLoading
                      ? 'cursor-not-allowed text-gray-500'
                      : 'text-gray-300 hover:text-white'
                  }`}
                  disabled={
                    isRefreshing || depositsLoading || strategiesLoading
                  }
                  onClick={handleRefresh}
                  title="Refresh portfolio data"
                >
                  <RefreshCw
                    className={`h-4 w-4 ${isRefreshing || depositsLoading || strategiesLoading ? 'animate-spin' : ''}`}
                  />
                  {isRefreshing ? 'Refreshing...' : 'Refresh'}
                </button>
              </div>

              {/* Overview Stats Cards - Always show, with demo or real data */}
              <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                <div className="yieldx-card-glass rounded-xl border border-white/10 p-6">
                  <div className="mb-2 font-bold text-2xl text-blue-400">
                    {isLoading
                      ? '...'
                      : isDemoMode && mockStats
                        ? `${mockStats.portfolioGrowth.toFixed(1)}%`
                        : portfolioStats.totalReturn > 0
                          ? `+${(portfolioStats.totalReturn * 0.3).toFixed(1)}%`
                          : '0.0%'}
                  </div>
                  <div className="text-sm text-white/60 uppercase tracking-wider">
                    30-Day Growth
                  </div>
                </div>

                <div className="yieldx-card-glass rounded-xl border border-white/10 p-6">
                  <div className="mb-2 font-bold text-2xl text-green-400">
                    {isLoading
                      ? '...'
                      : isDemoMode && mockStats
                        ? `$${mockStats.monthlyEarnings.toFixed(0)}`
                        : portfolioStats.totalRewards > 0
                          ? `$${(portfolioStats.totalRewards * 1.2).toFixed(0)}`
                          : '$0'}
                  </div>
                  <div className="text-sm text-white/60 uppercase tracking-wider">
                    Monthly Earnings
                  </div>
                </div>

                <div className="yieldx-card-glass rounded-xl border border-white/10 p-6">
                  <div className="mb-2 font-bold text-2xl text-purple-400">
                    {isLoading
                      ? '...'
                      : isDemoMode && mockStats
                        ? `${mockStats.avgAPY.toFixed(1)}%`
                        : positions.length > 0
                          ? `${(positions.reduce((sum, p) => sum + p.apy, 0) / positions.length).toFixed(1)}%`
                          : '0.0%'}
                  </div>
                  <div className="text-sm text-white/60 uppercase tracking-wider">
                    Weighted Avg APY
                  </div>
                </div>

                <div className="yieldx-card-glass rounded-xl border border-white/10 p-6">
                  <div className="mb-2 font-bold text-2xl text-yellow-400">
                    {isLoading
                      ? '...'
                      : isDemoMode
                        ? mockPositions.filter((p) => p.status === 'Active')
                            .length
                        : positions.filter((p) => p.status === 'Active').length}
                  </div>
                  <div className="text-sm text-white/60 uppercase tracking-wider">
                    Active Strategies
                  </div>
                </div>
              </div>

              {/* Charts Section */}
              {isDemoMode &&
              !isMockLoading &&
              chartData.performance.length > 0 ? (
                <div className="space-y-8">
                  {/* Portfolio Performance Chart */}
                  <PortfolioLineChart
                    data={chartData.performance}
                    height={350}
                    title="Portfolio Value Over Time"
                  />

                  {/* Charts Grid */}
                  <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    {/* Asset Allocation */}
                    <PortfolioPieChart
                      data={chartData.assetAllocation}
                      height={400}
                      title="Asset Allocation"
                    />

                    {/* Rewards Chart */}
                    <RewardsAreaChart
                      data={chartData.rewards}
                      height={400}
                      title="Daily & Cumulative Rewards"
                    />
                  </div>

                  {/* Strategy Performance Chart */}
                  <PortfolioBarChart
                    data={chartData.strategyPerformance}
                    height={400}
                    title="Strategy Performance (APY vs Value)"
                  />
                </div>
              ) : (
                /* Chart Placeholders */
                <div className="yieldx-card-glass rounded-2xl border border-white/10 p-8">
                  <div className="text-center">
                    <h3 className="mb-4 font-bold text-2xl text-white">
                      Portfolio Performance
                    </h3>
                    <p className="mb-8 text-gray-300">
                      {isDemoMode
                        ? isMockLoading
                          ? 'Loading interactive charts...'
                          : 'Interactive charts will be integrated with real-time data from the API.'
                        : 'Detailed analytics coming soon. Connect with our API to track real-time performance.'}
                    </p>
                    <div className="yieldx-card-glass flex h-64 items-center justify-center rounded-xl border border-white/10">
                      <div className="text-center">
                        <div className="yieldx-card-glass mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-blue-500/20">
                          <ChartBarIcon className="h-8 w-8 text-blue-400" />
                        </div>
                        <p className="text-gray-400">
                          {isMockLoading
                            ? 'Loading Charts...'
                            : 'Performance Chart'}
                        </p>
                        <p className="text-rgb(var(--yieldx-text-tertiary)) text-sm">
                          {isDemoMode
                            ? isMockLoading
                              ? 'Preparing Demo Data'
                              : 'Demo Mode - Chart Placeholder'
                            : 'Coming Soon'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Strategy Breakdown - Show in both modes */}
              <div className="yieldx-card-glass rounded-2xl border border-white/10 p-8">
                <h3 className="mb-6 font-bold text-2xl text-white">
                  Strategy Breakdown
                </h3>

                {isLoading ? (
                  <div className="py-8 text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 animate-spin items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-600">
                      <span className="text-lg text-white">⏳</span>
                    </div>
                    <p className="text-gray-400">
                      Loading strategy breakdown...
                    </p>
                  </div>
                ) : positions.length === 0 && !isDemoMode ? (
                  <div className="py-8 text-center">
                    <p className="mb-4 text-gray-400">
                      No positions to analyze yet.
                    </p>
                    <p className="text-gray-500 text-sm">
                      Your strategy breakdown will appear here once you start
                      investing.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {isDemoMode
                      ? // Demo mode: Show risk-based breakdown
                        ['Low', 'Medium', 'High'].map((risk) => {
                          const riskPositions = mockPositions.filter(
                            (p) => p.riskLevel === risk
                          );
                          const riskValue = riskPositions.reduce(
                            (sum, p) => sum + p.currentValue,
                            0
                          );
                          const percentage = mockStats
                            ? (
                                (riskValue / mockStats.totalValue) *
                                100
                              ).toFixed(1)
                            : '0';

                          return (
                            <div
                              className="yieldx-card-glass rounded-lg border border-white/10 p-4"
                              key={risk}
                            >
                              <div className="mb-2 flex items-center justify-between">
                                <span className="font-medium text-white">
                                  {risk} Risk
                                </span>
                                <span
                                  className={`rounded px-2 py-1 text-xs ${getRiskLevelColor(risk as any)}`}
                                >
                                  {riskPositions.length} positions
                                </span>
                              </div>
                              <div className="font-bold text-lg text-white">
                                ${riskValue.toFixed(2)}
                              </div>
                              <div className="text-gray-400 text-sm">
                                {percentage}% of portfolio
                              </div>
                            </div>
                          );
                        })
                      : // Live mode: Show token-based breakdown
                        Object.entries(
                          positions.reduce(
                            (acc, pos) => {
                              acc[pos.token] =
                                (acc[pos.token] || 0) + pos.currentValue;
                              return acc;
                            },
                            {} as Record<string, number>
                          )
                        ).map(([token, value]) => {
                          const percentage =
                            portfolioStats.totalValue > 0
                              ? (
                                  (value / portfolioStats.totalValue) *
                                  100
                                ).toFixed(1)
                              : '0';
                          const tokenPositions = positions.filter(
                            (p) => p.token === token
                          );

                          return (
                            <div
                              className="yieldx-card-glass rounded-lg border border-white/10 p-4"
                              key={token}
                            >
                              <div className="mb-2 flex items-center justify-between">
                                <span className="font-medium text-white">
                                  {token}
                                </span>
                                <span className="rounded border border-blue-500/20 bg-blue-500/10 px-2 py-1 text-blue-300 text-xs">
                                  {tokenPositions.length} positions
                                </span>
                              </div>
                              <div className="font-bold text-lg text-white">
                                ${value.toFixed(2)}
                              </div>
                              <div className="text-gray-400 text-sm">
                                {percentage}% of portfolio
                              </div>
                            </div>
                          );
                        })}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'positions' && (
            <div
              className="space-y-6"
              style={{
                transform: 'translateZ(0)',
                backfaceVisibility: 'hidden',
                willChange: 'transform',
                position: 'relative',
              }}
            >
              {!(connected || isDemoMode) ? (
                <div className="yieldx-card-glass p-8 text-center">
                  <div className="yieldx-card-neon mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                    <LockClosedIcon className="h-8 w-8 text-rgb(var(--yieldx-electric-blue))" />
                  </div>
                  <h3 className="mb-2 font-bold text-rgb(var(--yieldx-text-primary)) text-xl">
                    Connect Your Wallet
                  </h3>
                  <p className="mb-4 text-rgb(var(--yieldx-text-secondary))">
                    Please connect your wallet to view your positions, or enable
                    demo mode to explore the interface.
                  </p>
                  <button
                    className="yieldx-btn-ghost text-sm"
                    onClick={() => setIsDemoMode(true)}
                  >
                    Try Demo Mode
                  </button>
                </div>
              ) : isLoading ? (
                <div className="glass-card rounded-2xl border border-white/10 p-8 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 animate-spin items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-600">
                    <span className="text-2xl text-white">⏳</span>
                  </div>
                  <h3 className="mb-2 font-bold text-white text-xl">
                    {isDemoMode
                      ? 'Loading Demo Data...'
                      : 'Loading Positions...'}
                  </h3>
                  <p className="text-white/60">
                    {isDemoMode
                      ? 'Simulating API calls and preparing demo portfolio...'
                      : 'Fetching your portfolio data from the blockchain'}
                  </p>
                </div>
              ) : !isDemoMode && depositsError ? (
                <div className="yieldx-card-glass border border-rgb(var(--yieldx-plasma-pink))/20 p-8 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-rgb(var(--yieldx-plasma-pink))/20">
                    <XMarkIcon className="h-8 w-8 text-rgb(var(--yieldx-plasma-pink))" />
                  </div>
                  <h3 className="mb-2 font-bold text-rgb(var(--yieldx-plasma-pink)) text-xl">
                    Error Loading Positions
                  </h3>
                  <p className="mb-4 text-rgb(var(--yieldx-text-secondary))">
                    {depositsError}
                  </p>
                  <button
                    className="rounded-lg bg-gradient-to-r from-red-500 to-pink-600 px-4 py-2 font-medium text-sm text-white transition-all duration-300 hover:from-red-600 hover:to-pink-700"
                    onClick={() => window.location.reload()}
                  >
                    Retry
                  </button>
                </div>
              ) : deposits && deposits.length === 0 ? (
                <div className="yieldx-card-glass p-8 text-center">
                  <div className="yieldx-card-neon mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                    <ChartBarIcon className="h-8 w-8 text-rgb(var(--yieldx-electric-blue))" />
                  </div>
                  <h3 className="mb-2 font-bold text-rgb(var(--yieldx-text-primary)) text-xl">
                    No Positions Yet
                  </h3>
                  <p className="mb-4 text-rgb(var(--yieldx-text-secondary))">
                    You don't have any active positions. Start by depositing
                    into a strategy!
                  </p>
                  <button
                    className="yieldx-btn-primary text-sm"
                    onClick={() =>
                      window.scrollTo({ top: 0, behavior: 'smooth' })
                    }
                  >
                    Browse Strategies
                  </button>
                </div>
              ) : (
                <div
                  className="space-y-6"
                  style={{
                    transform: 'translateZ(0)',
                    backfaceVisibility: 'hidden',
                    willChange: 'transform',
                  }}
                >
                  {/* Demo Mode Indicator */}
                  {isDemoMode && (
                    <div className="yieldx-card-glass rounded-xl border border-blue-400/20 bg-blue-500/5 p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/20">
                          <EyeIcon className="h-4 w-4 text-blue-400" />
                        </div>
                        <div>
                          <p className="font-medium text-blue-300 text-sm">
                            Demo Portfolio Active
                          </p>
                          <p className="text-blue-400/70 text-xs">
                            Showing interactive positions with advanced
                            filtering and sorting
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Filters and Controls */}
                  <div
                    className="mb-6 space-y-4"
                    style={{
                      willChange: 'transform',
                      transform: 'translateZ(0)',
                      backfaceVisibility: 'hidden',
                    }}
                  >
                    {/* Filters */}
                    <UserDepositsFiltersComponent
                      filterOptions={filterOptions}
                      filters={filters}
                      onResetFilters={resetFilters}
                      onUpdateFilters={updateFilters}
                      totalResults={filteredDeposits.length}
                    />

                    {/* View Mode and Sort Controls */}
                    <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
                      {/* View Mode Selector */}
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-400 text-sm">
                          View:
                        </span>
                        <div className="flex rounded-lg border border-gray-700/50 bg-gray-800/50 p-1">
                          <button
                            className={`rounded-md p-2 transition-all duration-200 ${
                              viewMode === 'grid'
                                ? 'border border-blue-500/30 bg-blue-500/20 text-blue-400'
                                : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
                            }`}
                            onClick={() => handleViewModeChange('grid')}
                          >
                            <Grid className="h-4 w-4" />
                          </button>
                          <button
                            className={`rounded-md p-2 transition-all duration-200 ${
                              viewMode === 'list'
                                ? 'border border-blue-500/30 bg-blue-500/20 text-blue-400'
                                : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
                            }`}
                            onClick={() => handleViewModeChange('list')}
                          >
                            <List className="h-4 w-4" />
                          </button>
                          <button
                            className={`rounded-md p-2 transition-all duration-200 ${
                              viewMode === 'table'
                                ? 'border border-blue-500/30 bg-blue-500/20 text-blue-400'
                                : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
                            }`}
                            onClick={() => handleViewModeChange('table')}
                          >
                            <Table className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {/* Sort Controls and Refresh */}
                      <div className="flex items-center gap-3">
                        {/* Refresh Button */}
                        <button
                          className={`flex items-center gap-2 rounded-lg border border-gray-700/50 bg-gray-800/50 px-3 py-2 font-medium text-sm transition-all duration-200 hover:bg-gray-700/50 ${
                            isRefreshing || depositsLoading
                              ? 'cursor-not-allowed text-gray-500'
                              : 'text-gray-300 hover:text-white'
                          }`}
                          disabled={isRefreshing || depositsLoading}
                          onClick={handleRefresh}
                          title="Refresh positions"
                        >
                          <RefreshCw
                            className={`h-4 w-4 ${isRefreshing || depositsLoading ? 'animate-spin' : ''}`}
                          />
                          {isRefreshing ? 'Refreshing...' : 'Refresh'}
                        </button>

                        <span className="font-medium text-gray-400 text-sm">
                          Sort by:
                        </span>
                        <div className="flex items-center gap-2">
                          <select
                            className="rounded-lg border border-gray-700/50 bg-gray-800/50 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                            onChange={(e) =>
                              handleSortChange(
                                e.target.value as any,
                                sortDirection
                              )
                            }
                            value={sortBy}
                          >
                            <option value="amount">Amount</option>
                            <option value="yieldAmount">Yield Amount</option>
                            <option value="apy">APY</option>
                            <option value="depositDate">Deposit Date</option>
                            <option value="maturityDate">Maturity Date</option>
                          </select>
                          <button
                            className="rounded-lg border border-gray-700/50 bg-gray-800/50 p-2 text-gray-400 transition-all duration-200 hover:bg-gray-700/50 hover:text-white"
                            onClick={() =>
                              handleSortChange(
                                sortBy,
                                sortDirection === 'asc' ? 'desc' : 'asc'
                              )
                            }
                          >
                            {sortDirection === 'asc' ? (
                              <SortAsc className="h-4 w-4" />
                            ) : (
                              <SortDesc className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Results Summary */}
                    <div className="flex items-center justify-between text-gray-400 text-sm">
                      <span>
                        Showing {paginationInfo.startIndex + 1}-
                        {Math.min(
                          paginationInfo.endIndex,
                          filteredDeposits.length
                        )}{' '}
                        of {filteredDeposits.length} positions
                      </span>
                      <span>
                        Total Value:{' '}
                        {formatCurrency(paginationStats.totalValue)}
                      </span>
                    </div>
                  </div>

                  {/* Positions Display */}
                  <div
                    className="transition-all duration-300"
                    style={{
                      willChange: 'transform',
                      transform: 'translateZ(0)',
                      backfaceVisibility: 'hidden',
                      position: 'relative',
                    }}
                  >
                    <div className="space-y-4">
                      {viewMode === 'grid' && (
                        <div className="grid auto-rows-max grid-cols-1 gap-6 transition-all duration-300 md:grid-cols-2 lg:grid-cols-3">
                          {paginatedDeposits.map((deposit) => (
                            <UserDepositCard
                              deposit={deposit}
                              key={deposit.publicKey}
                              onAction={handlePositionAction}
                            />
                          ))}
                        </div>
                      )}

                      {viewMode === 'list' && (
                        <div className="space-y-4 transition-all duration-300">
                          {paginatedDeposits.map((deposit) => (
                            <UserDepositListItem
                              deposit={deposit}
                              key={deposit.publicKey}
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
                            onSort={(field: string) => handleSort(field)}
                            sortBy={sortBy}
                            sortOrder={sortDirection}
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
                        endIndex={paginationInfo.endIndex}
                        itemsPerPage={6}
                        onNextPage={goToNextPage}
                        onPageChange={goToPage}
                        onPreviousPage={goToPreviousPage}
                        startIndex={paginationInfo.startIndex}
                        totalItems={filteredDeposits.length}
                        totalPages={paginationInfo.totalPages}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <motion.div
            animate={{ opacity: 1, scale: 1 }}
            className="yieldx-card-glass w-full max-w-md rounded-2xl border border-white/30 p-8 shadow-2xl"
            initial={{ opacity: 0, scale: 0.95 }}
            style={{
              background: 'rgba(20, 20, 25, 0.95)',
              backdropFilter: 'blur(20px)',
            }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="mb-6 font-bold text-2xl text-white">
              {selectedPosition.timeUntilMaturity > 0
                ? 'Early Redemption Warning'
                : 'Confirm Withdrawal'}
            </h3>

            {selectedPosition.timeUntilMaturity > 0 ? (
              <div className="space-y-6">
                <div className="rounded-xl border border-orange-400/50 bg-orange-500/25 p-4">
                  <div className="mb-3 flex items-center space-x-3">
                    <ExclamationTriangleIcon className="h-6 w-6 text-orange-300" />
                    <span className="font-semibold text-lg text-orange-200">
                      Penalty Warning
                    </span>
                  </div>
                  <p className="text-gray-100 text-sm leading-relaxed">
                    Your position has not reached maturity yet. Early redemption
                    will result in a 10% penalty on the total amount.
                  </p>
                </div>

                <div className="space-y-3 rounded-lg border border-gray-700/50 bg-gray-800/60 p-4 text-sm">
                  {(() => {
                    const currentYield =
                      calculateYieldFromTime(selectedPosition);
                    const totalBeforePenalty =
                      selectedPosition.deposited + currentYield;
                    const penalty = totalBeforePenalty * 0.1;
                    const finalAmount = totalBeforePenalty - penalty;

                    return (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-200">
                            Original Amount:
                          </span>
                          <span className="font-medium text-white">
                            {formatCurrency(selectedPosition.deposited)}{' '}
                            {selectedPosition.token}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-200">
                            Current Yield (time-based):
                          </span>
                          <span className="font-medium text-green-300">
                            +{formatCurrency(currentYield)}{' '}
                            {selectedPosition.token}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-200">
                            Total Before Penalty:
                          </span>
                          <span className="text-white">
                            {formatCurrency(totalBeforePenalty)}{' '}
                            {selectedPosition.token}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-200">
                            Time Until Maturity:
                          </span>
                          <span className="text-orange-300">
                            {formatTimeRemaining(
                              selectedPosition.timeUntilMaturity
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between border-white/20 border-t pt-2">
                          <span className="text-gray-200">
                            Penalty (10% of total):
                          </span>
                          <span className="font-medium text-red-300">
                            -{formatCurrency(penalty)} {selectedPosition.token}
                          </span>
                        </div>
                        <div className="flex justify-between font-semibold">
                          <span className="text-white">You'll Receive:</span>
                          <span className="text-white">
                            {formatCurrency(finalAmount)}{' '}
                            {selectedPosition.token}
                          </span>
                        </div>
                      </>
                    );
                  })()}
                </div>

                <p className="text-gray-300 text-xs">
                  * Yield is calculated proportionally based on time elapsed
                  since deposit. A 10% penalty is applied to the total amount
                  (principal + time-based yield) for early redemption.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="rounded-xl border border-green-400/50 bg-green-500/25 p-4">
                  <div className="mb-2 flex items-center space-x-3">
                    <CheckCircleIcon className="h-5 w-5 text-green-300" />
                    <span className="font-semibold text-green-200">
                      Position Matured
                    </span>
                  </div>
                  <p className="text-gray-100 text-sm">
                    Your position has reached maturity. You can withdraw without
                    any penalties.
                  </p>
                </div>

                <div className="space-y-2 rounded-lg border border-gray-700/50 bg-gray-800/60 p-4 text-sm">
                  {(() => {
                    const currentYield =
                      calculateYieldFromTime(selectedPosition);
                    const totalAmount =
                      selectedPosition.deposited + currentYield;

                    return (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-200">
                            Original Amount:
                          </span>
                          <span className="text-white">
                            {formatCurrency(selectedPosition.deposited)}{' '}
                            {selectedPosition.token}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-200">
                            Total Yield (time-based):
                          </span>
                          <span className="text-purple-300">
                            +{formatCurrency(currentYield)}{' '}
                            {selectedPosition.token}
                          </span>
                        </div>
                        <div className="flex justify-between border-white/20 border-t pt-2 font-semibold">
                          <span className="text-white">You'll Receive:</span>
                          <span className="text-green-300">
                            {formatCurrency(totalAmount)}{' '}
                            {selectedPosition.token}
                          </span>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            )}

            <div className="mt-6 flex space-x-3">
              <button
                className="flex-1 rounded-lg border border-gray-600/50 bg-gray-700/60 px-4 py-2 font-medium text-gray-200 transition-all duration-300 hover:bg-gray-600/60 hover:text-white"
                disabled={isWithdrawing}
                onClick={handleCancelWithdraw}
              >
                Cancel
              </button>
              <button
                className={`flex-1 rounded-lg px-4 py-2 font-medium transition-all duration-300 ${
                  selectedPosition.timeUntilMaturity > 0
                    ? 'border border-orange-500/50 bg-orange-600 text-white hover:bg-orange-700'
                    : 'border border-green-500/50 bg-green-600 text-white hover:bg-green-700'
                }`}
                disabled={isWithdrawing}
                onClick={handleConfirmWithdraw}
              >
                {isWithdrawing
                  ? 'Processing...'
                  : selectedPosition.timeUntilMaturity > 0
                    ? 'Redeem Early'
                    : 'Withdraw'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Notification Toast */}
      {refreshMessage && (
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-4 right-4 z-50 max-w-sm"
          exit={{ opacity: 0, y: -50 }}
          initial={{ opacity: 0, y: -50 }}
        >
          <div
            className={`rounded-lg border p-4 backdrop-blur-sm ${
              refreshMessage.includes('success')
                ? 'border-green-500/30 bg-green-500/10 text-green-300'
                : refreshMessage.includes('Failed')
                  ? 'border-red-500/30 bg-red-500/10 text-red-300'
                  : 'border-blue-500/30 bg-blue-500/10 text-blue-300'
            }`}
          >
            <div className="flex items-center gap-2">
              <RefreshCw
                className={`h-4 w-4 ${refreshMessage.includes('Refreshing') ? 'animate-spin' : ''}`}
              />
              <span className="font-medium text-sm">{refreshMessage}</span>
            </div>
          </div>
        </motion.div>
      )}
    </section>
  );
};

export default ModernPortfolioSection;
