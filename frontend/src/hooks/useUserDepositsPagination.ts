"use client";

import { useState, useEffect, useMemo } from 'react';
import { UserDeposit } from './useUserDeposits';
import { EnrichedUserDeposit } from '@/lib/depositUtils';

export interface UserDepositsFilters {
  token: string;
  status: 'All' | 'Active' | 'Matured' | 'Pending';
  strategy: string;
  apyRange: [number, number];
  amountRange: [number, number];
  searchTerm: string;
}

export interface UserDepositsPaginationInfo {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  startIndex: number;
  endIndex: number;
}

export type UserDepositSortOption = 'depositDate' | 'amount' | 'yieldAmount' | 'apy' | 'maturityDate' | 'timeUntilMaturity';
export type UserDepositSortDirection = 'asc' | 'desc';
export type UserDepositViewMode = 'grid' | 'list' | 'table';

export const useUserDepositsPagination = (deposits: EnrichedUserDeposit[], itemsPerPage: number = 10) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<UserDepositSortOption>('depositDate');
  const [sortDirection, setSortDirection] = useState<UserDepositSortDirection>('desc');
  const [viewMode, setViewMode] = useState<UserDepositViewMode>('grid');
  
  // Calculer les ranges basés sur les données réelles
  const apyRange = useMemo(() => {
    if (deposits.length === 0) return [0, 100];
    const apys = deposits.map(d => parseFloat(d.apy));
    const min = Math.floor(Math.min(...apys));
    const max = Math.ceil(Math.max(...apys));
    return [min, max];
  }, [deposits]);

  const amountRange = useMemo(() => {
    if (deposits.length === 0) return [0, 10000];
    const amounts = deposits.map(d => parseFloat(d.amount));
    const min = Math.floor(Math.min(...amounts));
    const max = Math.ceil(Math.max(...amounts));
    return [min, max];
  }, [deposits]);

  const [filters, setFilters] = useState<UserDepositsFilters>({
    token: 'All',
    status: 'All',
    strategy: 'All',
    apyRange: [0, 100], // Sera mis à jour dynamiquement
    amountRange: [0, 10000], // Sera mis à jour dynamiquement
    searchTerm: '',
  });

  // Mettre à jour les filtres quand les données changent
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      apyRange: apyRange as [number, number],
      amountRange: amountRange as [number, number],
    }));
  }, [apyRange, amountRange]);

  // Réinitialiser à la page 1 quand les filtres changent
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, sortBy, sortDirection]);

  // Déterminer le statut d'un dépôt
  const getDepositStatus = (deposit: EnrichedUserDeposit): 'Active' | 'Matured' | 'Pending' => {
    if (deposit.isMatured) return 'Matured';
    if (deposit.timeUntilMaturity > 0) return 'Active';
    return 'Pending';
  };

  // Filtrer les dépôts
  const filteredDeposits = useMemo(() => {
    return deposits.filter(deposit => {
      // Filtre par token (basé sur l'adresse du token)
      if (filters.token !== 'All') {
        const tokenSymbol = deposit.tokenSymbol || deposit.tokenAddress.slice(0, 4).toUpperCase();
        if (tokenSymbol !== filters.token) {
          return false;
        }
      }

      // Filtre par statut
      if (filters.status !== 'All') {
        const status = getDepositStatus(deposit);
        if (status !== filters.status) {
          return false;
        }
      }

      // Filtre par stratégie (basé sur l'adresse de la stratégie)
      if (filters.strategy !== 'All') {
        const strategyId = deposit.strategyAddress.slice(0, 8);
        if (strategyId !== filters.strategy) {
          return false;
        }
      }

      // Filtre par APY range
      const apy = parseFloat(deposit.apy); // APY est déjà en pourcentage
      if (apy < filters.apyRange[0] || apy > filters.apyRange[1]) {
        return false;
      }

      // Filtre par montant range
      const amount = parseFloat(deposit.amount);
      if (amount < filters.amountRange[0] || amount > filters.amountRange[1]) {
        return false;
      }

      // Filtre par terme de recherche
      if (filters.searchTerm) {
        const searchTerm = filters.searchTerm.toLowerCase();
        const strategyId = deposit.strategyAddress.slice(0, 8).toLowerCase();
        const tokenSymbol = (deposit.tokenSymbol || deposit.tokenAddress.slice(0, 4)).toLowerCase();
        
        if (!strategyId.includes(searchTerm) && !tokenSymbol.includes(searchTerm)) {
          return false;
        }
      }

      return true;
    });
  }, [deposits, filters]);

  // Trier les dépôts filtrés
  const sortedDeposits = useMemo(() => {
    const sorted = [...filteredDeposits].sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'depositDate':
          comparison = new Date(a.depositDate).getTime() - new Date(b.depositDate).getTime();
          break;
        case 'amount':
          comparison = parseFloat(a.amount) - parseFloat(b.amount);
          break;
        case 'yieldAmount':
          comparison = parseFloat(a.yieldAmount) - parseFloat(b.yieldAmount);
          break;
        case 'apy':
          comparison = parseFloat(a.apy) - parseFloat(b.apy);
          break;
        case 'maturityDate':
          comparison = new Date(a.maturityDate).getTime() - new Date(b.maturityDate).getTime();
          break;
        case 'timeUntilMaturity':
          comparison = a.timeUntilMaturity - b.timeUntilMaturity;
          break;
        default:
          comparison = 0;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return sorted;
  }, [filteredDeposits, sortBy, sortDirection]);

  // Paginer les dépôts triés
  const paginatedDeposits = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedDeposits.slice(startIndex, endIndex);
  }, [sortedDeposits, currentPage, itemsPerPage]);

  // Informations de pagination
  const paginationInfo: UserDepositsPaginationInfo = useMemo(() => {
    const totalItems = sortedDeposits.length;
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
  }, [sortedDeposits.length, currentPage, itemsPerPage]);

  // Obtenir les valeurs uniques pour les filtres
  const filterOptions = useMemo(() => {
    const tokens = ['All', ...Array.from(new Set(deposits.map(d => d.tokenSymbol || d.tokenAddress.slice(0, 4).toUpperCase())))];
    const strategies = ['All', ...Array.from(new Set(deposits.map(d => d.strategyAddress.slice(0, 8))))];
    const amounts = deposits.map(d => parseFloat(d.amount));
    const apys = deposits.map(d => parseFloat(d.apy)); // APY est déjà en pourcentage
    
    const minAmount = amounts.length > 0 ? Math.min(...amounts) : 0;
    const maxAmount = amounts.length > 0 ? Math.max(...amounts) : 999999999;
    const minApy = apys.length > 0 ? Math.min(...apys) : 0;
    const maxApy = apys.length > 0 ? Math.max(...apys) : 1000;

    return {
      tokens,
      strategies,
      amountRange: [Math.floor(minAmount), Math.ceil(maxAmount)] as [number, number],
      apyRange: [Math.floor(minApy), Math.ceil(maxApy)] as [number, number],
    };
  }, [deposits]);

  // Calculer les statistiques
  const stats = useMemo(() => {
    const totalDeposits = deposits.length;
    const totalValue = deposits.reduce((sum, d) => sum + parseFloat(d.amount), 0);
    const totalYield = deposits.reduce((sum, d) => sum + parseFloat(d.yieldAmount), 0);
    const activeDeposits = deposits.filter(d => getDepositStatus(d) === 'Active').length;
    const maturedDeposits = deposits.filter(d => getDepositStatus(d) === 'Matured').length;
    const avgApy = deposits.length > 0 
      ? deposits.reduce((sum, d) => sum + parseFloat(d.apy), 0) / deposits.length  // APY est déjà en pourcentage
      : 0;

    return {
      totalDeposits,
      totalValue,
      totalYield,
      activeDeposits,
      maturedDeposits,
      avgApy,
    };
  }, [deposits]);

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
  const updateFilters = (newFilters: Partial<UserDepositsFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFilters({
      token: 'All',
      status: 'All',
      strategy: 'All',
      apyRange: filterOptions.apyRange,
      amountRange: filterOptions.amountRange,
      searchTerm: '',
    });
  };

  // Fonctions de contrôle tri
  const handleSortChange = (newSortBy: UserDepositSortOption, newDirection: UserDepositSortDirection) => {
    setSortBy(newSortBy);
    setSortDirection(newDirection);
  };

  // Fonction de contrôle vue
  const handleViewModeChange = (mode: UserDepositViewMode) => {
    setViewMode(mode);
  };

  return {
    // Données paginées
    paginatedDeposits,
    filteredDeposits: sortedDeposits,
    
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
    
    // Statistiques
    stats,
  };
};
