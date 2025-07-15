'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowUpDown,
  Grid,
  List,
  SortAsc,
  SortDesc,
  Table,
} from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import UserDepositsFiltersComponent from '@/components/filters/UserDepositsFilters';
import { UserDepositCard } from '@/components/ui/UserDepositCard';
import { UserDepositListItem } from '@/components/ui/UserDepositListItem';
import { UserDepositTable } from '@/components/ui/UserDepositTable';
import YieldPagination from '@/components/ui/YieldPagination';
import { useUserDeposits } from '@/hooks/useUserDeposits';
import { useUserDepositsPagination } from '@/hooks/useUserDepositsPagination';

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
    { value: 'maturityDate', label: "Date d'échéance" },
  ];

  const handleSort = (option: string) => {
    const newDirection =
      sortBy === option && sortDirection === 'asc' ? 'desc' : 'asc';
    handleSortChange(option as any, newDirection as any);
  };

  const getSortIcon = (option: string) => {
    if (sortBy !== option) return <ArrowUpDown className="h-4 w-4" />;
    return sortDirection === 'asc' ? (
      <SortAsc className="h-4 w-4" />
    ) : (
      <SortDesc className="h-4 w-4" />
    );
  };

  if (error) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <div className="mb-2 font-medium text-lg text-red-400">
            Erreur de chargement
          </div>
          <div className="text-gray-400 text-sm">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen space-y-6"
      style={{ transform: 'translateZ(0)', backfaceVisibility: 'hidden' }}
    >
      {/* En-tête avec statistiques */}
      <div className="rounded-2xl border border-gray-800/50 bg-black/40 p-6 backdrop-blur-sm">
        <h2 className="mb-4 font-bold text-2xl text-white">Mes Positions</h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div className="rounded-xl border border-gray-700/50 bg-gray-900/50 p-4">
            <div className="text-gray-400 text-sm">Total positions</div>
            <div className="font-bold text-2xl text-white">
              {stats.totalDeposits}
            </div>
          </div>
          <div className="rounded-xl border border-gray-700/50 bg-gray-900/50 p-4">
            <div className="text-gray-400 text-sm">Valeur totale</div>
            <div className="font-bold text-2xl text-white">
              ${stats.totalValue.toLocaleString()}
            </div>
          </div>
          <div className="rounded-xl border border-gray-700/50 bg-gray-900/50 p-4">
            <div className="text-gray-400 text-sm">Rendements</div>
            <div className="font-bold text-2xl text-green-400">
              ${stats.totalYield.toLocaleString()}
            </div>
          </div>
          <div className="rounded-xl border border-gray-700/50 bg-gray-900/50 p-4">
            <div className="text-gray-400 text-sm">Positions actives</div>
            <div className="font-bold text-2xl text-blue-400">
              {stats.activeDeposits}
            </div>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <UserDepositsFiltersComponent
        filterOptions={filterOptions}
        filters={filters}
        isLoading={isLoading}
        onResetFilters={resetFilters}
        onUpdateFilters={updateFilters}
        totalResults={filteredDeposits.length}
      />

      {/* Contrôles de tri et vue */}
      <div className="rounded-2xl border border-gray-800/50 bg-black/40 p-6 backdrop-blur-sm">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          {/* Tri */}
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm">Trier par:</span>
            <div className="flex gap-2">
              {sortOptions.map((option) => (
                <motion.button
                  className={`flex items-center gap-2 rounded-lg border px-3 py-2 transition-all ${
                    sortBy === option.value
                      ? 'border-blue-500/30 bg-blue-500/20 text-blue-400'
                      : 'border-gray-700/50 bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                  }`}
                  key={option.value}
                  onClick={() => handleSort(option.value)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {option.label}
                  {getSortIcon(option.value)}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Vue */}
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm">Vue:</span>
            <div className="flex overflow-hidden rounded-lg border border-gray-700/50">
              <motion.button
                className={`p-2 transition-all ${
                  viewMode === 'grid'
                    ? 'bg-blue-500/20 text-blue-400'
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                }`}
                onClick={() => handleViewModeChange('grid')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Grid className="h-4 w-4" />
              </motion.button>
              <motion.button
                className={`p-2 transition-all ${
                  viewMode === 'list'
                    ? 'bg-blue-500/20 text-blue-400'
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                }`}
                onClick={() => handleViewModeChange('list')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <List className="h-4 w-4" />
              </motion.button>
              <motion.button
                className={`p-2 transition-all ${
                  viewMode === 'table'
                    ? 'bg-blue-500/20 text-blue-400'
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                }`}
                onClick={() => handleViewModeChange('table')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
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
              animate={{ opacity: 1 }}
              className="flex min-h-[400px] items-center justify-center"
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
            >
              <div className="text-center">
                <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-400 border-t-transparent" />
                <div className="text-gray-400">Chargement des positions...</div>
              </div>
            </motion.div>
          ) : paginatedDeposits.length === 0 ? (
            <motion.div
              animate={{ opacity: 1 }}
              className="flex min-h-[400px] items-center justify-center"
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
            >
              <div className="text-center">
                <div className="mb-2 text-gray-400 text-lg">
                  Aucune position trouvée
                </div>
                <div className="text-gray-500 text-sm">
                  {deposits.length === 0
                    ? "Vous n'avez pas encore de positions"
                    : 'Essayez de modifier vos filtres'}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              animate={{ opacity: 1 }}
              className="space-y-6"
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
            >
              {/* Grille/Liste des dépôts */}
              {viewMode === 'grid' && (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {paginatedDeposits.map((deposit, index) => (
                    <motion.div
                      animate={{ opacity: 1, y: 0 }}
                      initial={{ opacity: 0, y: 20 }}
                      key={deposit.publicKey}
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
                      animate={{ opacity: 1, x: 0 }}
                      initial={{ opacity: 0, x: -20 }}
                      key={deposit.publicKey}
                      transition={{ delay: index * 0.1 }}
                    >
                      <UserDepositListItem deposit={deposit} />
                    </motion.div>
                  ))}
                </div>
              )}

              {viewMode === 'table' && (
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  initial={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <UserDepositTable
                    deposits={paginatedDeposits}
                    onSort={handleSort}
                    sortBy={sortBy}
                    sortOrder={sortDirection}
                  />
                </motion.div>
              )}

              {/* Pagination */}
              {paginationInfo.totalPages > 1 && (
                <div className="flex justify-center">
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
