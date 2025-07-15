'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronDown,
  ChevronUp,
  Clock,
  DollarSign,
  Filter,
  RefreshCw,
  Search,
  TrendingUp,
  X,
} from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { OptimizedCustomRangeSlider } from '@/components/ui/OptimizedCustomRangeSlider';
import type { UserDepositsFilters } from '@/hooks/useUserDepositsPagination';

interface UserDepositsFiltersProps {
  filters: UserDepositsFilters;
  onUpdateFilters: (filters: Partial<UserDepositsFilters>) => void;
  onResetFilters: () => void;
  filterOptions: {
    tokens: string[];
    strategies: string[];
    apyRange: [number, number];
    amountRange: [number, number];
  };
  totalResults: number;
  isLoading?: boolean;
}

const UserDepositsFiltersComponent: React.FC<UserDepositsFiltersProps> = ({
  filters,
  onUpdateFilters,
  onResetFilters,
  filterOptions,
  totalResults,
  isLoading = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const hasActiveFilters =
    filters.token !== 'All' ||
    filters.status !== 'All' ||
    filters.strategy !== 'All' ||
    filters.searchTerm !== '' ||
    filters.apyRange[0] !== filterOptions.apyRange[0] ||
    filters.apyRange[1] !== filterOptions.apyRange[1] ||
    filters.amountRange[0] !== filterOptions.amountRange[0] ||
    filters.amountRange[1] !== filterOptions.amountRange[1];

  const statusColors = {
    Active: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    Matured: 'text-green-400 bg-green-400/10 border-green-400/20',
    All: 'text-gray-400 bg-gray-400/10 border-gray-400/20',
  } as const;

  const getStatusColor = (status: string) => {
    return (
      statusColors[status as keyof typeof statusColors] || statusColors.All
    );
  };

  const handleDropdownToggle = (dropdown: string) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const formatAmount = (amount: number) => {
    if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)}M`;
    if (amount >= 1000) return `${(amount / 1000).toFixed(1)}K`;
    return amount.toString();
  };

  return (
    <div className="w-full space-y-4" style={{ willChange: 'transform' }}>
      {/* Barre de filtres principale */}
      <div className="rounded-2xl border border-gray-800/50 bg-black/40 p-6 backdrop-blur-sm">
        <div className="flex flex-col gap-4 lg:flex-row">
          {/* Barre de recherche */}
          <div className="relative flex-1">
            <Search className="-translate-y-1/2 absolute top-1/2 left-4 h-5 w-5 transform text-gray-400" />
            <input
              className="w-full rounded-xl border border-gray-700/50 bg-gray-900/50 py-3 pr-12 pl-12 text-white placeholder-gray-400 focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                onUpdateFilters({ searchTerm: e.target.value })
              }
              placeholder="Rechercher par adresse, montant..."
              type="text"
              value={filters.searchTerm}
            />
            {filters.searchTerm && (
              <motion.button
                className="-translate-y-1/2 absolute top-1/2 right-4 transform p-1 text-gray-400 transition-colors hover:text-white"
                onClick={() => onUpdateFilters({ searchTerm: '' })}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <X className="h-4 w-4" />
              </motion.button>
            )}
          </div>

          {/* Bouton filtres avancés */}
          <motion.button
            className={`flex items-center gap-2 rounded-xl border px-6 py-3 transition-all ${
              isExpanded
                ? 'border-blue-500/30 bg-blue-500/20 text-blue-400'
                : 'border-gray-700/50 bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
            }`}
            onClick={() => setIsExpanded(!isExpanded)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Filter className="h-5 w-5" />
            Filtres
            {hasActiveFilters && (
              <span className="rounded-full bg-blue-500 px-2 py-1 text-white text-xs">
                {
                  Object.values(filters).filter(
                    (v) =>
                      v !== 'All' &&
                      v !== '' &&
                      JSON.stringify(v) !==
                        JSON.stringify(filterOptions.apyRange) &&
                      JSON.stringify(v) !==
                        JSON.stringify(filterOptions.amountRange)
                  ).length
                }
              </span>
            )}
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </motion.button>

          {/* Bouton reset */}
          {hasActiveFilters && (
            <motion.button
              className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/20 px-6 py-3 text-red-400 transition-colors hover:bg-red-500/30"
              onClick={onResetFilters}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <RefreshCw className="h-4 w-4" />
              Réinitialiser
            </motion.button>
          )}
        </div>

        {/* Résultats */}
        <div className="mt-4 flex items-center justify-between border-gray-800/50 border-t pt-4">
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <span>
              {totalResults} position{totalResults > 1 ? 's' : ''} trouvée
              {totalResults > 1 ? 's' : ''}
            </span>
            {isLoading && (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-400 border-t-transparent" />
            )}
          </div>

          {hasActiveFilters && (
            <div className="flex items-center gap-2 text-blue-400 text-sm">
              <Filter className="h-4 w-4" />
              {
                Object.values(filters).filter(
                  (v) =>
                    v !== 'All' &&
                    v !== '' &&
                    JSON.stringify(v) !==
                      JSON.stringify(filterOptions.apyRange) &&
                    JSON.stringify(v) !==
                      JSON.stringify(filterOptions.amountRange)
                ).length
              }{' '}
              filtre(s) actif(s)
            </div>
          )}
        </div>
      </div>

      {/* Filtres avancés */}
      <div
        className="h-80 overflow-hidden transition-all duration-300 ease-in-out"
        style={{ height: isExpanded ? '320px' : '0px' }}
      >
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              animate={{ opacity: 1 }}
              className="h-full rounded-2xl border border-gray-800/50 bg-black/40 backdrop-blur-sm"
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="h-full p-6">
                <div className="grid h-full grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {/* Token Filter */}
                  <div className="space-y-3">
                    <label className="block font-medium text-gray-300 text-sm">
                      Token
                    </label>
                    <div className="relative">
                      <button
                        className="flex w-full items-center justify-between rounded-xl border border-gray-700/50 bg-gray-900/50 px-4 py-3 text-left text-white focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        onClick={() => handleDropdownToggle('token')}
                      >
                        <span>
                          {filters.token === 'All'
                            ? 'Tous les tokens'
                            : filters.token}
                        </span>
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      </button>

                      <AnimatePresence>
                        {activeDropdown === 'token' && (
                          <motion.div
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute z-20 mt-2 max-h-48 w-full overflow-y-auto rounded-xl border border-gray-700/50 bg-gray-900 shadow-2xl"
                            exit={{ opacity: 0, y: -10 }}
                            initial={{ opacity: 0, y: -10 }}
                          >
                            <button
                              className="w-full border-gray-700/50 border-b px-4 py-3 text-left text-white transition-colors hover:bg-gray-800/50"
                              onClick={() => {
                                onUpdateFilters({ token: 'All' });
                                setActiveDropdown(null);
                              }}
                            >
                              Tous les tokens
                            </button>
                            {filterOptions.tokens.map((token) => (
                              <button
                                className="w-full border-gray-700/50 border-b px-4 py-3 text-left text-white transition-colors last:border-b-0 hover:bg-gray-800/50"
                                key={token}
                                onClick={() => {
                                  onUpdateFilters({ token });
                                  setActiveDropdown(null);
                                }}
                              >
                                {token}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Status Filter */}
                  <div className="space-y-3">
                    <label className="block font-medium text-gray-300 text-sm">
                      Statut
                    </label>
                    <div className="relative">
                      <button
                        className="flex w-full items-center justify-between rounded-xl border border-gray-700/50 bg-gray-900/50 px-4 py-3 text-left text-white focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        onClick={() => handleDropdownToggle('status')}
                      >
                        <span
                          className={`rounded-full border px-3 py-1 text-xs ${getStatusColor(filters.status)}`}
                        >
                          {filters.status === 'All'
                            ? 'Tous les statuts'
                            : filters.status === 'Active'
                              ? 'Actif'
                              : 'Arrivé à maturité'}
                        </span>
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      </button>

                      <AnimatePresence>
                        {activeDropdown === 'status' && (
                          <motion.div
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute z-20 mt-2 w-full rounded-xl border border-gray-700/50 bg-gray-900 shadow-2xl"
                            exit={{ opacity: 0, y: -10 }}
                            initial={{ opacity: 0, y: -10 }}
                          >
                            {['All', 'Active', 'Matured'].map((status) => (
                              <button
                                className="w-full border-gray-700/50 border-b px-4 py-3 text-left text-white transition-colors last:border-b-0 hover:bg-gray-800/50"
                                key={status}
                                onClick={() => {
                                  onUpdateFilters({
                                    status:
                                      status as UserDepositsFilters['status'],
                                  });
                                  setActiveDropdown(null);
                                }}
                              >
                                <span
                                  className={`rounded-full border px-3 py-1 text-xs ${getStatusColor(status)}`}
                                >
                                  {status === 'All'
                                    ? 'Tous les statuts'
                                    : status === 'Active'
                                      ? 'Actif'
                                      : 'Arrivé à maturité'}
                                </span>
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* Strategy Filter */}
                  <div className="space-y-3">
                    <label className="block font-medium text-gray-300 text-sm">
                      Stratégie
                    </label>
                    <div className="relative">
                      <button
                        className="flex w-full items-center justify-between rounded-xl border border-gray-700/50 bg-gray-900/50 px-4 py-3 text-left text-white focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                        onClick={() => handleDropdownToggle('strategy')}
                      >
                        <span>
                          {filters.strategy === 'All'
                            ? 'Toutes les stratégies'
                            : filters.strategy}
                        </span>
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      </button>

                      <AnimatePresence>
                        {activeDropdown === 'strategy' && (
                          <motion.div
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute z-20 mt-2 max-h-48 w-full overflow-y-auto rounded-xl border border-gray-700/50 bg-gray-900 shadow-2xl"
                            exit={{ opacity: 0, y: -10 }}
                            initial={{ opacity: 0, y: -10 }}
                          >
                            <button
                              className="w-full border-gray-700/50 border-b px-4 py-3 text-left text-white transition-colors hover:bg-gray-800/50"
                              onClick={() => {
                                onUpdateFilters({ strategy: 'All' });
                                setActiveDropdown(null);
                              }}
                            >
                              Toutes les stratégies
                            </button>
                            {filterOptions.strategies.map((strategy) => (
                              <button
                                className="w-full border-gray-700/50 border-b px-4 py-3 text-left text-white transition-colors last:border-b-0 hover:bg-gray-800/50"
                                key={strategy}
                                onClick={() => {
                                  onUpdateFilters({ strategy });
                                  setActiveDropdown(null);
                                }}
                              >
                                {strategy}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* APY Range */}
                  <div className="space-y-3">
                    <OptimizedCustomRangeSlider
                      className="w-full"
                      formatValue={(value: number) => `${value.toFixed(1)}%`}
                      label="APY Range"
                      max={filterOptions.apyRange[1]}
                      min={filterOptions.apyRange[0]}
                      onChange={(newRange: [number, number]) =>
                        onUpdateFilters({ apyRange: newRange })
                      }
                      step={0.1}
                      value={filters.apyRange}
                    />
                  </div>

                  {/* Amount Range */}
                  <div className="space-y-3">
                    <OptimizedCustomRangeSlider
                      className="w-full"
                      formatValue={(value: number) => formatAmount(value)}
                      label="Montant Range"
                      max={filterOptions.amountRange[1]}
                      min={filterOptions.amountRange[0]}
                      onChange={(newRange: [number, number]) =>
                        onUpdateFilters({ amountRange: newRange })
                      }
                      step={1000}
                      value={filters.amountRange}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default UserDepositsFiltersComponent;
