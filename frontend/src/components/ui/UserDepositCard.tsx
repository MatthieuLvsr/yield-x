"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, 
  DollarSign, 
  TrendingUp, 
  Calendar, 
  AlertCircle, 
  CheckCircle, 
  PauseCircle, 
  ExternalLink,
  X,
  AlertTriangle,
  Sparkles,
  Target,
  Zap
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

interface UserDepositCardProps {
  deposit: EnrichedUserDeposit;
  onAction?: (deposit: EnrichedUserDeposit, action: 'withdraw' | 'claim' | 'view') => void;
}

export const UserDepositCard: React.FC<UserDepositCardProps> = ({ deposit, onAction }) => {
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
    
    // Calcul identique au smart contract en utilisant le montant d'affichage
    const displayAmount = getDisplayAmountNumeric(deposit);
    const yieldAmount = (displayAmount * parseFloat(deposit.apy) * elapsed) / (100 * secondsInYear);
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
        whileHover={{ scale: 1.02, y: -8 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="relative bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-2xl border border-gray-800/50 rounded-2xl p-6 hover:border-blue-500/40 transition-all duration-500 group overflow-hidden shadow-2xl"
      >
        {/* Animated background gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/3 to-purple-600/3 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Subtle animated glow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
        
        {/* Content */}
        <div className="relative z-10 space-y-6">
          {/* Header with enhanced design */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/20 group-hover:shadow-blue-500/30 transition-all duration-300">
                  <span className="text-white font-bold text-sm">
                    {getTokenSymbol()}
                  </span>
                </div>
                <div className="absolute -inset-2 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center">
                  <Target className="w-3 h-3 text-white" />
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-white font-semibold text-lg tracking-tight">
                  Position #{deposit.strategyAddress.slice(0, 8)}
                </h3>
                <p className="text-gray-400 text-sm flex items-center gap-1.5">
                  <DollarSign className="w-3 h-3" />
                  {getTokenSymbol()} Strategy
                </p>
              </div>
            </div>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium border backdrop-blur-sm ${getStatusColor(status)}`}>
              {getStatusIcon(status)}
              <span>{status}</span>
            </div>
          </div>

          {/* Main stats with enhanced visual hierarchy */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-gray-400 text-xs mb-2">
                <DollarSign className="w-3 h-3" />
                <span>Deposited</span>
              </div>
              <p className="text-white font-semibold text-xl">{getDisplayAmount(deposit)}</p>
            </div>
            <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-gray-400 text-xs mb-2">
                <TrendingUp className="w-3 h-3" />
                <span>Current Yield</span>
              </div>
              <p className="text-emerald-400 font-semibold text-xl">{getDisplayYieldAmount(deposit)}</p>
            </div>
          </div>

          {/* APY and time with enhanced design */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-400 text-xs">
                <Sparkles className="w-3 h-3" />
                <span>APY</span>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {formatPercentage(parseFloat(deposit.apy))}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-400 text-xs">
                <Clock className="w-3 h-3" />
                <span>Time to Maturity</span>
              </div>
              <p className="text-white font-semibold text-lg">{timeUntilMaturity()}</p>
            </div>
          </div>

          {/* Enhanced progress bar */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-400 font-medium">Progress</span>
              <span className="text-sm text-gray-400 font-medium">{progressPercentage().toFixed(1)}%</span>
            </div>
            <div className="relative">
              <div className="w-full bg-gray-800/50 rounded-full h-3 overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage()}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-3 rounded-full shadow-lg shadow-blue-500/20"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-full blur-sm" />
            </div>
          </div>

          {/* Dates with improved layout */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-400 text-xs">
                <Calendar className="w-3 h-3" />
                <span>Deposit Date</span>
              </div>
              <p className="text-white font-medium text-sm">{new Date(deposit.depositDate).toLocaleDateString()}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-400 text-xs">
                <Calendar className="w-3 h-3" />
                <span>Maturity Date</span>
              </div>
              <p className="text-white font-medium text-sm">{new Date(deposit.maturityDate).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Enhanced action buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-700/50">
            <button
              onClick={() => onAction?.(deposit, 'view')}
              className="flex-1 px-4 py-3 bg-gray-800/40 border border-gray-700/50 rounded-xl text-gray-300 hover:text-white hover:border-gray-600/50 hover:bg-gray-800/60 transition-all duration-300 text-sm font-medium flex items-center justify-center gap-2 backdrop-blur-sm"
            >
              <ExternalLink className="w-4 h-4" />
              View Details
            </button>
            {(status === 'Active' || status === 'Matured') && (
              <button
                onClick={handleWithdraw}
                className={`flex-1 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 backdrop-blur-sm ${
                  deposit.isMatured 
                    ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30 hover:border-emerald-500/50 shadow-lg shadow-emerald-500/10' 
                    : 'bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 hover:border-red-500/50 shadow-lg shadow-red-500/10'
                }`}
              >
                {getWithdrawButtonText()}
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Enhanced Withdraw Confirmation Modal */}
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
