'use client';

import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  AlertTriangle,
  ArrowUpDown,
  Calendar,
  CheckCircle,
  ChevronDown,
  ChevronUp,
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

interface UserDepositTableProps {
  deposits: EnrichedUserDeposit[];
  onAction?: (
    deposit: EnrichedUserDeposit,
    action: 'withdraw' | 'claim' | 'view'
  ) => void;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  onSort?: (field: string) => void;
}

export const UserDepositTable: React.FC<UserDepositTableProps> = ({
  deposits,
  onAction,
  sortBy,
  sortOrder,
  onSort,
}) => {
  const [selectedDeposit, setSelectedDeposit] =
    useState<EnrichedUserDeposit | null>(null);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  // Fonctions utilitaires (identiques aux autres composants)
  const getStatus = (deposit: EnrichedUserDeposit) => {
    if (deposit.isMatured) return 'Matured';
    if (deposit.timeUntilMaturity > 0) return 'Active';
    return 'Pending';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'text-blue-300 bg-blue-500/10 border-blue-500/20';
      case 'Pending':
        return 'text-yellow-300 bg-yellow-500/10 border-yellow-500/20';
      case 'Matured':
        return 'text-emerald-300 bg-emerald-500/10 border-emerald-500/20';
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

  const getTokenSymbol = (deposit: EnrichedUserDeposit) => {
    return (
      deposit.tokenSymbol || deposit.tokenAddress.slice(0, 4).toUpperCase()
    );
  };

  const timeUntilMaturity = (deposit: EnrichedUserDeposit) => {
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

  const progressPercentage = (deposit: EnrichedUserDeposit) => {
    const depositDate = new Date(deposit.depositDate);
    const maturityDate = new Date(deposit.maturityDate);
    const now = new Date();

    const totalDuration = maturityDate.getTime() - depositDate.getTime();
    const elapsed = now.getTime() - depositDate.getTime();

    return Math.min(Math.max((elapsed / totalDuration) * 100, 0), 100);
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  const calculateYieldFromTime = (deposit: EnrichedUserDeposit) => {
    const now = Date.now() / 1000;
    const depositTimestamp = new Date(deposit.depositDate).getTime() / 1000;
    const elapsed = Math.max(0, now - depositTimestamp);
    const secondsInYear = 31_536_000;

    const displayAmount = getDisplayAmountNumeric(deposit);
    const yieldAmount =
      (displayAmount * Number.parseFloat(deposit.apy) * elapsed) /
      (100 * secondsInYear);
    return yieldAmount;
  };

  const handleWithdraw = (deposit: EnrichedUserDeposit) => {
    setSelectedDeposit(deposit);
    setShowWithdrawModal(true);
  };

  const handleCancelWithdraw = () => {
    setShowWithdrawModal(false);
    setSelectedDeposit(null);
  };

  const handleConfirmWithdraw = async () => {
    if (!selectedDeposit) return;

    setIsWithdrawing(true);
    try {
      onAction?.(selectedDeposit, 'withdraw');
      setShowWithdrawModal(false);
      setSelectedDeposit(null);
    } catch (error) {
      console.error('Withdraw error:', error);
    } finally {
      setIsWithdrawing(false);
    }
  };

  const renderSortIcon = (field: string) => {
    if (sortBy !== field) return <ArrowUpDown className="h-4 w-4 opacity-50" />;
    return sortOrder === 'asc' ? (
      <ChevronUp className="h-4 w-4 text-blue-400" />
    ) : (
      <ChevronDown className="h-4 w-4 text-blue-400" />
    );
  };

  const columns = [
    { key: 'position', label: 'Position', sortable: true },
    { key: 'amount', label: 'Deposited', sortable: true },
    { key: 'yieldAmount', label: 'Current Yield', sortable: true },
    { key: 'apy', label: 'APY', sortable: true },
    { key: 'timeLeft', label: 'Time Left', sortable: true },
    { key: 'progress', label: 'Progress', sortable: false },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false },
  ];

  return (
    <>
      <div className="relative overflow-hidden rounded-2xl border border-gray-800/50 bg-gradient-to-br from-gray-900/90 to-black/90 shadow-2xl backdrop-blur-xl">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/2 to-purple-600/2" />
        <div className="-inset-px -z-10 absolute rounded-2xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-30 blur-sm" />

        {/* Table */}
        <div className="relative z-10">
          {/* Header */}
          <div className="border-gray-700/50 border-b bg-gray-800/30 backdrop-blur-sm">
            <div className="grid grid-cols-8 gap-4 px-6 py-4">
              {columns.map((column) => (
                <div
                  className="font-medium text-gray-400 text-xs uppercase tracking-wider"
                  key={column.key}
                >
                  {column.sortable ? (
                    <button
                      className="group flex items-center gap-2 transition-colors hover:text-white"
                      onClick={() => onSort?.(column.key)}
                    >
                      <span>{column.label}</span>
                      <span className="opacity-0 transition-opacity group-hover:opacity-100">
                        {renderSortIcon(column.key)}
                      </span>
                    </button>
                  ) : (
                    <span>{column.label}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Rows */}
          <div className="divide-y divide-gray-800/50">
            {deposits.map((deposit, index) => {
              const status = getStatus(deposit);
              const progress = progressPercentage(deposit);

              return (
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  className="group grid grid-cols-8 gap-4 px-6 py-4 transition-colors hover:bg-gray-800/20"
                  initial={{ opacity: 0, y: 20 }}
                  key={deposit.publicKey}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  {/* Position */}
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 shadow-lg">
                        <span className="font-bold text-white text-xs">
                          {getTokenSymbol(deposit)}
                        </span>
                      </div>
                      <div className="-top-0.5 -right-0.5 absolute flex h-3 w-3 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600">
                        <Target className="h-1.5 w-1.5 text-white" />
                      </div>
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-medium text-sm text-white">
                        #{deposit.strategyAddress.slice(0, 8)}
                      </p>
                      <p className="text-gray-400 text-xs">
                        {getTokenSymbol(deposit)}
                      </p>
                    </div>
                  </div>

                  {/* Deposited Amount */}
                  <div className="flex items-center">
                    <div>
                      <p className="font-semibold text-sm text-white">
                        {getDisplayAmount(deposit)}
                      </p>
                      <p className="text-gray-400 text-xs">
                        {getTokenSymbol(deposit)}
                      </p>
                    </div>
                  </div>

                  {/* Current Yield */}
                  <div className="flex items-center">
                    <div>
                      <p className="font-semibold text-emerald-400 text-sm">
                        {getDisplayYieldAmount(deposit)}
                      </p>
                      <p className="text-gray-400 text-xs">
                        +
                        {(
                          (getDisplayYieldAmountNumeric(deposit) /
                            getDisplayAmountNumeric(deposit)) *
                          100
                        ).toFixed(2)}
                        %
                      </p>
                    </div>
                  </div>

                  {/* APY */}
                  <div className="flex items-center">
                    <div className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text font-bold text-lg text-transparent">
                      {formatPercentage(Number.parseFloat(deposit.apy))}
                    </div>
                  </div>

                  {/* Time Left */}
                  <div className="flex items-center">
                    <div>
                      <p className="font-medium text-sm text-white">
                        {timeUntilMaturity(deposit)}
                      </p>
                      <p className="text-gray-400 text-xs">
                        {new Date(deposit.maturityDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="flex items-center">
                    <div className="w-full">
                      <div className="mb-1 flex items-center justify-between">
                        <span className="text-gray-400 text-xs">
                          {progress.toFixed(0)}%
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-gray-800/50">
                        <div
                          className="h-2 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex items-center">
                    <div
                      className={`flex items-center gap-2 rounded-full border px-3 py-1 font-medium text-xs ${getStatusColor(status)}`}
                    >
                      {getStatusIcon(status)}
                      <span>{status}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      className="rounded-lg border border-gray-700/50 bg-gray-800/40 p-2 text-gray-400 transition-all duration-300 hover:border-gray-600/50 hover:text-white"
                      onClick={() => onAction?.(deposit, 'view')}
                      title="View Details"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </button>
                    {(status === 'Active' || status === 'Matured') && (
                      <button
                        className={`rounded-lg px-3 py-1.5 font-medium text-xs transition-all duration-300 ${
                          deposit.isMatured
                            ? 'border border-emerald-500/30 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                            : 'border border-red-500/30 bg-red-500/20 text-red-400 hover:bg-red-500/30'
                        }`}
                        onClick={() => handleWithdraw(deposit)}
                      >
                        {deposit.isMatured ? 'Withdraw' : 'Early'}
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Empty state */}
          {deposits.length === 0 && (
            <div className="py-12 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-800/40">
                <DollarSign className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="mb-2 font-medium text-white">
                No Positions Found
              </h3>
              <p className="text-gray-400 text-sm">
                Your positions will appear here once you start investing.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Withdraw Confirmation Modal */}
      <AnimatePresence>
        {showWithdrawModal && selectedDeposit && (
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
                      {selectedDeposit.isMatured
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

                  {selectedDeposit.isMatured ? (
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
                    const currentYield =
                      calculateYieldFromTime(selectedDeposit);
                    const totalBeforePenalty =
                      getDisplayAmountNumeric(selectedDeposit) + currentYield;
                    const penalty = selectedDeposit.isMatured
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
                            {getDisplayAmount(selectedDeposit)}
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
                        {!selectedDeposit.isMatured && (
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
                                {timeUntilMaturity(selectedDeposit)}
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
                            className={`font-bold text-lg ${selectedDeposit.isMatured ? 'text-emerald-400' : 'text-orange-300'}`}
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
                      selectedDeposit.isMatured
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
                    ) : selectedDeposit.isMatured ? (
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
                  {!selectedDeposit.isMatured &&
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
