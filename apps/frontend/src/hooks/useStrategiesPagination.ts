'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Strategy } from '@/app/page';
import { useTokenInfosMap } from './useTokenInfosMap';

export interface StrategiesFilters {
  token: string;
  risk: 'All' | 'Low' | 'Medium' | 'High';
  apyRange: [number, number];
  searchTerm: string;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  startIndex: number;
  endIndex: number;
}

export type SortOption = 'apy' | 'risk' | 'name';
export type SortDirection = 'asc' | 'desc';
export type ViewMode = 'grid' | 'list';

export const getStrategyRisk = (strategy: Strategy) => {
  let _strategyRisk: 'Low' | 'Medium' | 'High';

  if (strategy.account.rewardApy > 15) {
    _strategyRisk = 'High';
  } else if (strategy.account.rewardApy >= 7) {
    _strategyRisk = 'Medium';
  } else {
    _strategyRisk = 'Low';
  }

  return _strategyRisk;
};

export const useStrategiesPagination = (
  strategies: Strategy[],
  itemsPerPage = 9
) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<SortOption>('apy');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [filters, setFilters] = useState<StrategiesFilters>({
    token: 'All',
    risk: 'All',
    apyRange: [0, 100],
    searchTerm: '',
  });
  const tokenInfos = useTokenInfosMap(strategies);
  useEffect(() => {
    // Réinitialiser à la page 1 quand les filtres changent
    setCurrentPage(1);
  }, [filters, sortBy, sortDirection]);

  // Filtrer les stratégies (synchroniquement)
  const filteredStrategies = useMemo(() => {
    return strategies.filter((strategy) => {
      const tokenInfo = tokenInfos[strategy.account.tokenAddress.toString()];

      if (filters.token !== 'All' && tokenInfo?.name !== filters.token) {
        return false;
      }

      if (
        filters.risk !== 'All' &&
        getStrategyRisk(strategy) !== filters.risk
      ) {
        return false;
      }

      // Filtre par APY range
      if (
        strategy.account.rewardApy < filters.apyRange[0] ||
        strategy.account.rewardApy > filters.apyRange[1]
      ) {
        return false;
      }

      if (
        filters.searchTerm &&
        !tokenInfo?.name
          ?.toLowerCase()
          .includes(filters.searchTerm.toLowerCase())
      ) {
        return false;
      }

      return true;
    });
  }, [strategies, filters, tokenInfos]);

  const sortedStrategies = useMemo(() => {
    const sorted = [...filteredStrategies].sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'apy':
          comparison = a.account.rewardApy - b.account.rewardApy;
          break;
        // case 'tvl': {
        //   // Convertir TVL en nombres pour la comparaison
        //   const aTvl = Number.parseFloat(a.tvl.replace(/[^0-9.-]+/g, '')) || 0;
        //   const bTvl = Number.parseFloat(b.tvl.replace(/[^0-9.-]+/g, '')) || 0;
        //   comparison = aTvl - bTvl;
        //   break;
        // }
        case 'risk': {
          const riskOrder = { Low: 1, Medium: 2, High: 3 };
          comparison =
            riskOrder[getStrategyRisk(a)] - riskOrder[getStrategyRisk(b)];
          break;
        }
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        default:
          comparison = 0;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return sorted;
  }, [filteredStrategies, sortBy, sortDirection]);

  // Paginer les stratégies triées
  const paginatedStrategies = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedStrategies.slice(startIndex, endIndex);
  }, [sortedStrategies, currentPage, itemsPerPage]);

  // Informations de pagination
  const paginationInfo: PaginationInfo = useMemo(() => {
    const totalItems = sortedStrategies.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

    return {
      currentPage,
      totalPages,
      itemsPerPage,
      totalItems,
      startIndex,
      endIndex,
    };
  }, [sortedStrategies.length, currentPage, itemsPerPage]);

  // Obtenir les valeurs uniques pour les filtres
  const filterOptions = useMemo(() => {
    const tokens = [
      'All',
      ...Array.from(
        new Set(
          strategies.map((strategy) => {
            const tokenInfo =
              tokenInfos[strategy.account.tokenAddress.toString()];
            return tokenInfo?.name || 'Unknown';
          })
        )
      ),
    ];
    const minApy = Math.min(...strategies.map((s) => s.apy));
    const maxApy = Math.max(...strategies.map((s) => s.apy));

    return {
      tokens,
      apyRange: [Math.floor(minApy), Math.ceil(maxApy)] as [number, number],
    };
  }, [strategies, tokenInfos]);

  // Fonctions de contrôle pagination
  const goToPage = (page: number) => {
    if (page >= 1 && page <= paginationInfo.totalPages) {
      setCurrentPage(page);
    }
  };

  const goToNextPage = () => {
    if (currentPage < paginationInfo.totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Fonctions de contrôle filtres
  const updateFilters = (newFilters: Partial<StrategiesFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFilters({
      token: 'All',
      risk: 'All',
      apyRange: filterOptions.apyRange,
      searchTerm: '',
    });
  };

  // Fonctions de contrôle tri
  const handleSortChange = (
    newSortBy: SortOption,
    newDirection: SortDirection
  ) => {
    setSortBy(newSortBy);
    setSortDirection(newDirection);
  };

  // Fonction de contrôle vue
  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
  };

  return {
    // Données paginées
    paginatedStrategies,
    filteredStrategies: sortedStrategies,

    // Informations de pagination
    paginationInfo,

    // Contrôles de pagination
    goToPage,
    goToNextPage,
    goToPreviousPage,

    // Filtres
    filters,
    updateFilters,
    resetFilters,
    filterOptions,

    // Tri
    sortBy,
    sortDirection,
    handleSortChange,

    // Vue
    viewMode,
    handleViewModeChange,
  };
};
