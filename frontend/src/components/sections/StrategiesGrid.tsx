"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { FormattedStrategy } from '../../hooks/useStrategies';
import { useStrategiesPagination } from '../../hooks/useStrategiesPagination';
import StrategiesFiltersComponent from '../filters/StrategiesFilters';
import SortAndViewControls from '../ui/SortAndViewControls';
import YieldPagination from '../ui/YieldPagination';
import StrategyCard from '../ui/StrategyCard';
import StrategyListItem from '../ui/StrategyListItem';

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
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  const LoadingSkeleton = () => (
    <div className={viewMode === 'grid' 
      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      : "space-y-4"
    }>
      {Array.from({ length: itemsPerPage }).map((_, index) => (
        <motion.div
          key={index}
          className={`bg-gray-800/20 border border-gray-700/30 rounded-2xl animate-pulse
            ${viewMode === 'grid' ? 'p-6' : 'p-4 h-24'}
          `}
          initial={{ opacity: 0.5 }}
          animate={{ opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="h-6 bg-gray-700/50 rounded-lg w-24"></div>
              <div className="h-5 bg-gray-700/50 rounded-full w-16"></div>
            </div>
            {viewMode === 'grid' && (
              <>
                <div className="h-4 bg-gray-700/50 rounded w-full"></div>
                <div className="h-4 bg-gray-700/50 rounded w-3/4"></div>
                <div className="flex items-center justify-between">
                  <div className="h-8 bg-gray-700/50 rounded-lg w-20"></div>
                  <div className="h-8 bg-gray-700/50 rounded-lg w-24"></div>
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-12"
    >
      <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-800/40 
                      rounded-2xl border border-gray-700/30 mb-4">
        <svg 
          className="w-8 h-8 text-gray-400" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth="2" 
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
          />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">
        No strategies found
      </h3>
      <p className="text-gray-400 mb-4">
        Try adjusting your filters to see more results
      </p>
      <motion.button
        className="px-6 py-2 bg-blue-500/20 text-blue-400 border border-blue-500/30 
                   rounded-xl hover:bg-blue-500/30 transition-all duration-200"
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
        filters={filters}
        onUpdateFilters={updateFilters}
        onResetFilters={resetFilters}
        filterOptions={filterOptions}
        totalResults={filteredStrategies.length}
        isLoading={isLoading}
      />

      {/* Contrôles de tri et vue */}
      {!isLoading && filteredStrategies.length > 0 && (
        <SortAndViewControls
          sortBy={sortBy}
          sortDirection={sortDirection}
          viewMode={viewMode}
          onSortChange={handleSortChange}
          onViewModeChange={handleViewModeChange}
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
            className={viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
            }
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            key={`${paginationInfo.currentPage}-${viewMode}`} // Re-trigger animation on page/view change
          >
            {paginatedStrategies.map((strategy, index) => (
              <motion.div
                key={strategy.id}
                variants={itemVariants}
                whileHover={viewMode === 'grid' ? { 
                  y: -5,
                  transition: { type: "spring", stiffness: 300, damping: 20 }
                } : undefined}
              >
                {viewMode === 'grid' ? (
                  <StrategyCard
                    strategy={strategy}
                    onSelect={onStrategySelect}
                  />
                ) : (
                  <StrategyListItem
                    strategy={strategy}
                    onSelect={onStrategySelect}
                    index={index}
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
          totalPages={paginationInfo.totalPages}
          totalItems={paginationInfo.totalItems}
          itemsPerPage={paginationInfo.itemsPerPage}
          startIndex={paginationInfo.startIndex}
          endIndex={paginationInfo.endIndex}
          onPageChange={goToPage}
          onNextPage={goToNextPage}
          onPreviousPage={goToPreviousPage}
        />
      )}
    </div>
  );
};

export default StrategiesGrid;
