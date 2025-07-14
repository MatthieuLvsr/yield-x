"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Grid, List, Table, ArrowUpDown, SortAsc, SortDesc } from 'lucide-react';
import { useUserDeposits } from '@/hooks/useUserDeposits';
import { useUserDepositsPagination } from '@/hooks/useUserDepositsPagination';
import UserDepositsFiltersComponent from '@/components/filters/UserDepositsFilters';
import { UserDepositCard } from '@/components/ui/UserDepositCard';
import { UserDepositListItem } from '@/components/ui/UserDepositListItem';
import { UserDepositTable } from '@/components/ui/UserDepositTable';
import YieldPagination from '@/components/ui/YieldPagination';

const UserDepositsSection: React.FC = () => {
  const { deposits, stats: userStats, isLoading, error } = useUserDeposits();
  
  const {
    paginatedDeposits,
    filteredDeposits,
    paginationInfo,
    sortBy,
    sortDirection,
    handleSortChange,
    viewMode,
    handleViewModeChange,
    filters,
    updateFilters,
    resetFilters,
    filterOptions,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    stats,
  } = useUserDepositsPagination(deposits, 12);

  // Extraire les options de filtres depuis le hook

  const sortOptions = [
    { value: 'depositDate', label: 'Date de dépôt' },
    { value: 'amount', label: 'Montant' },
    { value: 'yieldAmount', label: 'Rendement' },
    { value: 'apy', label: 'APY' },
    { value: 'maturityDate', label: 'Date d\'échéance' },
  ];

  const handleSort = (option: string) => {
    const newDirection = sortBy === option && sortDirection === 'asc' ? 'desc' : 'asc';
    handleSortChange(option as any, newDirection as any);
  };

  const getSortIcon = (option: string) => {
    if (sortBy !== option) return <ArrowUpDown className="h-4 w-4" />;
    return sortDirection === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />;
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="text-red-400 text-lg font-medium mb-2">Erreur de chargement</div>
          <div className="text-gray-400 text-sm">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 min-h-screen" style={{ transform: 'translateZ(0)', backfaceVisibility: 'hidden' }}>
      {/* En-tête avec statistiques */}
      <div className="bg-black/40 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-white mb-4">Mes Positions</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-4">
            <div className="text-sm text-gray-400">Total positions</div>
            <div className="text-2xl font-bold text-white">{stats.totalDeposits}</div>
          </div>
          <div className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-4">
            <div className="text-sm text-gray-400">Valeur totale</div>
            <div className="text-2xl font-bold text-white">${stats.totalValue.toLocaleString()}</div>
          </div>
          <div className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-4">
            <div className="text-sm text-gray-400">Rendements</div>
            <div className="text-2xl font-bold text-green-400">${stats.totalYield.toLocaleString()}</div>
          </div>
          <div className="bg-gray-900/50 border border-gray-700/50 rounded-xl p-4">
            <div className="text-sm text-gray-400">Positions actives</div>
            <div className="text-2xl font-bold text-blue-400">{stats.activeDeposits}</div>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <UserDepositsFiltersComponent
        filters={filters}
        onUpdateFilters={updateFilters}
        onResetFilters={resetFilters}
        filterOptions={filterOptions}
        totalResults={filteredDeposits.length}
        isLoading={isLoading}
      />

      {/* Contrôles de tri et vue */}
      <div className="bg-black/40 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          {/* Tri */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Trier par:</span>
            <div className="flex gap-2">
              {sortOptions.map((option) => (
                <motion.button
                  key={option.value}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleSort(option.value)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${
                    sortBy === option.value
                      ? 'bg-blue-500/20 border-blue-500/30 text-blue-400'
                      : 'bg-gray-800/50 border-gray-700/50 text-gray-300 hover:bg-gray-700/50'
                  }`}
                >
                  {option.label}
                  {getSortIcon(option.value)}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Vue */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Vue:</span>
            <div className="flex border border-gray-700/50 rounded-lg overflow-hidden">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleViewModeChange('grid')}
                className={`p-2 transition-all ${
                  viewMode === 'grid'
                    ? 'bg-blue-500/20 text-blue-400'
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                }`}
              >
                <Grid className="h-4 w-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleViewModeChange('list')}
                className={`p-2 transition-all ${
                  viewMode === 'list'
                    ? 'bg-blue-500/20 text-blue-400'
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                }`}
              >
                <List className="h-4 w-4" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleViewModeChange('table')}
                className={`p-2 transition-all ${
                  viewMode === 'table'
                    ? 'bg-blue-500/20 text-blue-400'
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                }`}
              >
                <Table className="h-4 w-4" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="min-h-[600px]">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center min-h-[400px]"
            >
              <div className="text-center">
                <div className="animate-spin h-12 w-12 border-4 border-blue-400 border-t-transparent rounded-full mx-auto mb-4" />
                <div className="text-gray-400">Chargement des positions...</div>
              </div>
            </motion.div>
          ) : paginatedDeposits.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center min-h-[400px]"
            >
              <div className="text-center">
                <div className="text-gray-400 text-lg mb-2">Aucune position trouvée</div>
                <div className="text-gray-500 text-sm">
                  {deposits.length === 0 
                    ? 'Vous n\'avez pas encore de positions' 
                    : 'Essayez de modifier vos filtres'
                  }
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
            {/* Grille/Liste des dépôts */}
            {viewMode === 'grid' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedDeposits.map((deposit, index) => (
                  <motion.div
                    key={deposit.publicKey}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <UserDepositCard deposit={deposit} />
                  </motion.div>
                ))}
              </div>
            )}

            {viewMode === 'list' && (
              <div className="space-y-4">
                {paginatedDeposits.map((deposit, index) => (
                  <motion.div
                    key={deposit.publicKey}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <UserDepositListItem deposit={deposit} />
                  </motion.div>
                ))}
              </div>
            )}

            {viewMode === 'table' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <UserDepositTable 
                  deposits={paginatedDeposits}
                  sortBy={sortBy}
                  sortOrder={sortDirection}
                  onSort={handleSort}
                />
              </motion.div>
            )}

            {/* Pagination */}
            {paginationInfo.totalPages > 1 && (
              <div className="flex justify-center">
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
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    </div>
  );
};

export default UserDepositsSection;
