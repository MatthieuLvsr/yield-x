"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

interface StrategiesHeaderProps {
  strategiesCount: number;
  onRefresh?: () => void;
  isLoading?: boolean;
}

const StrategiesHeader: React.FC<StrategiesHeaderProps> = ({
  strategiesCount,
  onRefresh,
  isLoading = false,
}) => {
  return (
    <div className="text-center mb-12">
      <motion.h2
        className="text-4xl md:text-5xl font-bold text-white mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <span className="text-white">Earn </span>
        <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent">
          Strategies
        </span>
      </motion.h2>
      
      <motion.p
        className="text-xl text-gray-300 max-w-3xl mx-auto mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        Choose from our curated selection of yield strategies, each optimized for 
        different risk profiles and return expectations.
      </motion.p>
      
      {/* Stats et refresh */}
      <motion.div
        className="flex flex-wrap justify-center items-center gap-8 mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-400">{strategiesCount}</div>
          <div className="text-sm text-gray-400">Strategies Available</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-green-400">$125.8M</div>
          <div className="text-sm text-gray-400">Total Value Locked</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-purple-400">12.5%</div>
          <div className="text-sm text-gray-400">Average APY</div>
        </div>
        
        {/* Refresh button */}
        {onRefresh && (
          <motion.button
            onClick={onRefresh}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800/40 hover:bg-gray-700/60 
                       border border-gray-700/50 rounded-xl text-white transition-all duration-200
                       disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowPathIcon 
              className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} 
            />
            <span className="text-sm font-medium">
              {isLoading ? 'Refreshing...' : 'Refresh Strategies'}
            </span>
          </motion.button>
        )}
      </motion.div>
    </div>
  );
};

export default StrategiesHeader;
