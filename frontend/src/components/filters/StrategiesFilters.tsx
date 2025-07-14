"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  X, 
  ChevronDown, 
  DollarSign, 
  Shield, 
  TrendingUp,
  RefreshCw
} from 'lucide-react';
import { StrategiesFilters } from '../../hooks/useStrategiesPagination';
import { OptimizedCustomRangeSlider } from '@/components/ui/OptimizedCustomRangeSlider';

interface StrategiesFiltersProps {
  filters: StrategiesFilters;
  onUpdateFilters: (filters: Partial<StrategiesFilters>) => void;
  onResetFilters: () => void;
  filterOptions: {
    tokens: string[];
    protocols: string[];
    apyRange: [number, number];
  };
  totalResults: number;
  isLoading?: boolean;
}

const StrategiesFiltersComponent: React.FC<StrategiesFiltersProps> = ({
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
    filters.risk !== 'All' ||
    filters.protocol !== 'All' ||
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
        return <Shield size={14} className="text-green-400" />;
      case 'Medium':
        return <TrendingUp size={14} className="text-yellow-400" />;
      case 'High':
        return <TrendingUp size={14} className="text-red-400" />;
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
        className="flex items-center gap-2 px-4 py-2 bg-gray-800/40 hover:bg-gray-700/60 
                   rounded-xl border border-gray-700/50 transition-all duration-200 min-w-[120px]"
        onClick={() => toggleDropdown(title)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {icon}
        <span className="text-sm font-medium">{value}</span>
        <ChevronDown 
          size={14} 
          className={`ml-auto transition-transform duration-200 ${
            activeDropdown === title ? 'rotate-180' : ''
          }`}
        />
      </motion.button>

      <AnimatePresence>
        {activeDropdown === title && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 mt-2 w-full bg-gray-800/95 backdrop-blur-sm 
                       border border-gray-700/50 rounded-xl shadow-xl z-50"
          >
            <div className="p-2">
              {options.map((option) => (
                <motion.button
                  key={option}
                  className={`w-full px-3 py-2 text-left text-sm rounded-lg transition-all duration-200
                    ${option === value 
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                      : 'hover:bg-gray-700/50 text-gray-300 hover:text-white'
                    }`}
                  onClick={() => {
                    onSelect(option);
                    setActiveDropdown(null);
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-2">
                    {title === 'Risk' && option !== 'All' && getRiskIcon(option)}
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
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search strategies..."
            value={filters.searchTerm}
            onChange={(e) => onUpdateFilters({ searchTerm: e.target.value })}
            className="w-full pl-10 pr-4 py-3 bg-gray-800/40 border border-gray-700/50 rounded-xl 
                       text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                       focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-400">
            {totalResults} {totalResults === 1 ? 'strategy' : 'strategies'} found
          </div>

          <motion.button
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200
              ${hasActiveFilters 
                ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                : 'bg-gray-800/40 text-gray-300 border border-gray-700/50 hover:bg-gray-700/60'
              }`}
            onClick={() => setIsExpanded(!isExpanded)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Filter size={16} />
            <span className="text-sm font-medium">Filters</span>
            {hasActiveFilters && (
              <div className="w-2 h-2 bg-blue-400 rounded-full" />
            )}
          </motion.button>

          {hasActiveFilters && (
            <motion.button
              className="flex items-center gap-2 px-3 py-2 bg-gray-800/40 hover:bg-gray-700/60 
                         rounded-xl border border-gray-700/50 transition-all duration-200"
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
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-gray-800/20 border border-gray-700/30 rounded-xl p-6 overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Filtre Token */}
                <div className="min-w-0">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Token
                  </label>
                  <Dropdown
                    title="Token"
                    value={filters.token}
                    options={filterOptions.tokens}
                    onSelect={(value) => onUpdateFilters({ token: value })}
                    icon={<DollarSign size={16} className="text-gray-400" />}
                  />
                </div>

                {/* Filtre Risk */}
                <div className="min-w-0">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Risk Level
                  </label>
                  <Dropdown
                    title="Risk"
                    value={filters.risk}
                    options={['All', 'Low', 'Medium', 'High']}
                    onSelect={(value) => onUpdateFilters({ risk: value as any })}
                    icon={<Shield size={16} className="text-gray-400" />}
                  />
                </div>

                {/* Filtre Protocol */}
                <div className="min-w-0">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Protocol
                  </label>
                  <Dropdown
                    title="Protocol"
                    value={filters.protocol}
                    options={filterOptions.protocols}
                    onSelect={(value) => onUpdateFilters({ protocol: value })}
                    icon={<TrendingUp size={16} className="text-gray-400" />}
                  />
                </div>

                {/* Filtre APY Range */}
                <div className="min-w-0 overflow-hidden">
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
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filtres actifs */}
      {hasActiveFilters && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-2"
        >
          {filters.token !== 'All' && (
            <motion.div
              className="flex items-center gap-2 px-3 py-1 bg-blue-500/20 text-blue-400 
                         border border-blue-500/30 rounded-full text-sm"
              whileHover={{ scale: 1.02 }}
            >
              <DollarSign size={12} />
              {filters.token}
              <button
                onClick={() => onUpdateFilters({ token: 'All' })}
                className="ml-1 hover:bg-blue-500/30 rounded-full p-0.5"
              >
                <X size={12} />
              </button>
            </motion.div>
          )}

          {filters.risk !== 'All' && (
            <motion.div
              className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm border ${
                riskColors[filters.risk as keyof typeof riskColors]
              }`}
              whileHover={{ scale: 1.02 }}
            >
              {getRiskIcon(filters.risk)}
              {filters.risk} Risk
              <button
                onClick={() => onUpdateFilters({ risk: 'All' })}
                className="ml-1 hover:bg-gray-500/30 rounded-full p-0.5"
              >
                <X size={12} />
              </button>
            </motion.div>
          )}

          {filters.protocol !== 'All' && (
            <motion.div
              className="flex items-center gap-2 px-3 py-1 bg-purple-500/20 text-purple-400 
                         border border-purple-500/30 rounded-full text-sm"
              whileHover={{ scale: 1.02 }}
            >
              <TrendingUp size={12} />
              {filters.protocol}
              <button
                onClick={() => onUpdateFilters({ protocol: 'All' })}
                className="ml-1 hover:bg-purple-500/30 rounded-full p-0.5"
              >
                <X size={12} />
              </button>
            </motion.div>
          )}

          {filters.searchTerm && (
            <motion.div
              className="flex items-center gap-2 px-3 py-1 bg-green-500/20 text-green-400 
                         border border-green-500/30 rounded-full text-sm"
              whileHover={{ scale: 1.02 }}
            >
              <Search size={12} />
              "{filters.searchTerm}"
              <button
                onClick={() => onUpdateFilters({ searchTerm: '' })}
                className="ml-1 hover:bg-green-500/30 rounded-full p-0.5"
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
