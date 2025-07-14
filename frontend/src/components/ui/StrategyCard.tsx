"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Shield, Clock, DollarSign, ExternalLink } from 'lucide-react';
import { FormattedStrategy } from '../../hooks/useStrategies';
import YieldCard from '../ui/YieldCard';

interface StrategyCardProps {
  strategy: FormattedStrategy;
  onSelect?: (strategy: FormattedStrategy) => void;
}

const StrategyCard: React.FC<StrategyCardProps> = ({
  strategy,
  onSelect,
}) => {
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Low':
        return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'Medium':
        return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'High':
        return 'text-red-400 bg-red-400/10 border-red-400/20';
      default:
        return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
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
        return <Shield size={14} className="text-gray-400" />;
    }
  };

  const handleClick = () => {
    if (onSelect) {
      onSelect(strategy);
    }
  };

  return (
    <YieldCard
      variant="glass"
      hover={true}
      onClick={handleClick}
      className="relative overflow-hidden group"
    >
      <div className="p-6 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-blue-400 transition-colors">
              {strategy.name}
            </h3>
            <p className="text-sm text-gray-400 line-clamp-2">
              {strategy.description}
            </p>
          </div>
          <motion.div
            className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity"
            whileHover={{ scale: 1.1 }}
          >
            <ExternalLink size={16} className="text-gray-400" />
          </motion.div>
        </div>

        {/* Token and Protocol */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/20 text-blue-400 
                           border border-blue-500/30 rounded-full text-sm font-medium">
              <DollarSign size={12} />
              {strategy.token}
            </div>
          </div>
          <div className="text-xs text-gray-500">
            {strategy.protocol}
          </div>
        </div>

        {/* Métriques principales */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-1">
              {strategy.apy.toFixed(1)}%
            </div>
            <div className="text-xs text-gray-400">APY</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-300 mb-1">
              {strategy.tvl}
            </div>
            <div className="text-xs text-gray-400">TVL</div>
          </div>
        </div>

        {/* Risk et Lock Period */}
        <div className="flex items-center justify-between mb-4">
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${getRiskColor(strategy.risk)}`}>
            {getRiskIcon(strategy.risk)}
            {strategy.risk} Risk
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Clock size={14} />
            {strategy.lockPeriod}
          </div>
        </div>

        {/* Action Button */}
        <motion.button
          className="w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 
                     text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 
                     transition-all duration-200 group-hover:shadow-lg group-hover:shadow-blue-500/20"
          onClick={(e) => {
            e.stopPropagation();
            handleClick();
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center justify-center gap-2">
            <DollarSign size={16} />
            Invest Now
          </div>
        </motion.button>

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 
                       opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 
                       blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300 pointer-events-none" />
      </div>
    </YieldCard>
  );
};

export default StrategyCard;
