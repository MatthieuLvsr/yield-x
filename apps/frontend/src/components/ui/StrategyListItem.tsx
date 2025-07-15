"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Shield, 
  Clock, 
  DollarSign, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { FormattedStrategy } from '../../hooks/useStrategies';

interface StrategyListItemProps {
  strategy: FormattedStrategy;
  onSelect?: (strategy: FormattedStrategy) => void;
  index: number;
}

const StrategyListItem: React.FC<StrategyListItemProps> = ({
  strategy,
  onSelect,
  index,
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
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="bg-gray-800/20 border border-gray-700/30 rounded-xl p-4 
                 hover:bg-gray-800/40 hover:border-gray-600/40 transition-all duration-300 
                 group cursor-pointer"
      onClick={handleClick}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <div className="flex items-center justify-between gap-4">
        {/* Informations principales */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-white truncate group-hover:text-blue-400 transition-colors">
              {strategy.name}
            </h3>
            <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/20 text-blue-400 
                           border border-blue-500/30 rounded-full text-sm font-medium">
              <DollarSign size={12} />
              {strategy.token}
            </div>
          </div>
          <p className="text-sm text-gray-400 line-clamp-1 mb-2">
            {strategy.description}
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>{strategy.protocol}</span>
            <div className="flex items-center gap-1">
              <Clock size={12} />
              {strategy.lockPeriod}
            </div>
          </div>
        </div>

        {/* Métriques */}
        <div className="flex items-center gap-8">
          {/* APY */}
          <div className="text-center">
            <div className="text-2xl font-bold text-white mb-1">
              {strategy.apy.toFixed(1)}%
            </div>
            <div className="text-xs text-gray-400">APY</div>
          </div>

          {/* TVL */}
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-300 mb-1">
              {strategy.tvl}
            </div>
            <div className="text-xs text-gray-400">TVL</div>
          </div>

          {/* Risk */}
          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${getRiskColor(strategy.risk)}`}>
            {getRiskIcon(strategy.risk)}
            {strategy.risk}
          </div>

          {/* Action Button */}
          <motion.button
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 
                       text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 
                       transition-all duration-200 opacity-0 group-hover:opacity-100"
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="flex items-center gap-2">
              <DollarSign size={14} />
              Invest
            </div>
          </motion.button>
        </div>
      </div>

      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 
                     opacity-0 group-hover:opacity-100 transition-opacity duration-300 
                     pointer-events-none rounded-xl" />
    </motion.div>
  );
};

export default StrategyListItem;
