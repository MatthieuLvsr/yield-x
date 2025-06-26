"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface Position {
  id: string;
  strategy: string;
  token: string;
  deposited: number;
  currentValue: number;
  apy: number;
  rewards: number;
  status: 'Active' | 'Pending' | 'Withdrawing';
}

const positions: Position[] = [
  {
    id: '1',
    strategy: 'Stable Yield',
    token: 'USDC',
    deposited: 5000,
    currentValue: 5248.50,
    apy: 8.5,
    rewards: 248.50,
    status: 'Active'
  },
  {
    id: '2',
    strategy: 'SOL Staking+',
    token: 'SOL',
    deposited: 100,
    currentValue: 118.7,
    apy: 15.2,
    rewards: 18.7,
    status: 'Active'
  }
];

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
  
  const totalValue = positions.reduce((sum, pos) => sum + pos.currentValue, 0);
  const totalDeposited = positions.reduce((sum, pos) => sum + pos.deposited, 0);
  const totalRewards = positions.reduce((sum, pos) => sum + pos.rewards, 0);
  const totalReturn = ((totalValue - totalDeposited) / totalDeposited) * 100;

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
              ${totalValue.toLocaleString()}
            </div>
            <div className="text-white/60 text-sm uppercase tracking-wider">
              Total Value
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-white/10">
            <div className="text-3xl font-bold text-green-400 mb-2">
              ${totalRewards.toLocaleString()}
            </div>
            <div className="text-white/60 text-sm uppercase tracking-wider">
              Total Rewards
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-white/10">
            <div className="text-3xl font-bold text-blue-400 mb-2">
              +{totalReturn.toFixed(1)}%
            </div>
            <div className="text-white/60 text-sm uppercase tracking-wider">
              Total Return
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-white/10">
            <div className="text-3xl font-bold text-purple-400 mb-2">
              {positions.length}
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
              {positions.map((position, index) => (
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
                          {position.deposited.toLocaleString()} {position.token}
                        </div>
                        <div className="text-white/50 text-xs uppercase tracking-wider">
                          Deposited
                        </div>
                      </div>
                      <div className="text-center lg:text-right">
                        <div className="text-lg font-semibold text-white">
                          {position.currentValue.toLocaleString()} {position.token}
                        </div>
                        <div className="text-white/50 text-xs uppercase tracking-wider">
                          Current Value
                        </div>
                      </div>
                      <div className="text-center lg:text-right">
                        <div className="text-lg font-semibold text-green-400">
                          {position.apy}%
                        </div>
                        <div className="text-white/50 text-xs uppercase tracking-wider">
                          APY
                        </div>
                      </div>
                      <div className="text-center lg:text-right">
                        <div className="text-lg font-semibold text-purple-400">
                          +{position.rewards} {position.token}
                        </div>
                        <div className="text-white/50 text-xs uppercase tracking-wider">
                          Rewards
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3 mt-6 pt-6 border-t border-white/10">
                    <button className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 text-sm">
                      Add More
                    </button>
                    <button className="px-4 py-2 glass-card border border-white/20 text-white font-medium rounded-lg hover:bg-white/10 transition-all duration-300 text-sm">
                      Withdraw
                    </button>
                    <button className="px-4 py-2 text-white/70 hover:text-white transition-colors duration-300 text-sm">
                      View Details
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default ModernPortfolioSection;
