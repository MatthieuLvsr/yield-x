"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, 
  DollarSign, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  PauseCircle, 
  ExternalLink,
  Sparkles,
  Target,
  Zap,
  Calendar,
  X,
  AlertTriangle
} from 'lucide-react';
import { 
  ExclamationTriangleIcon, 
  CheckCircleIcon 
} from '@heroicons/react/24/outline';
import { UserDeposit } from '@/hooks/useUserDeposits';
import { 
  EnrichedUserDeposit, 
  getDisplayAmount, 
  getDisplayYieldAmount, 
  getDisplayAmountNumeric, 
  getDisplayYieldAmountNumeric 
} from '@/lib/depositUtils';
import { formatCurrency, formatTimeRemaining } from '@/lib/formatters';

interface UserDepositListItemProps {
  deposit: EnrichedUserDeposit;
  onAction?: (deposit: EnrichedUserDeposit, action: 'withdraw' | 'claim' | 'view') => void;
}

export const UserDepositListItem: React.FC<UserDepositListItemProps> = ({ deposit, onAction }) => {
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  
  // Déterminer le statut basé sur les propriétés disponibles
  const getStatus = () => {
    if (deposit.isMatured) return 'Matured';
    if (deposit.timeUntilMaturity > 0) return 'Active';
    return 'Pending';
  };

  const status = getStatus();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'text-blue-300 bg-blue-500/10 border-blue-500/20 shadow-lg shadow-blue-500/10';
      case 'Pending': return 'text-yellow-300 bg-yellow-500/10 border-yellow-500/20 shadow-lg shadow-yellow-500/10';
      case 'Matured': return 'text-emerald-300 bg-emerald-500/10 border-emerald-500/20 shadow-lg shadow-emerald-500/10';
      default: return 'text-gray-300 bg-gray-500/10 border-gray-500/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active': return <Zap className="w-3 h-3" />;
      case 'Pending': return <Clock className="w-3 h-3" />;
      case 'Matured': return <Sparkles className="w-3 h-3" />;
      default: return <PauseCircle className="w-3 h-3" />;
    }
  };

  const timeUntilMaturity = () => {
    const now = new Date();
    const maturityDate = new Date(deposit.maturityDate);
    const diffTime = maturityDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 0) return 'Matured';
    if (diffDays === 1) return '1 day';
    if (diffDays < 30) return `${diffDays} days`;
    
    const months = Math.floor(diffDays / 30);
    const remainingDays = diffDays % 30;
    return months === 1 
      ? `1 month${remainingDays > 0 ? ` ${remainingDays}d` : ''}`
      : `${months} months${remainingDays > 0 ? ` ${remainingDays}d` : ''}`;
  };

  const progressPercentage = () => {
    const depositDate = new Date(deposit.depositDate);
    const maturityDate = new Date(deposit.maturityDate);
    const now = new Date();
    
    const totalDuration = maturityDate.getTime() - depositDate.getTime();
    const elapsed = now.getTime() - depositDate.getTime();
    
    return Math.min(Math.max((elapsed / totalDuration) * 100, 0), 100);
  };

  // Extraire le nom du token depuis l'adresse (pour l'affichage)
  const getTokenSymbol = () => {
    return deposit.tokenSymbol || deposit.tokenAddress.slice(0, 4).toUpperCase();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  // Fonction pour calculer le yield basé sur le temps écoulé (comme dans le smart contract)
  const calculateYieldFromTime = (deposit: EnrichedUserDeposit) => {
    const now = Date.now() / 1000; // timestamp actuel en secondes
    const depositTimestamp = new Date(deposit.depositDate).getTime() / 1000;
    const elapsed = Math.max(0, now - depositTimestamp);
    const secondsInYear = 31_536_000;
    
    // Calcul identique au smart contract
    const yieldAmount = (parseFloat(deposit.amount) * parseFloat(deposit.apy) * elapsed) / (100 * secondsInYear);
    return yieldAmount;
  };

  const handleWithdraw = () => {
    setShowWithdrawModal(true);
  };

  const handleCancelWithdraw = () => {
    setShowWithdrawModal(false);
  };

  const handleConfirmWithdraw = async () => {
    setIsWithdrawing(true);
    try {
      onAction?.(deposit, 'withdraw');
      setShowWithdrawModal(false);
    } catch (error) {
      console.error('Withdraw error:', error);
    } finally {
      setIsWithdrawing(false);
    }
  };

  const getWithdrawButtonColor = () => {
    return deposit.isMatured 
      ? 'bg-green-500/20 border-green-500/30 text-green-400 hover:bg-green-500/30' 
      : 'bg-red-500/20 border-red-500/30 text-red-400 hover:bg-red-500/30';
  };

  const getWithdrawButtonText = () => {
    return deposit.isMatured ? 'Withdraw' : 'Early Withdraw';
  };

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.005, x: 4 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="relative bg-gradient-to-r from-gray-900/90 to-gray-800/90 backdrop-blur-xl border border-gray-800/50 rounded-xl hover:border-blue-500/30 transition-all duration-300 group overflow-hidden"
      >
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/2 to-purple-600/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Subtle glow effect */}
        <div className="absolute -inset-px bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
        
        <div className="relative z-10 p-5">
          <div className="flex items-center gap-6">
            {/* Token et Strategy - Enhanced */}
            <div className="flex items-center gap-4 min-w-0 flex-1">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/30 transition-all duration-300">
                  <span className="text-white font-bold text-sm">
                    {getTokenSymbol()}
                  </span>
                </div>
                <div className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center">
                  <Target className="w-2 h-2 text-white" />
                </div>
              </div>
              <div className="min-w-0">
                <h3 className="text-white font-semibold text-base truncate">
                  Position #{deposit.strategyAddress.slice(0, 8)}
                </h3>
                <p className="text-gray-400 text-sm flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />
                  {getTokenSymbol()} Strategy
                </p>
              </div>
            </div>

            {/* Montant déposé - Enhanced */}
            <div className="text-right min-w-0 flex-shrink-0">
              <div className="text-white font-semibold text-base">{deposit.formattedAmount || `${deposit.amount} ${getTokenSymbol()}`}</div>
              <div className="text-gray-400 text-xs uppercase tracking-wider">Deposited</div>
            </div>

            {/* Yield actuel - Enhanced */}
            <div className="text-right min-w-0 flex-shrink-0">
              <div className="text-emerald-400 font-semibold text-base">{deposit.formattedYieldAmount || `${deposit.yieldAmount} ${getTokenSymbol()}`}</div>
              <div className="text-gray-400 text-xs uppercase tracking-wider">Current Yield</div>
            </div>

            {/* APY - Enhanced */}
            <div className="text-right min-w-0 flex-shrink-0">
              <div className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {formatPercentage(parseFloat(deposit.apy))}
              </div>
              <div className="text-gray-400 text-xs uppercase tracking-wider">APY</div>
            </div>

            {/* Temps jusqu'à maturité - Enhanced */}
            <div className="text-right min-w-0 flex-shrink-0">
              <div className="text-white font-semibold text-base">{timeUntilMaturity()}</div>
              <div className="text-gray-400 text-xs uppercase tracking-wider">Time Left</div>
            </div>

            {/* Statut - Enhanced */}
            <div className="flex-shrink-0">
              <div className={`flex items-center gap-2 px-3 py-2 rounded-full text-xs font-medium border backdrop-blur-sm ${getStatusColor(status)}`}>
                {getStatusIcon(status)}
                <span>{status}</span>
              </div>
            </div>

            {/* Actions - Enhanced */}
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={() => onAction?.(deposit, 'view')}
                className="p-2.5 bg-gray-800/40 border border-gray-700/50 rounded-lg text-gray-400 hover:text-white hover:border-gray-600/50 hover:bg-gray-800/60 transition-all duration-300 backdrop-blur-sm"
                title="View Details"
              >
                <ExternalLink className="w-4 h-4" />
              </button>
              {(status === 'Active' || status === 'Matured') && (
                <button
                  onClick={handleWithdraw}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 backdrop-blur-sm ${
                    deposit.isMatured 
                      ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30 hover:border-emerald-500/50' 
                      : 'bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 hover:border-red-500/50'
                  }`}
                >
                  {getWithdrawButtonText()}
                </button>
              )}
            </div>
          </div>

          {/* Enhanced progress bar - more subtle in list view */}
          <div className="mt-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-gray-400 font-medium">Progress</span>
              <span className="text-xs text-gray-400 font-medium">{progressPercentage().toFixed(1)}%</span>
            </div>
            <div className="relative">
              <div className="w-full bg-gray-800/40 rounded-full h-2 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage()}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-2 rounded-full"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-full blur-sm" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Enhanced Withdraw Confirmation Modal - Same as UserDepositCard */}
      <AnimatePresence>
        {showWithdrawModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-gray-900/95 backdrop-blur-xl border border-gray-800/50 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden"
            >
              {/* Modal Header */}
              <div className="relative p-8 pb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-600/5" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold text-white">
                      {!deposit.isMatured ? 'Early Redemption' : 'Withdraw Position'}
                    </h3>
                    <button
                      onClick={handleCancelWithdraw}
                      className="p-2 hover:bg-gray-800/50 rounded-xl transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                  
                  {!deposit.isMatured ? (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
                          <AlertTriangle className="w-5 h-5 text-red-400" />
                        </div>
                        <div>
                          <h4 className="text-red-300 font-semibold">Penalty Warning</h4>
                          <p className="text-red-200/80 text-sm">10% penalty applies</p>
                        </div>
                      </div>
                      <p className="text-gray-200 text-sm leading-relaxed">
                        Your position has not reached maturity. Early redemption will result in a 10% penalty on the total amount.
                      </p>
                    </div>
                  ) : (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-emerald-400" />
                        </div>
                        <div>
                          <h4 className="text-emerald-300 font-semibold">Position Matured</h4>
                          <p className="text-emerald-200/80 text-sm">No penalties apply</p>
                        </div>
                      </div>
                      <p className="text-gray-200 text-sm leading-relaxed">
                        Your position has reached maturity. You can withdraw without any penalties.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Content */}
              <div className="px-8 pb-8">
                <div className="bg-gray-800/40 border border-gray-700/50 rounded-xl p-5 backdrop-blur-sm">
                  <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Withdrawal Summary
                  </h4>
                  
                  {(() => {
                    const currentYield = calculateYieldFromTime(deposit);
                    const totalBeforePenalty = parseFloat(deposit.amount) + currentYield;
                    const penalty = !deposit.isMatured ? totalBeforePenalty * 0.1 : 0;
                    const finalAmount = totalBeforePenalty - penalty;
                    
                    return (
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300">Original Amount:</span>
                          <span className="text-white font-medium">{formatCurrency(parseFloat(deposit.amount))}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300">Time-based Yield:</span>
                          <span className="text-emerald-400 font-medium">+{formatCurrency(currentYield)}</span>
                        </div>
                        {!deposit.isMatured && (
                          <>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-300">Total Before Penalty:</span>
                              <span className="text-white">{formatCurrency(totalBeforePenalty)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-300">Time Until Maturity:</span>
                              <span className="text-orange-300">{timeUntilMaturity()}</span>
                            </div>
                            <div className="flex justify-between items-center pt-2 border-t border-gray-700/50">
                              <span className="text-gray-300">Penalty (10%):</span>
                              <span className="text-red-400 font-medium">-{formatCurrency(penalty)}</span>
                            </div>
                          </>
                        )}
                        <div className="flex justify-between items-center pt-3 border-t border-gray-700/50">
                          <span className="text-white font-semibold">You'll Receive:</span>
                          <span className={`font-bold text-lg ${deposit.isMatured ? 'text-emerald-400' : 'text-orange-300'}`}>
                            {formatCurrency(finalAmount)}
                          </span>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Action buttons */}
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleCancelWithdraw}
                    className="flex-1 px-4 py-3 bg-gray-800/60 border border-gray-700/50 text-gray-300 font-medium rounded-xl hover:bg-gray-800/80 hover:text-white transition-all duration-300 backdrop-blur-sm"
                    disabled={isWithdrawing}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmWithdraw}
                    className={`flex-1 px-4 py-3 font-medium rounded-xl transition-all duration-300 backdrop-blur-sm ${
                      !deposit.isMatured
                        ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 hover:border-red-500/50'
                        : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 hover:border-emerald-500/50'
                    }`}
                    disabled={isWithdrawing}
                  >
                    {isWithdrawing ? (
                      <span className="flex items-center justify-center gap-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                        />
                        Processing...
                      </span>
                    ) : (
                      !deposit.isMatured ? 'Confirm Early Withdrawal' : 'Confirm Withdrawal'
                    )}
                  </button>
                </div>

                {/* Disclaimer */}
                <p className="text-gray-400 text-xs mt-4 text-center">
                  * Yield is calculated proportionally based on time elapsed since deposit.
                  {!deposit.isMatured && ' A 10% penalty applies to early redemptions.'}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
