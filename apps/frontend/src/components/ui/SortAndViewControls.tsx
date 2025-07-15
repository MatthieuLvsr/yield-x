'use client';

import { motion } from 'framer-motion';
import { ArrowUpDown, Grid, List, SortAsc, SortDesc } from 'lucide-react';
import type React from 'react';

export type SortOption = 'apy' | 'tvl' | 'risk' | 'name';
export type SortDirection = 'asc' | 'desc';
export type ViewMode = 'grid' | 'list';

interface SortAndViewControlsProps {
  sortBy: SortOption;
  sortDirection: SortDirection;
  viewMode: ViewMode;
  onSortChange: (sortBy: SortOption, direction: SortDirection) => void;
  onViewModeChange: (mode: ViewMode) => void;
}

const SortAndViewControls: React.FC<SortAndViewControlsProps> = ({
  sortBy,
  sortDirection,
  viewMode,
  onSortChange,
  onViewModeChange,
}) => {
  const sortOptions = [
    { value: 'apy', label: 'APY', icon: '📈' },
    { value: 'tvl', label: 'TVL', icon: '💰' },
    { value: 'risk', label: 'Risk', icon: '🛡️' },
    { value: 'name', label: 'Name', icon: '📝' },
  ];

  const handleSortClick = (option: SortOption) => {
    if (sortBy === option) {
      // Toggle direction if same option
      onSortChange(option, sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Default to desc for numeric fields, asc for text
      const defaultDirection = ['apy', 'tvl'].includes(option) ? 'desc' : 'asc';
      onSortChange(option, defaultDirection);
    }
  };

  return (
    <div className="flex items-center justify-between gap-4 py-4">
      {/* Sort Controls */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <ArrowUpDown size={16} />
          <span>Sort by:</span>
        </div>
        <div className="flex items-center gap-1">
          {sortOptions.map((option) => (
            <motion.button
              className={`flex items-center gap-2 rounded-lg px-3 py-1.5 font-medium text-sm transition-all duration-200 ${
                sortBy === option.value
                  ? 'border border-blue-500/30 bg-blue-500/20 text-blue-400'
                  : 'border border-gray-700/50 bg-gray-800/40 text-gray-300 hover:bg-gray-700/60 hover:text-white'
              } `}
              key={option.value}
              onClick={() => handleSortClick(option.value as SortOption)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>{option.icon}</span>
              <span>{option.label}</span>
              {sortBy === option.value && (
                <motion.div
                  animate={{ scale: 1 }}
                  className="ml-1"
                  initial={{ scale: 0 }}
                >
                  {sortDirection === 'asc' ? (
                    <SortAsc className="text-blue-400" size={12} />
                  ) : (
                    <SortDesc className="text-blue-400" size={12} />
                  )}
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* View Mode Controls */}
      <div className="flex items-center gap-2">
        <div className="text-gray-400 text-sm">View:</div>
        <div className="flex items-center gap-1 rounded-lg border border-gray-700/50 bg-gray-800/40 p-1">
          <motion.button
            className={`flex items-center gap-2 rounded-md px-3 py-1.5 font-medium text-sm transition-all duration-200 ${
              viewMode === 'grid'
                ? 'bg-blue-500/20 text-blue-400 shadow-sm'
                : 'text-gray-300 hover:text-white'
            } `}
            onClick={() => onViewModeChange('grid')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Grid size={16} />
            <span>Grid</span>
          </motion.button>

          <motion.button
            className={`flex items-center gap-2 rounded-md px-3 py-1.5 font-medium text-sm transition-all duration-200 ${
              viewMode === 'list'
                ? 'bg-blue-500/20 text-blue-400 shadow-sm'
                : 'text-gray-300 hover:text-white'
            } `}
            onClick={() => onViewModeChange('list')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <List size={16} />
            <span>List</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default SortAndViewControls;
