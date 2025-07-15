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
  Zap,
  ChevronUp,
  ChevronDown,
  ArrowUpDown
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

interface UserDepositTableProps {
  deposits: EnrichedUserDeposit[];
  onAction?: (deposit: EnrichedUserDeposit, action: 'withdraw' | 'claim' | 'view') => void;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  onSort?: (field: string) => void;
}

export const UserDepositTable: React.FC<UserDepositTableProps> = ({ 
  deposits, 
  onAction, 
  sortBy, 
  sortOrder, 
  onSort 
}) => {
  const [selectedDeposit, setSelectedDeposit] = useState<EnrichedUserDeposit | null>(null);
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
      case 'Active': return 'text-blue-300 bg-blue-500/10 border-blue-500/20';
      case 'Pending': return 'text-yellow-300 bg-yellow-500/10 border-yellow-500/20';
      case 'Matured': return 'text-emerald-300 bg-emerald-500/10 border-emerald-500/20';
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

  const getTokenSymbol = (deposit: EnrichedUserDeposit) => {
    return deposit.tokenSymbol || deposit.tokenAddress.slice(0, 4).toUpperCase();
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
    const yieldAmount = (displayAmount * parseFloat(deposit.apy) * elapsed) / (100 * secondsInYear);
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
    if (sortBy !== field) return <ArrowUpDown className="w-4 h-4 opacity-50" />;
    return sortOrder === 'asc' ? 
      <ChevronUp className="w-4 h-4 text-blue-400" /> : 
      <ChevronDown className="w-4 h-4 text-blue-400" />;
  };

  const columns = [
    { key: 'position', label: 'Position', sortable: true },
    { key: 'amount', label: 'Deposited', sortable: true },
    { key: 'yieldAmount', label: 'Current Yield', sortable: true },
    { key: 'apy', label: 'APY', sortable: true },
    { key: 'timeLeft', label: 'Time Left', sortable: true },
    { key: 'progress', label: 'Progress', sortable: false },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'actions', label: 'Actions', sortable: false }
  ];

  return (
    <>
      <div className="relative bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-xl border border-gray-800/50 rounded-2xl overflow-hidden shadow-2xl">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/2 to-purple-600/2" />
        <div className="absolute -inset-px bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl blur-sm opacity-30 -z-10" />
        
        {/* Table */}
        <div className="relative z-10">
          {/* Header */}
          <div className="bg-gray-800/30 border-b border-gray-700/50 backdrop-blur-sm">
            <div className="grid grid-cols-8 gap-4 px-6 py-4">
              {columns.map((column) => (
                <div key={column.key} className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                  {column.sortable ? (
                    <button
                      onClick={() => onSort?.(column.key)}
                      className="flex items-center gap-2 hover:text-white transition-colors group"
                    >
                      <span>{column.label}</span>
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity">
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
                  key={deposit.publicKey}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="grid grid-cols-8 gap-4 px-6 py-4 hover:bg-gray-800/20 transition-colors group"
                >
                  {/* Position */}
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold text-xs">
                          {getTokenSymbol(deposit)}
                        </span>
                      </div>
                      <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center">
                        <Target className="w-1.5 h-1.5 text-white" />
                      </div>
                    </div>
                    <div className="min-w-0">
                      <p className="text-white font-medium text-sm truncate">
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
                      <p className="text-white font-semibold text-sm">
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
                      <p className="text-emerald-400 font-semibold text-sm">
                        {getDisplayYieldAmount(deposit)}
                      </p>
                      <p className="text-gray-400 text-xs">
                        +{((getDisplayYieldAmountNumeric(deposit) / getDisplayAmountNumeric(deposit)) * 100).toFixed(2)}%
                      </p>
                    </div>
                  </div>

                  {/* APY */}
                  <div className="flex items-center">
                    <div className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                      {formatPercentage(parseFloat(deposit.apy))}
                    </div>
                  </div>

                  {/* Time Left */}
                  <div className="flex items-center">
                    <div>
                      <p className="text-white font-medium text-sm">
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
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-gray-400 text-xs">{progress.toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-gray-800/50 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex items-center">
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(status)}`}>
                      {getStatusIcon(status)}
                      <span>{status}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onAction?.(deposit, 'view')}
                      className="p-2 bg-gray-800/40 border border-gray-700/50 rounded-lg text-gray-400 hover:text-white hover:border-gray-600/50 transition-all duration-300"
                      title="View Details"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                    {(status === 'Active' || status === 'Matured') && (
                      <button
                        onClick={() => handleWithdraw(deposit)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-300 ${
                          deposit.isMatured 
                            ? 'bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30' 
                            : 'bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30'
                        }`}
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
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-800/40 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-white font-medium mb-2">No Positions Found</h3>
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
                      {!selectedDeposit.isMatured ? 'Early Redemption' : 'Withdraw Position'}
                    </h3>
                    <button
                      onClick={handleCancelWithdraw}
                      className="p-2 hover:bg-gray-800/50 rounded-xl transition-colors"
                    >
                      <X className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                  
                  {!selectedDeposit.isMatured ? (
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
                    const currentYield = calculateYieldFromTime(selectedDeposit);
                    const totalBeforePenalty = getDisplayAmountNumeric(selectedDeposit) + currentYield;
                    const penalty = !selectedDeposit.isMatured ? totalBeforePenalty * 0.1 : 0;
                    const finalAmount = totalBeforePenalty - penalty;
                    
                    return (
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300">Original Amount:</span>
                          <span className="text-white font-medium">{getDisplayAmount(selectedDeposit)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-300">Time-based Yield:</span>
                          <span className="text-emerald-400 font-medium">+{formatCurrency(currentYield)}</span>
                        </div>
                        {!selectedDeposit.isMatured && (
                          <>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-300">Total Before Penalty:</span>
                              <span className="text-white">{formatCurrency(totalBeforePenalty)}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-300">Time Until Maturity:</span>
                              <span className="text-orange-300">{timeUntilMaturity(selectedDeposit)}</span>
                            </div>
                            <div className="flex justify-between items-center pt-2 border-t border-gray-700/50">
                              <span className="text-gray-300">Penalty (10%):</span>
                              <span className="text-red-400 font-medium">-{formatCurrency(penalty)}</span>
                            </div>
                          </>
                        )}
                        <div className="flex justify-between items-center pt-3 border-t border-gray-700/50">
                          <span className="text-white font-semibold">You'll Receive:</span>
                          <span className={`font-bold text-lg ${selectedDeposit.isMatured ? 'text-emerald-400' : 'text-orange-300'}`}>
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
                      !selectedDeposit.isMatured
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
                      !selectedDeposit.isMatured ? 'Confirm Early Withdrawal' : 'Confirm Withdrawal'
                    )}
                  </button>
                </div>

                {/* Disclaimer */}
                <p className="text-gray-400 text-xs mt-4 text-center">
                  * Yield is calculated proportionally based on time elapsed since deposit.
                  {!selectedDeposit.isMatured && ' A 10% penalty applies to early redemptions.'}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
