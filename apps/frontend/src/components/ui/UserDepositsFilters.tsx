'use client';

import { Filter, RotateCcw, Search } from 'lucide-react';
import { type ChangeEvent, useState } from 'react';
import { Card } from '@/components/ui/card';
import type { UserDepositsFilters } from '@/hooks/useUserDepositsPagination';

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

export const UserDepositsFiltersComponent: React.FC<
  UserDepositsFiltersProps
> = ({ filters, onFiltersChange, onResetFilters, filterOptions }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const activeFiltersCount = Object.values(filters).filter((value) => {
    if (typeof value === 'string') return value !== 'All' && value !== '';
    if (Array.isArray(value))
      return (
        value[0] !== filterOptions.apyRange[0] ||
        value[1] !== filterOptions.apyRange[1]
      );
    return false;
  }).length;

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ searchTerm: e.target.value });
  };

  const handleTokenChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onFiltersChange({ token: e.target.value });
  };

  const handleStatusChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onFiltersChange({
      status: e.target.value as UserDepositsFilters['status'],
    });
  };

  const handleStrategyChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onFiltersChange({ strategy: e.target.value });
  };

  const handleApyRangeChange = (
    e: ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newRange = [...filters.apyRange] as [number, number];
    newRange[index] = Number.parseFloat(e.target.value);
    onFiltersChange({ apyRange: newRange });
  };

  const handleAmountRangeChange = (
    e: ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newRange = [...filters.amountRange] as [number, number];
    newRange[index] = Number.parseFloat(e.target.value);
    onFiltersChange({ amountRange: newRange });
  };

  return (
    <Card className="border-brand-primary/20 bg-black/40 backdrop-blur-sm">
      <div className="p-4">
        {/* Header avec bouton d'expansion */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-brand-primary" />
            <h3 className="font-medium text-sm text-white">Filters</h3>
            {activeFiltersCount > 0 && (
              <span className="rounded-full bg-brand-primary/20 px-2 py-1 text-brand-primary text-xs">
                {activeFiltersCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              className="flex items-center gap-1 px-3 py-1 text-brand-secondary text-sm transition-colors hover:text-brand-primary"
              onClick={onResetFilters}
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>
            <button
              className="px-3 py-1 text-brand-secondary text-sm transition-colors hover:text-brand-primary"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Less' : 'More'}
            </button>
          </div>
        </div>

        {/* Recherche - toujours visible */}
        <div className="relative mb-4">
          <Search className="absolute top-3 left-3 h-4 w-4 text-brand-secondary" />
          <input
            className="w-full rounded-lg border border-brand-primary/30 bg-black/20 py-2 pr-4 pl-10 text-white placeholder-brand-secondary focus:border-brand-primary/50 focus:outline-none"
            onChange={handleSearchChange}
            placeholder="Search deposits..."
            type="text"
            value={filters.searchTerm}
          />
        </div>

        {/* Filtres principaux - toujours visibles */}
        <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <label className="text-brand-secondary text-sm">Token</label>
            <select
              className="w-full rounded-lg border border-brand-primary/30 bg-black/20 px-3 py-2 text-white focus:border-brand-primary/50 focus:outline-none"
              onChange={handleTokenChange}
              value={filters.token}
            >
              {filterOptions.tokens.map((token) => (
                <option key={token} value={token}>
                  {token}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-brand-secondary text-sm">Status</label>
            <select
              className="w-full rounded-lg border border-brand-primary/30 bg-black/20 px-3 py-2 text-white focus:border-brand-primary/50 focus:outline-none"
              onChange={handleStatusChange}
              value={filters.status}
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Matured">Matured</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-brand-secondary text-sm">Strategy</label>
            <select
              className="w-full rounded-lg border border-brand-primary/30 bg-black/20 px-3 py-2 text-white focus:border-brand-primary/50 focus:outline-none"
              onChange={handleStrategyChange}
              value={filters.strategy}
            >
              {filterOptions.strategies.map((strategy) => (
                <option key={strategy} value={strategy}>
                  {strategy === 'All'
                    ? 'All Strategies'
                    : `Strategy #${strategy}`}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-brand-secondary text-sm">APY Range</label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  className="flex-1 rounded border border-brand-primary/30 bg-black/20 px-2 py-1 text-sm text-white focus:border-brand-primary/50 focus:outline-none"
                  max={filterOptions.apyRange[1]}
                  min={filterOptions.apyRange[0]}
                  onChange={(e) => handleApyRangeChange(e, 0)}
                  step={0.1}
                  type="number"
                  value={filters.apyRange[0]}
                />
                <span className="text-brand-secondary">to</span>
                <input
                  className="flex-1 rounded border border-brand-primary/30 bg-black/20 px-2 py-1 text-sm text-white focus:border-brand-primary/50 focus:outline-none"
                  max={filterOptions.apyRange[1]}
                  min={filterOptions.apyRange[0]}
                  onChange={(e) => handleApyRangeChange(e, 1)}
                  step={0.1}
                  type="number"
                  value={filters.apyRange[1]}
                />
              </div>
              <div className="flex justify-between text-brand-secondary text-xs">
                <span>{filters.apyRange[0].toFixed(1)}%</span>
                <span>{filters.apyRange[1].toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filtres avancés - visibles uniquement si expanded */}
        {isExpanded && (
          <div className="border-brand-primary/20 border-t pt-4">
            <div className="space-y-2">
              <label className="text-brand-secondary text-sm">
                Amount Range
              </label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    className="flex-1 rounded border border-brand-primary/30 bg-black/20 px-2 py-1 text-sm text-white focus:border-brand-primary/50 focus:outline-none"
                    max={filterOptions.amountRange[1]}
                    min={filterOptions.amountRange[0]}
                    onChange={(e) => handleAmountRangeChange(e, 0)}
                    step={100}
                    type="number"
                    value={filters.amountRange[0]}
                  />
                  <span className="text-brand-secondary">to</span>
                  <input
                    className="flex-1 rounded border border-brand-primary/30 bg-black/20 px-2 py-1 text-sm text-white focus:border-brand-primary/50 focus:outline-none"
                    max={filterOptions.amountRange[1]}
                    min={filterOptions.amountRange[0]}
                    onChange={(e) => handleAmountRangeChange(e, 1)}
                    step={100}
                    type="number"
                    value={filters.amountRange[1]}
                  />
                </div>
                <div className="flex justify-between text-brand-secondary text-xs">
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
