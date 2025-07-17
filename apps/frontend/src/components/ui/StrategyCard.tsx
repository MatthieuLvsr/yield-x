'use client';

import { motion } from 'framer-motion';
import {
  Clock,
  DollarSign,
  ExternalLink,
  Shield,
  TrendingUp,
} from 'lucide-react';
import type React from 'react';
import type { FormattedStrategy } from '../../hooks/useStrategies';
import YieldCard from '../ui/YieldCard';

interface StrategyCardProps {
  strategy: FormattedStrategy;
  onSelect?: (strategy: FormattedStrategy) => void;
}

const StrategyCard: React.FC<StrategyCardProps> = ({ strategy, onSelect }) => {
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
        return <Shield className="text-green-400" size={14} />;
      case 'Medium':
        return <TrendingUp className="text-yellow-400" size={14} />;
      case 'High':
        return <TrendingUp className="text-red-400" size={14} />;
      default:
        return <Shield className="text-gray-400" size={14} />;
    }
  };

  const handleClick = () => {
    if (onSelect) {
      onSelect(strategy);
    }
  };

  return (
    <YieldCard
      className="group relative overflow-hidden"
      hover={true}
      onClick={handleClick}
      variant="glass"
    >
      <div className="space-y-4 p-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="mb-1 font-semibold text-lg text-white transition-colors group-hover:text-blue-400">
              {strategy.name}
            </h3>
            <p className="line-clamp-2 text-gray-400 text-sm">
              {strategy.description}
            </p>
          </div>
          <motion.div
            className="ml-4 opacity-0 transition-opacity group-hover:opacity-100"
            whileHover={{ scale: 1.1 }}
          >
            <ExternalLink className="text-gray-400" size={16} />
          </motion.div>
        </div>

        {/* Token and Protocol */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/20 px-3 py-1 font-medium text-blue-400 text-sm">
              <DollarSign size={12} />
              {strategy.token}
            </div>
          </div>
          <div className="text-gray-500 text-xs">{strategy.protocol}</div>
        </div>

        {/* Métriques principales */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="mb-1 font-bold text-2xl text-white">
              {strategy.apy.toFixed(1)}%
            </div>
            <div className="text-gray-400 text-xs">APY</div>
          </div>
          <div className="text-center">
            <div className="mb-1 font-semibold text-gray-300 text-lg">
              {strategy.tvl}
            </div>
            <div className="text-gray-400 text-xs">TVL</div>
          </div>
        </div>

        {/* Risk et Lock Period */}
        <div className="mb-4 flex items-center justify-between">
          <div
            className={`flex items-center gap-2 rounded-full border px-3 py-1 font-medium text-sm ${getRiskColor(strategy.risk)}`}
          >
            {getRiskIcon(strategy.risk)}
            {strategy.risk} Risk
          </div>
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <Clock size={14} />
            {strategy.lockPeriod}
          </div>
        </div>

        {/* Action Button */}
        <motion.button
          className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-3 font-semibold text-white transition-all duration-200 hover:from-blue-600 hover:to-purple-700 group-hover:shadow-blue-500/20 group-hover:shadow-lg"
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
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Glow effect */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-50" />
      </div>
    </YieldCard>
  );
};

export default StrategyCard;
