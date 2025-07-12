"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useUserDeposits } from '@/hooks/useUserDeposits';
import { formatCurrency, formatDate, formatTimeRemaining } from '@/lib/formatters';

const UserPositions: React.FC = () => {
  const { deposits, stats, isLoading, error, refetch } = useUserDeposits();

  if (isLoading) {
    return (
      <div className="py-8">
        <div className="text-center">
          <div className="inline-flex items-center space-x-2 text-white/60">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white/60 rounded-full animate-spin"></div>
            <span>Loading your positions...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8">
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 max-w-md mx-auto">
          <h3 className="text-red-400 font-medium mb-2">Failed to load positions</h3>
          <p className="text-white/70 text-sm mb-4">{error}</p>
          <button 
            onClick={refetch}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (deposits.length === 0) {
    return (
      <div className="py-12">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-white/5 flex items-center justify-center">
            <span className="text-2xl">📊</span>
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No positions yet</h3>
          <p className="text-white/60 mb-6">Make your first deposit to start earning yield!</p>
          <button 
            onClick={refetch}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-lg transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-6">
        {/* Header with Stats */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-white">Your Positions</h2>
            <button
              onClick={refetch}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-lg transition-colors flex items-center space-x-2"
            >
              <span>🔄</span>
              <span>Refresh</span>
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="glass-card p-4 rounded-xl border border-white/10">
              <div className="text-2xl font-bold text-green-400">
                {formatCurrency(stats.totalValue.toString())}
              </div>
              <div className="text-white/50 text-sm">Total Deposited</div>
            </div>
            <div className="glass-card p-4 rounded-xl border border-white/10">
              <div className="text-2xl font-bold text-purple-400">
                {formatCurrency(stats.totalYieldValue.toString())}
              </div>
              <div className="text-white/50 text-sm">Yield Tokens</div>
            </div>
            <div className="glass-card p-4 rounded-xl border border-white/10">
              <div className="text-2xl font-bold text-blue-400">{stats.totalDeposits}</div>
              <div className="text-white/50 text-sm">Total Positions</div>
            </div>
            <div className="glass-card p-4 rounded-xl border border-white/10">
              <div className="text-2xl font-bold text-yellow-400">{stats.maturedDeposits}</div>
              <div className="text-white/50 text-sm">Matured</div>
            </div>
          </div>
        </motion.div>

        {/* Positions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {deposits.map((deposit, index) => (
            <motion.div
              key={deposit.publicKey}
              className="glass-card p-6 rounded-2xl border border-white/10"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-white">Position #{index + 1}</h3>
                  <p className="text-white/60 text-sm">
                    Deposited on {formatDate(deposit.depositDate)}
                  </p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                  deposit.isMatured 
                    ? 'bg-green-400/10 text-green-400 border border-green-400/20'
                    : 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/20'
                }`}>
                  {deposit.isMatured ? 'Matured' : 'Active'}
                </div>
              </div>

              {/* Amount Info */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-xl font-bold text-white">
                    {formatCurrency(deposit.amount)}
                  </div>
                  <div className="text-white/50 text-sm">Amount Deposited</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-purple-400">
                    {formatCurrency(deposit.yieldAmount)}
                  </div>
                  <div className="text-white/50 text-sm">Yield Tokens</div>
                </div>
              </div>

              {/* Timing */}
              <div className="border-t border-white/10 pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-white/70 text-sm">
                      {deposit.isMatured ? 'Matured on' : 'Matures on'}
                    </div>
                    <div className="text-white font-medium">
                      {formatDate(deposit.maturityDate)}
                    </div>
                  </div>
                  {!deposit.isMatured && (
                    <div className="text-right">
                      <div className="text-white/70 text-sm">Time remaining</div>
                      <div className="text-white font-medium">
                        {formatTimeRemaining(deposit.timeUntilMaturity)}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              {deposit.isMatured && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <button className="w-full py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300">
                    Redeem Position
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UserPositions;
