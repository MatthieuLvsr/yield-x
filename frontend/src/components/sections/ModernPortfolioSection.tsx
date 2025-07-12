"use client";

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useUserDeposits } from '@/hooks/useUserDeposits';
import { useStrategies } from '@/hooks/useStrategies';
import { useYieldProgram } from '@/hooks/useYieldProgram';
import { useWallet } from '@solana/wallet-adapter-react';
import { formatCurrency, formatDate, formatTimeRemaining } from '@/lib/formatters';
import { PublicKey } from '@solana/web3.js';

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
  const { connected } = useWallet();
  
  // Récupérer les données depuis les hooks
  const { deposits, stats, isLoading: depositsLoading, error: depositsError, refetch } = useUserDeposits();
  const { strategies, isLoading: strategiesLoading } = useStrategies();
  const { redeem } = useYieldProgram();
  
  // Convertir les dépôts en positions formatées pour l'UI
  const positions = useMemo(() => {
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
  
  // Calculer les statistiques du portfolio
  const totalValue = positions.reduce((sum, pos) => sum + pos.currentValue, 0);
  const totalDeposited = positions.reduce((sum, pos) => sum + pos.deposited, 0);
  const totalRewards = positions.reduce((sum, pos) => sum + pos.rewards, 0);
  const totalReturn = totalDeposited > 0 ? ((totalValue - totalDeposited) / totalDeposited) * 100 : 0;
  
  // État de chargement global
  const isLoading = depositsLoading || strategiesLoading;

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
      await refetch();
      
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

  const handleCancelWithdraw = () => {
    setShowWithdrawModal(false);
    setSelectedPosition(null);
  };

  return (
    <section className="py-24 px-6 relative">
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
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="text-white">Your</span>
            <span className="gradient-text ml-4">Portfolio</span>
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Track your yield farming performance and manage your active positions.
          </p>
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
              {isLoading ? '...' : `$${totalValue.toFixed(2)}`}
            </div>
            <div className="text-white/60 text-sm uppercase tracking-wider">
              Total Value
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-white/10">
            <div className="text-3xl font-bold text-green-400 mb-2">
              {isLoading ? '...' : `$${totalRewards.toFixed(2)}`}
            </div>
            <div className="text-white/60 text-sm uppercase tracking-wider">
              Total Rewards
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-white/10">
            <div className="text-3xl font-bold text-blue-400 mb-2">
              {isLoading ? '...' : `+${totalReturn.toFixed(1)}%`}
            </div>
            <div className="text-white/60 text-sm uppercase tracking-wider">
              Total Return
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-white/10">
            <div className="text-3xl font-bold text-purple-400 mb-2">
              {isLoading ? '...' : positions.length}
            </div>
            <div className="text-white/60 text-sm uppercase tracking-wider">
              Active Positions
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          className="flex space-x-2 mb-8 p-1 glass-card rounded-xl border border-white/10 w-fit mx-auto"
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
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
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
        >
          {activeTab === 'overview' && (
            <div className="glass-card p-8 rounded-2xl border border-white/10">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-4">
                  Portfolio Performance
                </h3>
                <p className="text-white/70 mb-8">
                  Detailed analytics coming soon. Connect with our API to track real-time performance.
                </p>
                <div className="h-64 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-xl flex items-center justify-center border border-white/10">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white text-2xl">📊</span>
                    </div>
                    <p className="text-white/60">Performance Chart</p>
                    <p className="text-white/40 text-sm">Coming Soon</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'positions' && (
            <div className="space-y-6">
              {!connected ? (
                <div className="glass-card p-8 rounded-2xl border border-white/10 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-2xl">🔒</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Connect Your Wallet
                  </h3>
                  <p className="text-white/60">
                    Please connect your wallet to view your positions
                  </p>
                </div>
              ) : isLoading ? (
                <div className="glass-card p-8 rounded-2xl border border-white/10 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-spin">
                    <span className="text-white text-2xl">⏳</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Loading Positions...
                  </h3>
                  <p className="text-white/60">
                    Fetching your portfolio data from the blockchain
                  </p>
                </div>
              ) : depositsError ? (
                <div className="glass-card p-8 rounded-2xl border border-red-500/20 text-center">
                  <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-red-400 text-2xl">❌</span>
                  </div>
                  <h3 className="text-xl font-bold text-red-400 mb-2">
                    Error Loading Positions
                  </h3>
                  <p className="text-white/60 mb-4">
                    {depositsError}
                  </p>
                  <button 
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white font-medium rounded-lg hover:from-red-600 hover:to-pink-700 transition-all duration-300 text-sm"
                  >
                    Retry
                  </button>
                </div>
              ) : positions.length === 0 ? (
                <div className="glass-card p-8 rounded-2xl border border-white/10 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white text-2xl">📊</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    No Positions Yet
                  </h3>
                  <p className="text-white/60 mb-4">
                    You don't have any active positions. Start by depositing into a strategy!
                  </p>
                  <button 
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 text-sm"
                  >
                    Browse Strategies
                  </button>
                </div>
              ) : (
                positions.map((position, index) => (
                  <motion.div
                    key={position.id}
                    className="glass-card p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-4 lg:space-y-0">
                      {/* Left: Strategy Info */}
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                          <span className="text-white font-bold">{position.token.charAt(0)}</span>
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-white">{position.strategy}</h3>
                          <p className="text-white/60 text-sm">{position.token}</p>
                        </div>
                        <div className={`px-3 py-1 rounded-full border text-xs font-medium ${getStatusColor(position.status)}`}>
                          {position.status}
                        </div>
                      </div>

                      {/* Right: Metrics */}
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 w-full lg:w-auto">
                        <div className="text-center lg:text-right">
                          <div className="text-lg font-semibold text-white">
                            {position.deposited.toFixed(2)} {position.token}
                          </div>
                          <div className="text-white/50 text-xs uppercase tracking-wider">
                            Deposited
                          </div>
                        </div>
                        <div className="text-center lg:text-right">
                          <div className="text-lg font-semibold text-white">
                            {position.currentValue.toFixed(2)} {position.token}
                          </div>
                          <div className="text-white/50 text-xs uppercase tracking-wider">
                            Current Value
                          </div>
                        </div>
                        <div className="text-center lg:text-right">
                          <div className="text-lg font-semibold text-green-400">
                            {position.apy.toFixed(1)}%
                          </div>
                          <div className="text-white/50 text-xs uppercase tracking-wider">
                            APY
                          </div>
                        </div>
                        <div className="text-center lg:text-right">
                          <div className="text-lg font-semibold text-purple-400">
                            +{position.rewards.toFixed(4)} {position.token}
                          </div>
                          <div className="text-white/50 text-xs uppercase tracking-wider">
                            Rewards
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Additional Info */}
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-white/50">Deposit Date:</span>
                          <span className="text-white ml-2">
                            {formatDate(position.depositDate)}
                          </span>
                        </div>
                        <div>
                          <span className="text-white/50">Maturity Date:</span>
                          <span className="text-white ml-2">
                            {formatDate(position.maturityDate)}
                          </span>
                        </div>
                        <div>
                          <span className="text-white/50">Time Until Maturity:</span>
                          <span className="text-white ml-2">
                            {formatTimeRemaining(position.timeUntilMaturity)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3 mt-6 pt-6 border-t border-white/10">
                      {/* Add More Button - Disabled for now */}
                      <button 
                        className="px-4 py-2 bg-gray-600 text-gray-400 font-medium rounded-lg cursor-not-allowed transition-all duration-300 text-sm relative group"
                        disabled
                        title="Coming Soon"
                      >
                        Add More
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                          Coming Soon
                        </div>
                      </button>
                      
                      {/* Withdraw/Redeem Button */}
                      <button 
                        onClick={() => handleWithdraw(position)}
                        className={`px-4 py-2 font-medium rounded-lg transition-all duration-300 text-sm ${
                          position.timeUntilMaturity > 0
                            ? 'bg-orange-600 hover:bg-orange-700 text-white border border-orange-500'
                            : 'glass-card border border-white/20 text-white hover:bg-white/10'
                        }`}
                      >
                        {position.timeUntilMaturity > 0 ? 'Early Redeem' : 'Withdraw'}
                      </button>
                      
                      {/* View Details Button */}
                      <button 
                        className="px-4 py-2 text-white/70 hover:text-white transition-colors duration-300 text-sm"
                        onClick={() => alert('View Details functionality coming soon!')}
                      >
                        View Details
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}
        </motion.div>
      </div>

      {/* Withdraw Confirmation Modal */}
      {showWithdrawModal && selectedPosition && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            className="glass-card p-6 rounded-2xl border border-white/20 max-w-md w-full"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-xl font-bold text-white mb-4">
              {selectedPosition.timeUntilMaturity > 0 ? 'Early Redemption Warning' : 'Confirm Withdrawal'}
            </h3>

            {selectedPosition.timeUntilMaturity > 0 ? (
              <div className="space-y-4">
                <div className="bg-orange-500/20 border border-orange-500/30 rounded-xl p-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-orange-400 text-xl">⚠️</span>
                    <span className="text-orange-400 font-semibold">Penalty Warning</span>
                  </div>
                  <p className="text-white/80 text-sm">
                    Your position has not reached maturity yet. Early redemption will result in a 10% penalty on the total amount.
                  </p>
                </div>

                <div className="space-y-2 text-sm">
                  {(() => {
                    const currentYield = calculateYieldFromTime(selectedPosition);
                    const totalBeforePenalty = selectedPosition.deposited + currentYield;
                    const penalty = totalBeforePenalty * 0.1;
                    const finalAmount = totalBeforePenalty - penalty;
                    
                    return (
                      <>
                        <div className="flex justify-between">
                          <span className="text-white/70">Original Amount:</span>
                          <span className="text-white">{formatCurrency(selectedPosition.deposited)} {selectedPosition.token}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/70">Current Yield (time-based):</span>
                          <span className="text-purple-400">+{formatCurrency(currentYield)} {selectedPosition.token}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/70">Total Before Penalty:</span>
                          <span className="text-white">{formatCurrency(totalBeforePenalty)} {selectedPosition.token}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/70">Time Until Maturity:</span>
                          <span className="text-orange-400">{formatTimeRemaining(selectedPosition.timeUntilMaturity)}</span>
                        </div>
                        <div className="flex justify-between border-t border-white/10 pt-2">
                          <span className="text-white/70">Penalty (10% of total):</span>
                          <span className="text-red-400">-{formatCurrency(penalty)} {selectedPosition.token}</span>
                        </div>
                        <div className="flex justify-between font-semibold">
                          <span className="text-white">You'll Receive:</span>
                          <span className="text-white">{formatCurrency(finalAmount)} {selectedPosition.token}</span>
                        </div>
                      </>
                    );
                  })()}
                </div>

                <p className="text-white/60 text-xs">
                  * Yield is calculated proportionally based on time elapsed since deposit. A 10% penalty is applied to the total amount (principal + time-based yield) for early redemption.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-green-400 text-xl">✅</span>
                    <span className="text-green-400 font-semibold">Position Matured</span>
                  </div>
                  <p className="text-white/80 text-sm">
                    Your position has reached maturity. You can withdraw without any penalties.
                  </p>
                </div>

                <div className="space-y-2 text-sm">
                  {(() => {
                    const currentYield = calculateYieldFromTime(selectedPosition);
                    const totalAmount = selectedPosition.deposited + currentYield;
                    
                    return (
                      <>
                        <div className="flex justify-between">
                          <span className="text-white/70">Original Amount:</span>
                          <span className="text-white">{formatCurrency(selectedPosition.deposited)} {selectedPosition.token}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-white/70">Total Yield (time-based):</span>
                          <span className="text-purple-400">+{formatCurrency(currentYield)} {selectedPosition.token}</span>
                        </div>
                        <div className="flex justify-between font-semibold border-t border-white/10 pt-2">
                          <span className="text-white">You'll Receive:</span>
                          <span className="text-green-400">{formatCurrency(totalAmount)} {selectedPosition.token}</span>
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
                className="flex-1 px-4 py-2 glass-card border border-white/20 text-white font-medium rounded-lg hover:bg-white/10 transition-all duration-300"
                disabled={isWithdrawing}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmWithdraw}
                className={`flex-1 px-4 py-2 font-medium rounded-lg transition-all duration-300 ${
                  selectedPosition.timeUntilMaturity > 0
                    ? 'bg-orange-600 hover:bg-orange-700 text-white'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
                disabled={isWithdrawing}
              >
                {isWithdrawing ? 'Processing...' : selectedPosition.timeUntilMaturity > 0 ? 'Redeem Early' : 'Withdraw'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
};

export default ModernPortfolioSection;
