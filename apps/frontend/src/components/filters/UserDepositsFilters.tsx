"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  X, 
  ChevronDown, 
  ChevronUp,
  DollarSign,
  Clock,
  TrendingUp,
  RefreshCw
} from 'lucide-react';
import { UserDepositsFilters } from '@/hooks/useUserDepositsPagination';
import { OptimizedCustomRangeSlider } from '@/components/ui/OptimizedCustomRangeSlider';

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
    return statusColors[status as keyof typeof statusColors] || statusColors.All;
  };

  const handleDropdownToggle = (dropdown: string) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const formatAmount = (amount: number) => {
    if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)}M`;
    if (amount >= 1000) return `${(amount / 1000).toFixed(1)}K`;
    return amount.toString();
  };

  return (
    <div className="w-full space-y-4" style={{ willChange: 'transform' }}>
      {/* Barre de filtres principale */}
      <div className="bg-black/40 backdrop-blur-sm border border-gray-800/50 rounded-2xl p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Barre de recherche */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher par adresse, montant..."
              value={filters.searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
                onUpdateFilters({ searchTerm: e.target.value })
              }
              className="w-full pl-12 pr-12 py-3 bg-gray-900/50 border border-gray-700/50 rounded-xl 
                         text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                         focus:ring-blue-500/50 focus:border-blue-500/50"
            />
            {filters.searchTerm && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onUpdateFilters({ searchTerm: '' })}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 
                           text-gray-400 hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </motion.button>
            )}
          </div>

          {/* Bouton filtres avancés */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsExpanded(!isExpanded)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl border transition-all ${
              isExpanded 
                ? 'bg-blue-500/20 border-blue-500/30 text-blue-400' 
                : 'bg-gray-800/50 border-gray-700/50 text-gray-300 hover:bg-gray-700/50'
            }`}
          >
            <Filter className="h-5 w-5" />
            Filtres
            {hasActiveFilters && (
              <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                {Object.values(filters).filter(v => v !== 'All' && v !== '' && 
                  JSON.stringify(v) !== JSON.stringify(filterOptions.apyRange) &&
                  JSON.stringify(v) !== JSON.stringify(filterOptions.amountRange)).length}
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
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onResetFilters}
              className="flex items-center gap-2 px-6 py-3 bg-red-500/20 border border-red-500/30 
                         text-red-400 rounded-xl hover:bg-red-500/30 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
              Réinitialiser
            </motion.button>
          )}
        </div>

        {/* Résultats */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-800/50">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span>{totalResults} position{totalResults > 1 ? 's' : ''} trouvée{totalResults > 1 ? 's' : ''}</span>
            {isLoading && (
              <div className="animate-spin h-4 w-4 border-2 border-blue-400 border-t-transparent rounded-full" />
            )}
          </div>
          
          {hasActiveFilters && (
            <div className="flex items-center gap-2 text-sm text-blue-400">
              <Filter className="h-4 w-4" />
              {Object.values(filters).filter(v => v !== 'All' && v !== '' && 
                JSON.stringify(v) !== JSON.stringify(filterOptions.apyRange) &&
                JSON.stringify(v) !== JSON.stringify(filterOptions.amountRange)).length} filtre(s) actif(s)
            </div>
          )}
        </div>
      </div>

      {/* Filtres avancés */}
      <div className="h-80 overflow-hidden transition-all duration-300 ease-in-out" style={{ height: isExpanded ? '320px' : '0px' }}>
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-black/40 backdrop-blur-sm border border-gray-800/50 rounded-2xl h-full"
            >
              <div className="p-6 h-full">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-full">
              {/* Token Filter */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-300">Token</label>
                <div className="relative">
                  <button
                    onClick={() => handleDropdownToggle('token')}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700/50 rounded-xl 
                               text-left text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 
                               focus:border-blue-500/50 flex items-center justify-between"
                  >
                    <span>{filters.token === 'All' ? 'Tous les tokens' : filters.token}</span>
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </button>
                  
                  <AnimatePresence>
                    {activeDropdown === 'token' && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute z-20 w-full mt-2 bg-gray-900 border border-gray-700/50 
                                   rounded-xl shadow-2xl max-h-48 overflow-y-auto"
                      >
                        <button
                          onClick={() => {
                            onUpdateFilters({ token: 'All' });
                            setActiveDropdown(null);
                          }}
                          className="w-full px-4 py-3 text-left text-white hover:bg-gray-800/50 
                                     transition-colors border-b border-gray-700/50"
                        >
                          Tous les tokens
                        </button>
                        {filterOptions.tokens.map((token) => (
                          <button
                            key={token}
                            onClick={() => {
                              onUpdateFilters({ token });
                              setActiveDropdown(null);
                            }}
                            className="w-full px-4 py-3 text-left text-white hover:bg-gray-800/50 
                                       transition-colors border-b border-gray-700/50 last:border-b-0"
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
                <label className="block text-sm font-medium text-gray-300">Statut</label>
                <div className="relative">
                  <button
                    onClick={() => handleDropdownToggle('status')}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700/50 rounded-xl 
                               text-left text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 
                               focus:border-blue-500/50 flex items-center justify-between"
                  >
                    <span className={`px-3 py-1 rounded-full text-xs border ${getStatusColor(filters.status)}`}>
                      {filters.status === 'All' ? 'Tous les statuts' : 
                       filters.status === 'Active' ? 'Actif' : 'Arrivé à maturité'}
                    </span>
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </button>
                  
                  <AnimatePresence>
                    {activeDropdown === 'status' && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute z-20 w-full mt-2 bg-gray-900 border border-gray-700/50 
                                   rounded-xl shadow-2xl"
                      >
                        {['All', 'Active', 'Matured'].map((status) => (
                          <button
                            key={status}
                            onClick={() => {
                              onUpdateFilters({ status: status as UserDepositsFilters['status'] });
                              setActiveDropdown(null);
                            }}
                            className="w-full px-4 py-3 text-left text-white hover:bg-gray-800/50 
                                       transition-colors border-b border-gray-700/50 last:border-b-0"
                          >
                            <span className={`px-3 py-1 rounded-full text-xs border ${getStatusColor(status)}`}>
                              {status === 'All' ? 'Tous les statuts' : 
                               status === 'Active' ? 'Actif' : 'Arrivé à maturité'}
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
                <label className="block text-sm font-medium text-gray-300">Stratégie</label>
                <div className="relative">
                  <button
                    onClick={() => handleDropdownToggle('strategy')}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700/50 rounded-xl 
                               text-left text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 
                               focus:border-blue-500/50 flex items-center justify-between"
                  >
                    <span>{filters.strategy === 'All' ? 'Toutes les stratégies' : filters.strategy}</span>
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </button>
                  
                  <AnimatePresence>
                    {activeDropdown === 'strategy' && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute z-20 w-full mt-2 bg-gray-900 border border-gray-700/50 
                                   rounded-xl shadow-2xl max-h-48 overflow-y-auto"
                      >
                        <button
                          onClick={() => {
                            onUpdateFilters({ strategy: 'All' });
                            setActiveDropdown(null);
                          }}
                          className="w-full px-4 py-3 text-left text-white hover:bg-gray-800/50 
                                     transition-colors border-b border-gray-700/50"
                        >
                          Toutes les stratégies
                        </button>
                        {filterOptions.strategies.map((strategy) => (
                          <button
                            key={strategy}
                            onClick={() => {
                              onUpdateFilters({ strategy });
                              setActiveDropdown(null);
                            }}
                            className="w-full px-4 py-3 text-left text-white hover:bg-gray-800/50 
                                       transition-colors border-b border-gray-700/50 last:border-b-0"
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
                  min={filterOptions.apyRange[0]}
                  max={filterOptions.apyRange[1]}
                  value={filters.apyRange}
                  onChange={(newRange: [number, number]) => onUpdateFilters({ apyRange: newRange })}
                  step={0.1}
                  label="APY Range"
                  formatValue={(value: number) => `${value.toFixed(1)}%`}
                  className="w-full"
                />
              </div>

              {/* Amount Range */}
              <div className="space-y-3">
                <OptimizedCustomRangeSlider
                  min={filterOptions.amountRange[0]}
                  max={filterOptions.amountRange[1]}
                  value={filters.amountRange}
                  onChange={(newRange: [number, number]) => onUpdateFilters({ amountRange: newRange })}
                  step={1000}
                  label="Montant Range"
                  formatValue={(value: number) => formatAmount(value)}
                  className="w-full"
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
