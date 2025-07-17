'use client';

import { motion } from 'framer-motion';
import type React from 'react';
import type { FormattedStrategy } from '../../hooks/useStrategies';
import { useStrategiesPagination } from '../../hooks/useStrategiesPagination';
import StrategiesFiltersComponent from '../filters/StrategiesFilters';
import SortAndViewControls from '../ui/SortAndViewControls';
import StrategyCard from '../ui/StrategyCard';
import StrategyListItem from '../ui/StrategyListItem';
import YieldPagination from '../ui/YieldPagination';

interface StrategiesGridProps {
  strategies: FormattedStrategy[];
  isLoading?: boolean;
  onStrategySelect?: (strategy: FormattedStrategy) => void;
  itemsPerPage?: number;
}

const StrategiesGrid: React.FC<StrategiesGridProps> = ({
  strategies,
  isLoading = false,
  onStrategySelect,
  itemsPerPage = 6,
}) => {
  const {
    paginatedStrategies,
    filteredStrategies,
    paginationInfo,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    filters,
    updateFilters,
    resetFilters,
    filterOptions,
    sortBy,
    sortDirection,
    handleSortChange,
    viewMode,
    handleViewModeChange,
  } = useStrategiesPagination(strategies, itemsPerPage);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const LoadingSkeleton = () => (
    <div
      className={
        viewMode === 'grid'
          ? 'grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'
          : 'space-y-4'
      }
    >
      {Array.from({ length: itemsPerPage }).map((_, index) => (
        <motion.div
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          className={`animate-pulse rounded-2xl border border-gray-700/30 bg-gray-800/20 ${viewMode === 'grid' ? 'p-6' : 'h-24 p-4'} `}
          initial={{ opacity: 0.5 }}
          key={index}
          transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="h-6 w-24 rounded-lg bg-gray-700/50" />
              <div className="h-5 w-16 rounded-full bg-gray-700/50" />
            </div>
            {viewMode === 'grid' && (
              <>
                <div className="h-4 w-full rounded bg-gray-700/50" />
                <div className="h-4 w-3/4 rounded bg-gray-700/50" />
                <div className="flex items-center justify-between">
                  <div className="h-8 w-20 rounded-lg bg-gray-700/50" />
                  <div className="h-8 w-24 rounded-lg bg-gray-700/50" />
                </div>
              </>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );

  const EmptyState = () => (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="py-12 text-center"
      initial={{ opacity: 0, y: 20 }}
    >
      <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-gray-700/30 bg-gray-800/40">
        <svg
          className="h-8 w-8 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
          />
        </svg>
      </div>
      <h3 className="mb-2 font-semibold text-lg text-white">
        No strategies found
      </h3>
      <p className="mb-4 text-gray-400">
        Try adjusting your filters to see more results
      </p>
      <motion.button
        className="rounded-xl border border-blue-500/30 bg-blue-500/20 px-6 py-2 text-blue-400 transition-all duration-200 hover:bg-blue-500/30"
        onClick={resetFilters}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Reset Filters
      </motion.button>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Filtres */}
      <StrategiesFiltersComponent
        filterOptions={filterOptions}
        filters={filters}
        isLoading={isLoading}
        onResetFilters={resetFilters}
        onUpdateFilters={updateFilters}
        totalResults={filteredStrategies.length}
      />

      {/* Contrôles de tri et vue */}
      {!isLoading && filteredStrategies.length > 0 && (
        <SortAndViewControls
          onSortChange={handleSortChange}
          onViewModeChange={handleViewModeChange}
          sortBy={sortBy}
          sortDirection={sortDirection}
          viewMode={viewMode}
        />
      )}

      {/* Contenu principal */}
      <div className="min-h-[600px]">
        {isLoading ? (
          <LoadingSkeleton />
        ) : filteredStrategies.length === 0 ? (
          <EmptyState />
        ) : (
          <motion.div
            animate="visible"
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'
                : 'space-y-4'
            }
            initial="hidden"
            key={`${paginationInfo.currentPage}-${viewMode}`}
            variants={containerVariants} // Re-trigger animation on page/view change
          >
            {paginatedStrategies.map((strategy, index) => (
              <motion.div
                key={strategy.id}
                variants={itemVariants}
                whileHover={
                  viewMode === 'grid'
                    ? {
                        y: -5,
                        transition: {
                          type: 'spring',
                          stiffness: 300,
                          damping: 20,
                        },
                      }
                    : undefined
                }
              >
                {viewMode === 'grid' ? (
                  <StrategyCard
                    onSelect={onStrategySelect}
                    strategy={strategy}
                  />
                ) : (
                  <StrategyListItem
                    index={index}
                    onSelect={onStrategySelect}
                    strategy={strategy}
                  />
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Pagination */}
      {!isLoading && filteredStrategies.length > 0 && (
        <YieldPagination
          currentPage={paginationInfo.currentPage}
          endIndex={paginationInfo.endIndex}
          itemsPerPage={paginationInfo.itemsPerPage}
          onNextPage={goToNextPage}
          onPageChange={goToPage}
          onPreviousPage={goToPreviousPage}
          startIndex={paginationInfo.startIndex}
          totalItems={paginationInfo.totalItems}
          totalPages={paginationInfo.totalPages}
        />
      )}
    </div>
  );
};

export default StrategiesGrid;
