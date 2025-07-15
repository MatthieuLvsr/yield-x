"use client";

import { useState, useEffect, useMemo } from 'react';
import { FormattedStrategy } from './useStrategies';

export interface StrategiesFilters {
  token: string;
  risk: 'All' | 'Low' | 'Medium' | 'High';
  apyRange: [number, number];
  protocol: string;
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

export type SortOption = 'apy' | 'tvl' | 'risk' | 'name';
export type SortDirection = 'asc' | 'desc';
export type ViewMode = 'grid' | 'list';

export const useStrategiesPagination = (strategies: FormattedStrategy[], itemsPerPage: number = 9) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<SortOption>('apy');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [filters, setFilters] = useState<StrategiesFilters>({
    token: 'All',
    risk: 'All',
    apyRange: [0, 100],
    protocol: 'All',
    searchTerm: '',
  });

  // Réinitialiser à la page 1 quand les filtres changent
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, sortBy, sortDirection]);

  // Filtrer les stratégies
  const filteredStrategies = useMemo(() => {
    return strategies.filter(strategy => {
      // Filtre par token
      if (filters.token !== 'All' && strategy.token !== filters.token) {
        return false;
      }

      // Filtre par niveau de risque
      if (filters.risk !== 'All' && strategy.risk !== filters.risk) {
        return false;
      }

      // Filtre par APY range
      if (strategy.apy < filters.apyRange[0] || strategy.apy > filters.apyRange[1]) {
        return false;
      }

      // Filtre par protocole
      if (filters.protocol !== 'All' && strategy.protocol !== filters.protocol) {
        return false;
      }

      // Filtre par terme de recherche
      if (filters.searchTerm && !strategy.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) &&
          !strategy.description.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
        return false;
      }

      return true;
    });
  }, [strategies, filters]);

  // Trier les stratégies filtrées
  const sortedStrategies = useMemo(() => {
    const sorted = [...filteredStrategies].sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'apy':
          comparison = a.apy - b.apy;
          break;
        case 'tvl':
          // Convertir TVL en nombres pour la comparaison
          const aTvl = parseFloat(a.tvl.replace(/[^0-9.-]+/g, '')) || 0;
          const bTvl = parseFloat(b.tvl.replace(/[^0-9.-]+/g, '')) || 0;
          comparison = aTvl - bTvl;
          break;
        case 'risk':
          const riskOrder = { 'Low': 1, 'Medium': 2, 'High': 3 };
          comparison = riskOrder[a.risk] - riskOrder[b.risk];
          break;
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
    const tokens = ['All', ...Array.from(new Set(strategies.map(s => s.token)))];
    const protocols = ['All', ...Array.from(new Set(strategies.map(s => s.protocol)))];
    const minApy = Math.min(...strategies.map(s => s.apy));
    const maxApy = Math.max(...strategies.map(s => s.apy));

    return {
      tokens,
      protocols,
      apyRange: [Math.floor(minApy), Math.ceil(maxApy)] as [number, number],
    };
  }, [strategies]);

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
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFilters({
      token: 'All',
      risk: 'All',
      apyRange: filterOptions.apyRange,
      protocol: 'All',
      searchTerm: '',
    });
  };

  // Fonctions de contrôle tri
  const handleSortChange = (newSortBy: SortOption, newDirection: SortDirection) => {
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