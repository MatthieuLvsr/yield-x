"use client";

import { useState, ChangeEvent } from 'react';
import { Card } from '@/components/ui/card';
import { Search, Filter, RotateCcw } from 'lucide-react';
import { UserDepositsFilters } from '@/hooks/useUserDepositsPagination';

interface UserDepositsFiltersProps {
  filters: UserDepositsFilters;
  onFiltersChange: (filters: Partial<UserDepositsFilters>) => void;
  onResetFilters: () => void;
  filterOptions: {
    tokens: string[];
    strategies: string[];
    apyRange: [number, number];
    amountRange: [number, number];
  };
}

export const UserDepositsFiltersComponent: React.FC<UserDepositsFiltersProps> = ({
  filters,
  onFiltersChange,
  onResetFilters,
  filterOptions,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const activeFiltersCount = Object.values(filters).filter(value => {
    if (typeof value === 'string') return value !== 'All' && value !== '';
    if (Array.isArray(value)) return value[0] !== filterOptions.apyRange[0] || value[1] !== filterOptions.apyRange[1];
    return false;
  }).length;

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ searchTerm: e.target.value });
  };

  const handleTokenChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onFiltersChange({ token: e.target.value });
  };

  const handleStatusChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onFiltersChange({ status: e.target.value as UserDepositsFilters['status'] });
  };

  const handleStrategyChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onFiltersChange({ strategy: e.target.value });
  };

  const handleApyRangeChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const newRange = [...filters.apyRange] as [number, number];
    newRange[index] = parseFloat(e.target.value);
    onFiltersChange({ apyRange: newRange });
  };

  const handleAmountRangeChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const newRange = [...filters.amountRange] as [number, number];
    newRange[index] = parseFloat(e.target.value);
    onFiltersChange({ amountRange: newRange });
  };

  return (
    <Card className="border-brand-primary/20 bg-black/40 backdrop-blur-sm">
      <div className="p-4">
        {/* Header avec bouton d'expansion */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-brand-primary" />
            <h3 className="text-sm font-medium text-white">Filters</h3>
            {activeFiltersCount > 0 && (
              <span className="px-2 py-1 text-xs bg-brand-primary/20 text-brand-primary rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onResetFilters}
              className="flex items-center gap-1 px-3 py-1 text-sm text-brand-secondary hover:text-brand-primary transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="px-3 py-1 text-sm text-brand-secondary hover:text-brand-primary transition-colors"
            >
              {isExpanded ? 'Less' : 'More'}
            </button>
          </div>
        </div>

        {/* Recherche - toujours visible */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-3 w-4 h-4 text-brand-secondary" />
          <input
            type="text"
            placeholder="Search deposits..."
            value={filters.searchTerm}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 bg-black/20 border border-brand-primary/30 rounded-lg text-white placeholder-brand-secondary focus:outline-none focus:border-brand-primary/50"
          />
        </div>

        {/* Filtres principaux - toujours visibles */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="space-y-2">
            <label className="text-sm text-brand-secondary">Token</label>
            <select
              value={filters.token}
              onChange={handleTokenChange}
              className="w-full px-3 py-2 bg-black/20 border border-brand-primary/30 rounded-lg text-white focus:outline-none focus:border-brand-primary/50"
            >
              {filterOptions.tokens.map(token => (
                <option key={token} value={token}>{token}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-brand-secondary">Status</label>
            <select
              value={filters.status}
              onChange={handleStatusChange}
              className="w-full px-3 py-2 bg-black/20 border border-brand-primary/30 rounded-lg text-white focus:outline-none focus:border-brand-primary/50"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Matured">Matured</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-brand-secondary">Strategy</label>
            <select
              value={filters.strategy}
              onChange={handleStrategyChange}
              className="w-full px-3 py-2 bg-black/20 border border-brand-primary/30 rounded-lg text-white focus:outline-none focus:border-brand-primary/50"
            >
              {filterOptions.strategies.map(strategy => (
                <option key={strategy} value={strategy}>
                  {strategy === 'All' ? 'All Strategies' : `Strategy #${strategy}`}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-brand-secondary">APY Range</label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="number"
                  min={filterOptions.apyRange[0]}
                  max={filterOptions.apyRange[1]}
                  step={0.1}
                  value={filters.apyRange[0]}
                  onChange={(e) => handleApyRangeChange(e, 0)}
                  className="flex-1 px-2 py-1 bg-black/20 border border-brand-primary/30 rounded text-white text-sm focus:outline-none focus:border-brand-primary/50"
                />
                <span className="text-brand-secondary">to</span>
                <input
                  type="number"
                  min={filterOptions.apyRange[0]}
                  max={filterOptions.apyRange[1]}
                  step={0.1}
                  value={filters.apyRange[1]}
                  onChange={(e) => handleApyRangeChange(e, 1)}
                  className="flex-1 px-2 py-1 bg-black/20 border border-brand-primary/30 rounded text-white text-sm focus:outline-none focus:border-brand-primary/50"
                />
              </div>
              <div className="flex justify-between text-xs text-brand-secondary">
                <span>{filters.apyRange[0].toFixed(1)}%</span>
                <span>{filters.apyRange[1].toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filtres avancés - visibles uniquement si expanded */}
        {isExpanded && (
          <div className="pt-4 border-t border-brand-primary/20">
            <div className="space-y-2">
              <label className="text-sm text-brand-secondary">Amount Range</label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="number"
                    min={filterOptions.amountRange[0]}
                    max={filterOptions.amountRange[1]}
                    step={100}
                    value={filters.amountRange[0]}
                    onChange={(e) => handleAmountRangeChange(e, 0)}
                    className="flex-1 px-2 py-1 bg-black/20 border border-brand-primary/30 rounded text-white text-sm focus:outline-none focus:border-brand-primary/50"
                  />
                  <span className="text-brand-secondary">to</span>
                  <input
                    type="number"
                    min={filterOptions.amountRange[0]}
                    max={filterOptions.amountRange[1]}
                    step={100}
                    value={filters.amountRange[1]}
                    onChange={(e) => handleAmountRangeChange(e, 1)}
                    className="flex-1 px-2 py-1 bg-black/20 border border-brand-primary/30 rounded text-white text-sm focus:outline-none focus:border-brand-primary/50"
                  />
                </div>
                <div className="flex justify-between text-xs text-brand-secondary">
                  <span>${filters.amountRange[0].toLocaleString()}</span>
                  <span>${filters.amountRange[1].toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
