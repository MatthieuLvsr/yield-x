"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FormattedStrategy, useStrategies } from '../../hooks/useStrategies';
import StrategiesGrid from './StrategiesGrid';
import StrategiesHeader from './StrategiesHeader';
import DepositModalModern from '../ui/DepositModalModern';

const StrategiesSection: React.FC = () => {
  const { strategies, isLoading, error, refetch } = useStrategies();
  const [selectedStrategy, setSelectedStrategy] = useState<FormattedStrategy | null>(null);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);

  const handleStrategySelect = (strategy: FormattedStrategy) => {
    setSelectedStrategy(strategy);
    setIsDepositModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsDepositModalOpen(false);
    setSelectedStrategy(null);
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500/20 
                          rounded-2xl border border-red-500/30 mb-4">
            <svg 
              className="w-8 h-8 text-red-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" 
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-red-400 mb-2">
            Failed to load strategies
          </h3>
          <p className="text-gray-400 mb-4">
            {error}
          </p>
          <motion.button
            className="px-6 py-2 bg-red-500/20 text-red-400 border border-red-500/30 
                       rounded-xl hover:bg-red-500/30 transition-all duration-200"
            onClick={refetch}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Try Again
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <section className="relative py-16 px-4" id="strategies">
      <div className="container mx-auto">
        {/* Header */}
        <StrategiesHeader
          strategiesCount={strategies.length}
          onRefresh={refetch}
          isLoading={isLoading}
        />

        {/* Strategies Grid */}
        <StrategiesGrid
          strategies={strategies}
          isLoading={isLoading}
          onStrategySelect={handleStrategySelect}
          itemsPerPage={6}
        />

        {/* Deposit Modal */}
        {selectedStrategy && (
          <DepositModalModern
            strategy={selectedStrategy}
            isOpen={isDepositModalOpen}
            onClose={handleCloseModal}
          />
        )}
      </div>
    </section>
  );
};

export default StrategiesSection;
