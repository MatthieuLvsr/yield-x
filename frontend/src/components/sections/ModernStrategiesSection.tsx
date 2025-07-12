"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import DepositModalModern from '@/components/ui/DepositModalModern';
import { useStrategies, FormattedStrategy } from '@/hooks/useStrategies';

const getRiskColor = (risk: string) => {
  switch (risk) {
    case 'Low': return 'text-green-400 bg-green-400/10 border-green-400/20';
    case 'Medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
    case 'High': return 'text-red-400 bg-red-400/10 border-red-400/20';
    default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
  }
};

const StrategyCard: React.FC<{ strategy: FormattedStrategy; index: number; onDeposit: (strategy: FormattedStrategy) => void }> = ({ strategy, index, onDeposit }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className={`glass-card p-6 rounded-2xl border border-white/10 transition-all duration-500 cursor-pointer ${
        isHovered ? 'border-indigo-400/50 scale-105' : ''
      }`}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <span className="text-white font-bold">{strategy.token.charAt(0)}</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">{strategy.name}</h3>
            <p className="text-white/60 text-sm">{strategy.protocol}</p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full border text-xs font-medium ${getRiskColor(strategy.risk)}`}>
          {strategy.risk} Risk
        </div>
      </div>

      {/* Description */}
      <p className="text-white/70 text-sm mb-6 leading-relaxed">
        {strategy.description}
      </p>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="space-y-1">
          <div className="text-2xl font-bold text-green-400">{strategy.apy}%</div>
          <div className="text-white/50 text-xs uppercase tracking-wider">APY</div>
        </div>
        <div className="space-y-1">
          <div className="text-lg font-semibold text-white">{strategy.tvl}</div>
          <div className="text-white/50 text-xs uppercase tracking-wider">TVL</div>
        </div>
      </div>

      {/* Token Badge */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-indigo-400 to-purple-500"></div>
          <span className="text-white/80 font-medium">{strategy.token}</span>
        </div>
        <div className="text-white/60 text-sm">
          Available
        </div>
      </div>

      {/* Action Button */}
      <button 
        onClick={() => onDeposit(strategy)}
        className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-[1.02]"
      >
        Deposit Now
      </button>
    </motion.div>
  );
};

const ModernStrategiesSection: React.FC = () => {
  const [selectedStrategy, setSelectedStrategy] = useState<FormattedStrategy | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Utiliser le hook pour récupérer les stratégies dynamiquement
  const { strategies, isLoading, error, refetch } = useStrategies();

  const handleDeposit = (strategy: FormattedStrategy) => {
    setSelectedStrategy(strategy);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedStrategy(null);
  };

  // Affichage de chargement
  if (isLoading) {
    return (
      <section className="py-24 px-6 relative">
        <div className="container mx-auto relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 text-white/60">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white/60 rounded-full animate-spin"></div>
              <span>Loading strategies...</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Affichage d'erreur
  if (error) {
    return (
      <section className="py-24 px-6 relative">
        <div className="container mx-auto relative z-10">
          <div className="text-center">
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 max-w-md mx-auto">
              <h3 className="text-red-400 font-medium mb-2">Failed to load strategies</h3>
              <p className="text-white/70 text-sm mb-4">{error}</p>
              <button 
                onClick={refetch}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 px-6 relative">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 left-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl"></div>
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
            <span className="gradient-text">Earn</span>
            <span className="text-white ml-4">Strategies</span>
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
            Choose from our curated selection of yield strategies, each optimized 
            for different risk profiles and return expectations.
          </p>
          
          {/* Refresh button and strategies info */}
          <div className="flex items-center justify-center space-x-4 mt-6">
            <button
              onClick={refetch}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-lg transition-colors flex items-center space-x-2"
            >
              <span>🔄</span>
              <span>Refresh Strategies</span>
            </button>
            <span className="text-white/60 text-sm">
              {strategies.length} strategies available
            </span>
          </div>
        </motion.div>

        {/* Strategies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {strategies.map((strategy, index) => (
            <StrategyCard 
              key={strategy.id} 
              strategy={strategy} 
              index={index} 
              onDeposit={handleDeposit}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="glass-card p-8 rounded-2xl border border-white/10 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">
              Don't see what you're looking for?
            </h3>
            <p className="text-white/70 mb-6">
              We're constantly adding new strategies. Join our community to suggest new protocols.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all duration-300">
                Request Strategy
              </button>
              <button className="px-6 py-3 glass-card border border-white/20 text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-300">
                Join Discord
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Deposit Modal */}
      {selectedStrategy && (
        <DepositModalModern
          isOpen={isModalOpen}
          onClose={closeModal}
          strategy={{
            ...selectedStrategy,
            lockPeriod: '30 days' // Add default lock period
          }}
        />
      )}
    </section>
  );
};

export default ModernStrategiesSection;
