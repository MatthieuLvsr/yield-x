'use client';

import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import type React from 'react';
import { useState } from 'react';
import { DepositModal } from '@/components/ui/DepositModalModern';
import YieldButton from '@/components/ui/YieldButton';
import YieldCard from '@/components/ui/YieldCard';
import { type FormattedStrategy, useStrategies } from '@/hooks/useStrategies';

const getRiskColor = (risk: string) => {
  switch (risk) {
    case 'Low':
      return 'text-green-400 bg-green-400/10 border-green-400/20';
    case 'Medium':
      return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
    case 'High':
      return 'text-red-400 bg-red-400/10 border-red-400/20';
    default:
      return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
  }
};

const StrategyCard: React.FC<{
  strategy: FormattedStrategy;
  index: number;
  onDeposit: (strategy: FormattedStrategy) => void;
}> = ({ strategy, index, onDeposit }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 30 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <YieldCard
        className={`cursor-pointer p-6 transition-all duration-500 ${
          isHovered ? 'scale-[1.02] transform border-blue-400/30' : ''
        }`}
        variant="glass"
      >
        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-green-500 shadow-lg">
              <span className="font-bold text-white">
                {strategy.token.charAt(0)}
              </span>
            </div>
            <div>
              <h3 className="font-bold text-white text-xl">{strategy.name}</h3>
              <p className="text-gray-400 text-sm">{strategy.protocol}</p>
            </div>
          </div>
          <div
            className={`rounded-full border px-3 py-1 font-medium text-xs ${getRiskColor(strategy.risk)}`}
          >
            {strategy.risk} Risk
          </div>
        </div>

        {/* Description */}
        <p className="mb-6 text-gray-300 text-sm leading-relaxed">
          {strategy.description}
        </p>

        {/* Metrics */}
        <div className="mb-6 grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="font-bold text-2xl text-blue-400">
              {strategy.apy}%
            </div>
            <div className="text-gray-400 text-xs uppercase tracking-wider">
              APY
            </div>
          </div>
          <div className="space-y-1">
            <div className="font-semibold text-lg text-white">
              {strategy.tvl}
            </div>
            <div className="text-gray-400 text-xs uppercase tracking-wider">
              TVL
            </div>
          </div>
        </div>

        {/* Token Badge */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-6 w-6 rounded-full bg-gradient-to-br from-blue-500 to-green-500" />
            <span className="font-medium text-gray-300">{strategy.token}</span>
          </div>
          <div className="text-gray-400 text-sm">Available</div>
        </div>

        {/* Action Button */}
        <YieldButton
          className="w-full"
          onClick={() => onDeposit(strategy)}
          size="md"
          variant="primary"
        >
          Deposit Now
        </YieldButton>
      </YieldCard>
    </motion.div>
  );
};

const ModernStrategiesSection: React.FC = () => {
  const [selectedStrategy, setSelectedStrategy] =
    useState<FormattedStrategy | null>(null);
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
      <section className="relative px-6 py-24">
        <div className="container relative z-10 mx-auto">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 text-white/60">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white/60" />
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
      <section className="relative px-6 py-24">
        <div className="container relative z-10 mx-auto">
          <div className="text-center">
            <div className="mx-auto max-w-md rounded-xl border border-red-500/20 bg-red-500/10 p-6">
              <h3 className="mb-2 font-medium text-red-400">
                Failed to load strategies
              </h3>
              <p className="mb-4 text-sm text-white/70">{error}</p>
              <button
                className="rounded-lg bg-red-600 px-4 py-2 text-sm text-white transition-colors hover:bg-red-700"
                onClick={refetch}
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
    <section className="relative px-6 py-24">
      {/* Background Elements subtils */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 right-1/4 h-64 w-64 rounded-full bg-purple-500/5 blur-3xl" />
        <div className="absolute bottom-1/3 left-1/4 h-80 w-80 rounded-full bg-blue-500/5 blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto">
        {/* Section Header */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="mb-6 font-bold text-5xl md:text-6xl">
            <span className="yieldx-text-gradient">Earn</span>
            <span className="ml-4 text-white">Strategies</span>
          </h2>
          <p className="mx-auto max-w-2xl text-gray-300 text-xl leading-relaxed">
            Choose from our curated selection of yield strategies, each
            optimized for different risk profiles and return expectations.
          </p>

          {/* Refresh button and strategies info */}
          <div className="mt-6 flex items-center justify-center space-x-4">
            <button
              className="yieldx-btn-primary flex items-center space-x-2 text-sm"
              onClick={refetch}
            >
              <ArrowPathIcon className="h-4 w-4" />
              <span>Refresh Strategies</span>
            </button>
            <span className="text-gray-400 text-sm">
              {strategies.length} strategies available
            </span>
          </div>
        </motion.div>

        {/* Strategies Grid */}
        <div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {strategies.map((strategy, index) => (
            <StrategyCard
              index={index}
              key={strategy.id}
              onDeposit={handleDeposit}
              strategy={strategy}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="glass-card mx-auto max-w-2xl rounded-2xl border border-white/10 p-8">
            <h3 className="mb-4 font-bold text-2xl text-white">
              Ready to explore more strategies?
            </h3>
            <p className="mb-6 text-white/70">
              Discover our complete collection of yield strategies with advanced
              filtering and sorting options.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <YieldButton
                onClick={() => (window.location.href = '/strategies')}
                size="lg"
                variant="primary"
              >
                View All Strategies
              </YieldButton>
              <button className="glass-card rounded-xl border border-white/20 px-6 py-3 font-semibold text-white transition-all duration-300 hover:bg-white/10">
                Join Discord
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Deposit Modal */}
      {selectedStrategy && (
        <DepositModal
          isOpen={isModalOpen}
          onClose={closeModal}
          strategy={{
            ...selectedStrategy,
          }}
        />
      )}
    </section>
  );
};

export default ModernStrategiesSection;
