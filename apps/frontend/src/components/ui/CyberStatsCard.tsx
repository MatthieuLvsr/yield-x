'use client';

import React from 'react';
import { 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon, 
  BanknotesIcon,
  ChartBarIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

interface CyberStatsCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon?: React.ComponentType<{ className?: string }>;
  prefix?: string;
  suffix?: string;
  animated?: boolean;
}

const CyberStatsCard: React.FC<CyberStatsCardProps> = ({
  title,
  value,
  change,
  changeType = 'neutral',
  icon: Icon = ChartBarIcon,
  prefix = '',
  suffix = '',
  animated = true
}) => {
  const getChangeColor = () => {
    switch (changeType) {
      case 'positive':
        return 'text-neon-green';
      case 'negative':
        return 'text-electric-pink';
      default:
        return 'text-electric-blue';
    }
  };

  const getGlowColor = () => {
    switch (changeType) {
      case 'positive':
        return 'shadow-neon-green/30';
      case 'negative':
        return 'shadow-electric-pink/30';
      default:
        return 'shadow-electric-blue/30';
    }
  };

  const getBorderColor = () => {
    switch (changeType) {
      case 'positive':
        return 'border-neon-green/30 hover:border-neon-green/50';
      case 'negative':
        return 'border-electric-pink/30 hover:border-electric-pink/50';
      default:
        return 'border-electric-blue/30 hover:border-electric-blue/50';
    }
  };

  return (
    <div className={`
      relative yieldx-card-glass p-6 rounded-xl border transition-all duration-500 group overflow-hidden
      ${getBorderColor()} ${getGlowColor()}
      ${animated ? 'hover:shadow-lg hover:-translate-y-1' : ''}
    `}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5" />
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 80%, ${changeType === 'positive' ? '#40E0D0' : changeType === 'negative' ? '#FF6B9D' : '#00EAFF'}20 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, ${changeType === 'positive' ? '#10B981' : changeType === 'negative' ? '#EF4444' : '#7C3AED'}15 0%, transparent 50%)
            `
          }}
        />
      </div>

      {/* Animated Corner Accents */}
      <div className="absolute top-0 left-0 w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className={`w-full h-0.5 ${changeType === 'positive' ? 'bg-neon-green' : changeType === 'negative' ? 'bg-electric-pink' : 'bg-electric-blue'} animate-pulse`} />
        <div className={`w-0.5 h-full ${changeType === 'positive' ? 'bg-neon-green' : changeType === 'negative' ? 'bg-electric-pink' : 'bg-electric-blue'} animate-pulse`} />
      </div>
      <div className="absolute bottom-0 right-0 w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className={`w-full h-0.5 ${changeType === 'positive' ? 'bg-neon-green' : changeType === 'negative' ? 'bg-electric-pink' : 'bg-electric-blue'} animate-pulse`} />
        <div className={`w-0.5 h-full ml-auto ${changeType === 'positive' ? 'bg-neon-green' : changeType === 'negative' ? 'bg-electric-pink' : 'bg-electric-blue'} animate-pulse`} />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header with Icon */}
        <div className="flex items-center justify-between mb-4">
          <div className={`
            p-2 rounded-lg ${changeType === 'positive' ? 'bg-neon-green/20' : changeType === 'negative' ? 'bg-electric-pink/20' : 'bg-electric-blue/20'}
            transition-all duration-300 group-hover:scale-110
          `}>
            <Icon className={`w-5 h-5 ${getChangeColor()}`} />
          </div>
          
          {change && (
            <div className={`flex items-center space-x-1 text-xs font-semibold ${getChangeColor()}`}>
              {changeType === 'positive' && <ArrowTrendingUpIcon className="w-3 h-3" />}
              {changeType === 'negative' && <ArrowTrendingDownIcon className="w-3 h-3" />}
              <span>{change}</span>
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="text-sm font-medium text-gray-400 mb-2 group-hover:text-gray-300 transition-colors">
          {title}
        </h3>

        {/* Value */}
        <div className="flex items-baseline space-x-1">
          {prefix && (
            <span className="text-lg font-semibold text-gray-400">{prefix}</span>
          )}
          <div className={`
            text-2xl font-bold text-white group-hover:${getChangeColor()} transition-colors duration-300
            ${animated ? 'animate-pulse' : ''}
          `}>
            {value}
          </div>
          {suffix && (
            <span className="text-lg font-semibold text-gray-400">{suffix}</span>
          )}
        </div>
      </div>

      {/* Scanning Effect */}
      {animated && (
        <div className="absolute inset-0 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div 
            className={`
              absolute w-full h-px animate-scan
              bg-gradient-to-r from-transparent via-${changeType === 'positive' ? 'neon-green' : changeType === 'negative' ? 'electric-pink' : 'electric-blue'}/50 to-transparent
            `}
            style={{ top: '30%' }}
          />
        </div>
      )}

      {/* Glow Effect */}
      <div className={`
        absolute inset-0 rounded-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500 pointer-events-none
        bg-gradient-to-r from-${changeType === 'positive' ? 'neon-green' : changeType === 'negative' ? 'electric-pink' : 'electric-blue'}/5 
        via-transparent to-${changeType === 'positive' ? 'neon-green' : changeType === 'negative' ? 'electric-pink' : 'electric-blue'}/5 blur-sm
      `} />
    </div>
  );
};

export default CyberStatsCard;
