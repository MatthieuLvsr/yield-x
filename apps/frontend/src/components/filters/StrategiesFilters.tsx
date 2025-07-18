'use client';

import { AnimatePresence, motion } from 'framer-motion';
import {
  ChevronDown,
  DollarSign,
  Filter,
  RefreshCw,
  Search,
  Shield,
  TrendingUp,
  X,
} from 'lucide-react';
import type React from 'react';
import { useState } from 'react';
import { OptimizedCustomRangeSlider } from '@/components/ui/OptimizedCustomRangeSlider';
import type { StrategiesFilters } from '../../hooks/useStrategiesPagination';

interface StrategiesFiltersProps {
  filters: StrategiesFilters;
  onUpdateFilters: (filters: Partial<StrategiesFilters>) => void;
  onResetFilters: () => void;
  filterOptions: {
    tokens: string[];
    apyRange: [number, number];
  };
  totalResults: number;
}

const StrategiesFiltersComponent = ({
  filters,
  onUpdateFilters,
  onResetFilters,
  filterOptions,
  totalResults,
}: StrategiesFiltersProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const hasActiveFilters =
    filters.token !== 'All' ||
    filters.risk !== 'All' ||
    filters.searchTerm !== '' ||
    filters.apyRange[0] !== filterOptions.apyRange[0] ||
    filters.apyRange[1] !== filterOptions.apyRange[1];

  const riskColors = {
    Low: 'text-green-400 bg-green-400/10 border-green-400/20',
    Medium: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
    High: 'text-red-400 bg-red-400/10 border-red-400/20',
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case 'Low':
        return <Shield className="text-green-400" size={14} />;
      case 'Medium':
        return <TrendingUp className="text-yellow-400" size={14} />;
      case 'High':
        return <TrendingUp className="text-red-400" size={14} />;
      default:
        return null;
    }
  };

  const toggleDropdown = (dropdown: string) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const Dropdown: React.FC<{
    title: string;
    value: string;
    options: string[];
    onSelect: (value: string) => void;
    icon?: React.ReactNode;
  }> = ({ title, value, options, onSelect, icon }) => (
    <div className="relative">
      <motion.button
        className="flex min-w-[120px] items-center gap-2 rounded-xl border border-gray-700/50 bg-gray-800/40 px-4 py-2 transition-all duration-200 hover:bg-gray-700/60"
        onClick={() => toggleDropdown(title)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {icon}
        <span className="font-medium text-sm">{value}</span>
        <ChevronDown
          className={`ml-auto transition-transform duration-200 ${
            activeDropdown === title ? 'rotate-180' : ''
          }`}
          size={14}
        />
      </motion.button>

      <AnimatePresence>
        {activeDropdown === title && (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-full left-0 z-50 mt-2 w-full rounded-xl border border-gray-700/50 bg-gray-800/95 shadow-xl backdrop-blur-sm"
            exit={{ opacity: 0, y: -10 }}
            initial={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-2">
              {options.map((option) => (
                <motion.button
                  className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-all duration-200 ${
                    option === value
                      ? 'border border-blue-500/30 bg-blue-500/20 text-blue-400'
                      : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                  }`}
                  key={option}
                  onClick={() => {
                    onSelect(option);
                    setActiveDropdown(null);
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-2">
                    {title === 'Risk' &&
                      option !== 'All' &&
                      getRiskIcon(option)}
                    {option}
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Barre de recherche et bouton de filtres */}
      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="relative max-w-md flex-1">
          <Search
            className="-translate-y-1/2 absolute top-1/2 left-3 transform text-gray-400"
            size={20}
          />
          <input
            className="w-full rounded-xl border border-gray-700/50 bg-gray-800/40 py-3 pr-4 pl-10 text-white placeholder-gray-400 transition-all duration-200 focus:border-blue-500/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            onChange={(e) => onUpdateFilters({ searchTerm: e.target.value })}
            placeholder="Search strategies..."
            type="text"
            value={filters.searchTerm}
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="text-gray-400 text-sm">
            {totalResults} {totalResults === 1 ? 'strategy' : 'strategies'}{' '}
            found
          </div>

          <motion.button
            className={`flex items-center gap-2 rounded-xl px-4 py-2 transition-all duration-200 ${
              hasActiveFilters
                ? 'border border-blue-500/30 bg-blue-500/20 text-blue-400'
                : 'border border-gray-700/50 bg-gray-800/40 text-gray-300 hover:bg-gray-700/60'
            }`}
            onClick={() => setIsExpanded(!isExpanded)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Filter size={16} />
            <span className="font-medium text-sm">Filters</span>
            {hasActiveFilters && (
              <div className="h-2 w-2 rounded-full bg-blue-400" />
            )}
          </motion.button>

          {hasActiveFilters && (
            <motion.button
              className="flex items-center gap-2 rounded-xl border border-gray-700/50 bg-gray-800/40 px-3 py-2 transition-all duration-200 hover:bg-gray-700/60"
              onClick={onResetFilters}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <RefreshCw size={14} />
              <span className="text-sm">Reset</span>
            </motion.button>
          )}
        </div>
      </div>

      {/* Filtres étendus */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            initial={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="rounded-xl border border-gray-700/30 bg-gray-800/20 p-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Filtre Token */}
                <div className="min-w-0">
                  <span className="mb-2 block font-medium text-gray-300 text-sm">
                    Token
                  </span>
                  <Dropdown
                    icon={<DollarSign className="text-gray-400" size={16} />}
                    onSelect={(value) => onUpdateFilters({ token: value })}
                    options={filterOptions.tokens}
                    title="Token"
                    value={filters.token}
                  />
                </div>

                {/* Filtre Risk */}
                <div className="min-w-0">
                  <span className="mb-2 block font-medium text-gray-300 text-sm">
                    Risk Level
                  </span>
                  <Dropdown
                    icon={<Shield className="text-gray-400" size={16} />}
                    onSelect={(value) =>
                      onUpdateFilters({
                        risk: value as 'All' | 'Low' | 'Medium' | 'High',
                      })
                    }
                    options={['All', 'Low', 'Medium', 'High']}
                    title="Risk"
                    value={filters.risk}
                  />
                </div>

                {/* Filtre APY Range */}
                <div className="min-w-0 overflow-hidden">
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
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filtres actifs */}
      {hasActiveFilters && (
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-2"
          initial={{ opacity: 0, y: -10 }}
        >
          {filters.token !== 'All' && (
            <motion.div
              className="flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/20 px-3 py-1 text-blue-400 text-sm"
              whileHover={{ scale: 1.02 }}
            >
              <DollarSign size={12} />
              {filters.token}
              <button
                className="ml-1 rounded-full p-0.5 hover:bg-blue-500/30"
                onClick={() => onUpdateFilters({ token: 'All' })}
                type="button"
              >
                <X size={12} />
              </button>
            </motion.div>
          )}

          {filters.risk !== 'All' && (
            <motion.div
              className={`flex items-center gap-2 rounded-full border px-3 py-1 text-sm ${
                riskColors[filters.risk as keyof typeof riskColors]
              }`}
              whileHover={{ scale: 1.02 }}
            >
              {getRiskIcon(filters.risk)}
              {filters.risk} Risk
              <button
                className="ml-1 rounded-full p-0.5 hover:bg-gray-500/30"
                onClick={() => onUpdateFilters({ risk: 'All' })}
                type="button"
              >
                <X size={12} />
              </button>
            </motion.div>
          )}

          {filters.searchTerm && (
            <motion.div
              className="flex items-center gap-2 rounded-full border border-green-500/30 bg-green-500/20 px-3 py-1 text-green-400 text-sm"
              whileHover={{ scale: 1.02 }}
            >
              <Search size={12} />"{filters.searchTerm}"
              <button
                className="ml-1 rounded-full p-0.5 hover:bg-green-500/30"
                onClick={() => onUpdateFilters({ searchTerm: '' })}
                type="button"
              >
                <X size={12} />
              </button>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default StrategiesFiltersComponent;
