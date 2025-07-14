"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  startIndex: number;
  endIndex: number;
  onPageChange: (page: number) => void;
  onNextPage: () => void;
  onPreviousPage: () => void;
}

const YieldPagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  startIndex,
  endIndex,
  onPageChange,
  onNextPage,
  onPreviousPage,
}) => {
  // Générer les numéros de page à afficher
  const getPageNumbers = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mt-8">
      {/* Informations de pagination */}
      <div className="text-sm text-gray-400">
        Showing {startIndex + 1} to {endIndex} of {totalItems} strategies
      </div>

      {/* Contrôles de pagination */}
      <div className="flex items-center gap-2">
        {/* Bouton précédent */}
        <motion.button
          className={`
            flex items-center justify-center px-3 py-2 rounded-xl transition-all duration-200
            ${currentPage === 1 
              ? 'bg-gray-800/20 text-gray-600 cursor-not-allowed' 
              : 'bg-gray-800/40 text-white hover:bg-gray-700/60 hover:shadow-lg hover:shadow-blue-500/10'
            }
          `}
          onClick={onPreviousPage}
          disabled={currentPage === 1}
          whileHover={currentPage !== 1 ? { scale: 1.05 } : {}}
          whileTap={currentPage !== 1 ? { scale: 0.95 } : {}}
        >
          <ChevronLeft size={16} />
        </motion.button>

        {/* Numéros de page */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, index) => (
            <React.Fragment key={index}>
              {page === '...' ? (
                <div className="flex items-center justify-center w-10 h-10 text-gray-500">
                  <MoreHorizontal size={16} />
                </div>
              ) : (
                <motion.button
                  className={`
                    flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200
                    ${page === currentPage
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/20'
                      : 'bg-gray-800/40 text-gray-300 hover:bg-gray-700/60 hover:text-white hover:shadow-lg hover:shadow-blue-500/10'
                    }
                  `}
                  onClick={() => onPageChange(page as number)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {page}
                </motion.button>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Bouton suivant */}
        <motion.button
          className={`
            flex items-center justify-center px-3 py-2 rounded-xl transition-all duration-200
            ${currentPage === totalPages 
              ? 'bg-gray-800/20 text-gray-600 cursor-not-allowed' 
              : 'bg-gray-800/40 text-white hover:bg-gray-700/60 hover:shadow-lg hover:shadow-blue-500/10'
            }
          `}
          onClick={onNextPage}
          disabled={currentPage === totalPages}
          whileHover={currentPage !== totalPages ? { scale: 1.05 } : {}}
          whileTap={currentPage !== totalPages ? { scale: 0.95 } : {}}
        >
          <ChevronRight size={16} />
        </motion.button>
      </div>
    </div>
  );
};

export default YieldPagination;
