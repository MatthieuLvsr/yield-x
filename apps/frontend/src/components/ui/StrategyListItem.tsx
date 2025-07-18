'use client';

import { motion } from 'framer-motion';
import { Clock, DollarSign, Shield, TrendingUp } from 'lucide-react';
import type { Strategy } from '@/app/page';
import { useTokenInfo } from '@/hooks/useStrategies';
import { getStrategyRisk } from '@/hooks/useStrategiesPagination';

interface StrategyListItemProps {
  strategy: Strategy;
  onSelect?: (strategy: Strategy) => void;
  index: number;
}

const StrategyListItem = ({
  strategy,
  onSelect,
  index,
}: StrategyListItemProps) => {
  const { tokenInfo } = useTokenInfo(strategy);

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
    <motion.div
      animate={{ opacity: 1, x: 0 }}
      className="group cursor-pointer rounded-xl border border-gray-700/30 bg-gray-800/20 p-4 transition-all duration-300 hover:border-gray-600/40 hover:bg-gray-800/40"
      initial={{ opacity: 0, x: -20 }}
      onClick={handleClick}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
    >
      <div className="flex items-center justify-between gap-4">
        {/* Informations principales */}
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-center gap-3">
            <h3 className="truncate font-semibold text-lg text-white transition-colors group-hover:text-blue-400">
              {tokenInfo?.symbol || 'Unknown'}
            </h3>
            <div className="flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/20 px-3 py-1 font-medium text-blue-400 text-sm">
              <DollarSign size={12} />
              {tokenInfo?.name || 'Unknown'}
            </div>
          </div>
          <p className="mb-2 line-clamp-1 text-gray-400 text-sm">
            {tokenInfo?.name || 'Unknown'} - {tokenInfo?.symbol || 'Unknown'}
          </p>
          <div className="flex items-center gap-4 text-gray-500 text-xs">
            <span>Yield-X Protocol</span>
            <div className="flex items-center gap-1">
              <Clock size={12} />
              30 days
            </div>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="text-center">
            <div className="mb-1 font-bold text-2xl text-white">
              {strategy.account.rewardApy.toString()}%
            </div>
            <div className="text-gray-400 text-xs">APY</div>
          </div>

          <div className="text-center">
            <div className="mb-1 font-semibold text-gray-300 text-lg">0</div>
            <div className="text-gray-400 text-xs">TVL</div>
          </div>

          <div
            className={`flex items-center gap-2 rounded-full border px-3 py-1 font-medium text-sm ${getRiskColor(getStrategyRisk(strategy))}`}
          >
            {getRiskIcon(getStrategyRisk(strategy))}
            {getStrategyRisk(strategy)}
          </div>

          {/* Action Button */}
          <motion.button
            className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-2 font-semibold text-white opacity-0 transition-all duration-200 hover:from-blue-600 hover:to-purple-700 group-hover:opacity-100"
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
      <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </motion.div>
  );
};

export default StrategyListItem;
