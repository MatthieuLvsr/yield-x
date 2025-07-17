'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import type { Stats, Strategy } from '@/app/page';
import {
  type FormattedStrategy,
  useStrategies,
} from '../../hooks/useStrategies';
import DepositModalModern from '../ui/DepositModalModern';
import { StrategiesGrid } from './StrategiesGrid';
import StrategiesHeader from './StrategiesHeader';

const StrategiesSection = ({
  stats,
  strategies: strats,
}: {
  stats: Stats;
  strategies: Strategy[];
}) => {
  const { strategies, isLoading, error, refetch } = useStrategies();
  const [selectedStrategy, setSelectedStrategy] =
    useState<FormattedStrategy | null>(null);
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
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-red-500/30 bg-red-500/20">
            <svg
              className="h-8 w-8 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <title>svg</title>
              <path
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
          </div>
          <h3 className="mb-2 font-semibold text-lg text-red-400">
            Failed to load strategies
          </h3>
          <p className="mb-4 text-gray-400">{error}</p>
          <motion.button
            className="rounded-xl border border-red-500/30 bg-red-500/20 px-6 py-2 text-red-400 transition-all duration-200 hover:bg-red-500/30"
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
    <section className="relative px-4 py-16" id="strategies">
      <div className="container mx-auto">
        <StrategiesHeader
          isLoading={isLoading}
          onRefresh={refetch}
          stats={stats}
          strategiesCount={strategies.length}
        />

        <StrategiesGrid
          isLoading={isLoading}
          itemsPerPage={6}
          onStrategySelect={handleStrategySelect}
          strategies={strategies}
        />

        {selectedStrategy && (
          <DepositModalModern
            isOpen={isDepositModalOpen}
            onClose={handleCloseModal}
            strategy={selectedStrategy}
          />
        )}
      </div>
    </section>
  );
};

export default StrategiesSection;
