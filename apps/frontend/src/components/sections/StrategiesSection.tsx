'use client';

import { useState } from 'react';
import type { Stats, Strategy } from '@/app/page';
import { DepositModal } from '../ui/DepositModalModern';
import { StrategiesGrid } from './StrategiesGrid';
import StrategiesHeader from './StrategiesHeader';

export const StrategiesSection = ({
  stats,
  strategies,
}: {
  stats: Stats;
  strategies: Strategy[];
}) => {
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(
    null
  );
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);

  const handleStrategySelect = (strategy: Strategy) => {
    setSelectedStrategy(strategy);
    setIsDepositModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsDepositModalOpen(false);
    setSelectedStrategy(null);
  };
  return (
    <section className="relative px-4 py-16" id="strategies">
      <div className="container mx-auto">
        <StrategiesHeader stats={stats} strategiesCount={strategies.length} />

        <StrategiesGrid
          itemsPerPage={6}
          onStrategySelect={handleStrategySelect}
          strategies={strategies}
        />

        {selectedStrategy && (
          <DepositModal
            isOpen={isDepositModalOpen}
            onClose={handleCloseModal}
            strategy={selectedStrategy}
          />
        )}
      </div>
    </section>
  );
};
