'use client';

import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  AlertTriangle,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  ExternalLink,
  PauseCircle,
  Sparkles,
  Target,
  TrendingUp,
  X,
  Zap,
} from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { UserDeposit } from '@/hooks/useUserDeposits';
import {
  type EnrichedUserDeposit,
  getDisplayAmount,
  getDisplayAmountNumeric,
  getDisplayYieldAmount,
  getDisplayYieldAmountNumeric,
} from '@/lib/depositUtils';
import { formatCurrency, formatTimeRemaining } from '@/lib/formatters';

interface UserDepositCardProps {
  deposit: EnrichedUserDeposit;
  onAction?: (
    deposit: EnrichedUserDeposit,
    action: 'withdraw' | 'claim' | 'view'
  ) => void;
}

export const UserDepositCard: React.FC<UserDepositCardProps> = ({
  deposit,
  onAction,
}) => {
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
      case 'Active':
        return 'text-blue-300 bg-blue-500/10 border-blue-500/20 shadow-lg shadow-blue-500/10';
      case 'Pending':
        return 'text-yellow-300 bg-yellow-500/10 border-yellow-500/20 shadow-lg shadow-yellow-500/10';
      case 'Matured':
        return 'text-emerald-300 bg-emerald-500/10 border-emerald-500/20 shadow-lg shadow-emerald-500/10';
      default:
        return 'text-gray-300 bg-gray-500/10 border-gray-500/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active':
        return <Zap className="h-3 w-3" />;
      case 'Pending':
        return <Clock className="h-3 w-3" />;
      case 'Matured':
        return <Sparkles className="h-3 w-3" />;
      default:
        return <PauseCircle className="h-3 w-3" />;
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
    return (
      deposit.tokenSymbol || deposit.tokenAddress.slice(0, 4).toUpperCase()
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
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
    const yieldAmount =
      (displayAmount * Number.parseFloat(deposit.apy) * elapsed) /
      (100 * secondsInYear);
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
        className="group relative overflow-hidden rounded-2xl border border-gray-800/50 bg-gradient-to-br from-gray-900/90 to-black/90 p-6 shadow-2xl backdrop-blur-2xl transition-all duration-500 hover:border-blue-500/40"
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        whileHover={{ scale: 1.02, y: -8 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Animated background gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/3 to-purple-600/3 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-white/[0.02] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        {/* Subtle animated glow */}
        <div className="-inset-1 -z-10 absolute rounded-2xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 blur-sm transition-opacity duration-500 group-hover:opacity-100" />

        {/* Content */}
        <div className="relative z-10 space-y-6">
          {/* Header with enhanced design */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 shadow-2xl shadow-blue-500/20 transition-all duration-300 group-hover:shadow-blue-500/30">
                  <span className="font-bold text-sm text-white">
                    {getTokenSymbol()}
                  </span>
                </div>
                <div className="-inset-2 -z-10 absolute rounded-2xl bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100" />
                <div className="-top-1 -right-1 absolute flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600">
                  <Target className="h-3 w-3 text-white" />
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-lg text-white tracking-tight">
                  Position #{deposit.strategyAddress.slice(0, 8)}
                </h3>
                <p className="flex items-center gap-1.5 text-gray-400 text-sm">
                  <DollarSign className="h-3 w-3" />
                  {getTokenSymbol()} Strategy
                </p>
              </div>
            </div>
            <div
              className={`flex items-center gap-2 rounded-full border px-4 py-2 font-medium text-xs backdrop-blur-sm ${getStatusColor(status)}`}
            >
              {getStatusIcon(status)}
              <span>{status}</span>
            </div>
          </div>

          {/* Main stats with enhanced visual hierarchy */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-gray-700/50 bg-gray-800/30 p-4 backdrop-blur-sm">
              <div className="mb-2 flex items-center gap-2 text-gray-400 text-xs">
                <DollarSign className="h-3 w-3" />
                <span>Deposited</span>
              </div>
              <p className="font-semibold text-white text-xl">
                {getDisplayAmount(deposit)}
              </p>
            </div>
            <div className="rounded-xl border border-gray-700/50 bg-gray-800/30 p-4 backdrop-blur-sm">
              <div className="mb-2 flex items-center gap-2 text-gray-400 text-xs">
                <TrendingUp className="h-3 w-3" />
                <span>Current Yield</span>
              </div>
              <p className="font-semibold text-emerald-400 text-xl">
                {getDisplayYieldAmount(deposit)}
              </p>
            </div>
          </div>

          {/* APY and time with enhanced design */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-400 text-xs">
                <Sparkles className="h-3 w-3" />
                <span>APY</span>
              </div>
              <div className="flex items-center gap-2">
                <p className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text font-bold text-2xl text-transparent">
                  {formatPercentage(Number.parseFloat(deposit.apy))}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-400 text-xs">
                <Clock className="h-3 w-3" />
                <span>Time to Maturity</span>
              </div>
              <p className="font-semibold text-lg text-white">
                {timeUntilMaturity()}
              </p>
            </div>
          </div>

          {/* Enhanced progress bar */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-400 text-sm">
                Progress
              </span>
              <span className="font-medium text-gray-400 text-sm">
                {progressPercentage().toFixed(1)}%
              </span>
            </div>
            <div className="relative">
              <div className="h-3 w-full overflow-hidden rounded-full bg-gray-800/50">
                <motion.div
                  animate={{ width: `${progressPercentage()}%` }}
                  className="h-3 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-blue-500/20 shadow-lg"
                  initial={{ width: 0 }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              </div>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-sm" />
            </div>
          </div>

          {/* Dates with improved layout */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-400 text-xs">
                <Calendar className="h-3 w-3" />
                <span>Deposit Date</span>
              </div>
              <p className="font-medium text-sm text-white">
                {new Date(deposit.depositDate).toLocaleDateString()}
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-400 text-xs">
                <Calendar className="h-3 w-3" />
                <span>Maturity Date</span>
              </div>
              <p className="font-medium text-sm text-white">
                {new Date(deposit.maturityDate).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Enhanced action buttons */}
          <div className="flex gap-3 border-gray-700/50 border-t pt-4">
            <button
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-700/50 bg-gray-800/40 px-4 py-3 font-medium text-gray-300 text-sm backdrop-blur-sm transition-all duration-300 hover:border-gray-600/50 hover:bg-gray-800/60 hover:text-white"
              onClick={() => onAction?.(deposit, 'view')}
            >
              <ExternalLink className="h-4 w-4" />
              View Details
            </button>
            {(status === 'Active' || status === 'Matured') && (
              <button
                className={`flex-1 rounded-xl px-4 py-3 font-medium text-sm backdrop-blur-sm transition-all duration-300 ${
                  deposit.isMatured
                    ? 'border border-emerald-500/30 bg-emerald-500/20 text-emerald-400 shadow-emerald-500/10 shadow-lg hover:border-emerald-500/50 hover:bg-emerald-500/30'
                    : 'border border-red-500/30 bg-red-500/20 text-red-400 shadow-lg shadow-red-500/10 hover:border-red-500/50 hover:bg-red-500/30'
                }`}
                onClick={handleWithdraw}
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
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
          >
            <motion.div
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="w-full max-w-md overflow-hidden rounded-2xl border border-gray-800/50 bg-gray-900/95 shadow-2xl backdrop-blur-xl"
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              {/* Modal Header */}
              <div className="relative p-8 pb-6">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-600/5" />
                <div className="relative z-10">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-bold text-2xl text-white">
                      {deposit.isMatured
                        ? 'Withdraw Position'
                        : 'Early Redemption'}
                    </h3>
                    <button
                      className="rounded-xl p-2 transition-colors hover:bg-gray-800/50"
                      onClick={handleCancelWithdraw}
                    >
                      <X className="h-5 w-5 text-gray-400" />
                    </button>
                  </div>

                  {deposit.isMatured ? (
                    <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4">
                      <div className="mb-3 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/20">
                          <CheckCircle className="h-5 w-5 text-emerald-400" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-emerald-300">
                            Position Matured
                          </h4>
                          <p className="text-emerald-200/80 text-sm">
                            No penalties apply
                          </p>
                        </div>
                      </div>
                      <p className="text-gray-200 text-sm leading-relaxed">
                        Your position has reached maturity. You can withdraw
                        without any penalties.
                      </p>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4">
                      <div className="mb-3 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/20">
                          <AlertTriangle className="h-5 w-5 text-red-400" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-red-300">
                            Penalty Warning
                          </h4>
                          <p className="text-red-200/80 text-sm">
                            10% penalty applies
                          </p>
                        </div>
                      </div>
                      <p className="text-gray-200 text-sm leading-relaxed">
                        Your position has not reached maturity. Early redemption
                        will result in a 10% penalty on the total amount.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Content */}
              <div className="px-8 pb-8">
                <div className="rounded-xl border border-gray-700/50 bg-gray-800/40 p-5 backdrop-blur-sm">
                  <h4 className="mb-4 flex items-center gap-2 font-semibold text-white">
                    <DollarSign className="h-4 w-4" />
                    Withdrawal Summary
                  </h4>

                  {(() => {
                    const currentYield = calculateYieldFromTime(deposit);
                    const totalBeforePenalty =
                      Number.parseFloat(deposit.amount) + currentYield;
                    const penalty = deposit.isMatured
                      ? 0
                      : totalBeforePenalty * 0.1;
                    const finalAmount = totalBeforePenalty - penalty;

                    return (
                      <div className="space-y-3 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300">
                            Original Amount:
                          </span>
                          <span className="font-medium text-white">
                            {formatCurrency(Number.parseFloat(deposit.amount))}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300">
                            Time-based Yield:
                          </span>
                          <span className="font-medium text-emerald-400">
                            +{formatCurrency(currentYield)}
                          </span>
                        </div>
                        {!deposit.isMatured && (
                          <>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-300">
                                Total Before Penalty:
                              </span>
                              <span className="text-white">
                                {formatCurrency(totalBeforePenalty)}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-gray-300">
                                Time Until Maturity:
                              </span>
                              <span className="text-orange-300">
                                {timeUntilMaturity()}
                              </span>
                            </div>
                            <div className="flex items-center justify-between border-gray-700/50 border-t pt-2">
                              <span className="text-gray-300">
                                Penalty (10%):
                              </span>
                              <span className="font-medium text-red-400">
                                -{formatCurrency(penalty)}
                              </span>
                            </div>
                          </>
                        )}
                        <div className="flex items-center justify-between border-gray-700/50 border-t pt-3">
                          <span className="font-semibold text-white">
                            You'll Receive:
                          </span>
                          <span
                            className={`font-bold text-lg ${deposit.isMatured ? 'text-emerald-400' : 'text-orange-300'}`}
                          >
                            {formatCurrency(finalAmount)}
                          </span>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Action buttons */}
                <div className="mt-6 flex gap-3">
                  <button
                    className="flex-1 rounded-xl border border-gray-700/50 bg-gray-800/60 px-4 py-3 font-medium text-gray-300 backdrop-blur-sm transition-all duration-300 hover:bg-gray-800/80 hover:text-white"
                    disabled={isWithdrawing}
                    onClick={handleCancelWithdraw}
                  >
                    Cancel
                  </button>
                  <button
                    className={`flex-1 rounded-xl px-4 py-3 font-medium backdrop-blur-sm transition-all duration-300 ${
                      deposit.isMatured
                        ? 'border border-emerald-500/30 bg-emerald-500/20 text-emerald-400 hover:border-emerald-500/50 hover:bg-emerald-500/30'
                        : 'border border-red-500/30 bg-red-500/20 text-red-400 hover:border-red-500/50 hover:bg-red-500/30'
                    }`}
                    disabled={isWithdrawing}
                    onClick={handleConfirmWithdraw}
                  >
                    {isWithdrawing ? (
                      <span className="flex items-center justify-center gap-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          className="h-4 w-4 rounded-full border-2 border-current border-t-transparent"
                          transition={{
                            duration: 1,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: 'linear',
                          }}
                        />
                        Processing...
                      </span>
                    ) : deposit.isMatured ? (
                      'Confirm Withdrawal'
                    ) : (
                      'Confirm Early Withdrawal'
                    )}
                  </button>
                </div>

                {/* Disclaimer */}
                <p className="mt-4 text-center text-gray-400 text-xs">
                  * Yield is calculated proportionally based on time elapsed
                  since deposit.
                  {!deposit.isMatured &&
                    ' A 10% penalty applies to early redemptions.'}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
