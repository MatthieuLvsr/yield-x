'use client';

import {
  ArrowTrendingDownIcon,
  ArrowTrendingUpIcon,
  BanknotesIcon,
  ChartBarIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import type React from 'react';

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
  animated = true,
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
    <div
      className={`yieldx-card-glass group relative overflow-hidden rounded-xl border p-6 transition-all duration-500 ${getBorderColor()} ${getGlowColor()} ${animated ? 'hover:-translate-y-1 hover:shadow-lg' : ''} `}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-white/5" />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `
              radial-gradient(circle at 20% 80%, ${changeType === 'positive' ? '#40E0D0' : changeType === 'negative' ? '#FF6B9D' : '#00EAFF'}20 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, ${changeType === 'positive' ? '#10B981' : changeType === 'negative' ? '#EF4444' : '#7C3AED'}15 0%, transparent 50%)
            `,
          }}
        />
      </div>

      {/* Animated Corner Accents */}
      <div className="absolute top-0 left-0 h-8 w-8 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div
          className={`h-0.5 w-full ${changeType === 'positive' ? 'bg-neon-green' : changeType === 'negative' ? 'bg-electric-pink' : 'bg-electric-blue'} animate-pulse`}
        />
        <div
          className={`h-full w-0.5 ${changeType === 'positive' ? 'bg-neon-green' : changeType === 'negative' ? 'bg-electric-pink' : 'bg-electric-blue'} animate-pulse`}
        />
      </div>
      <div className="absolute right-0 bottom-0 h-8 w-8 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <div
          className={`h-0.5 w-full ${changeType === 'positive' ? 'bg-neon-green' : changeType === 'negative' ? 'bg-electric-pink' : 'bg-electric-blue'} animate-pulse`}
        />
        <div
          className={`ml-auto h-full w-0.5 ${changeType === 'positive' ? 'bg-neon-green' : changeType === 'negative' ? 'bg-electric-pink' : 'bg-electric-blue'} animate-pulse`}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header with Icon */}
        <div className="mb-4 flex items-center justify-between">
          <div
            className={`rounded-lg p-2 ${changeType === 'positive' ? 'bg-neon-green/20' : changeType === 'negative' ? 'bg-electric-pink/20' : 'bg-electric-blue/20'}transition-all duration-300 group-hover:scale-110 `}
          >
            <Icon className={`h-5 w-5 ${getChangeColor()}`} />
          </div>

          {change && (
            <div
              className={`flex items-center space-x-1 font-semibold text-xs ${getChangeColor()}`}
            >
              {changeType === 'positive' && (
                <ArrowTrendingUpIcon className="h-3 w-3" />
              )}
              {changeType === 'negative' && (
                <ArrowTrendingDownIcon className="h-3 w-3" />
              )}
              <span>{change}</span>
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="mb-2 font-medium text-gray-400 text-sm transition-colors group-hover:text-gray-300">
          {title}
        </h3>

        {/* Value */}
        <div className="flex items-baseline space-x-1">
          {prefix && (
            <span className="font-semibold text-gray-400 text-lg">
              {prefix}
            </span>
          )}
          <div
            className={`font-bold text-2xl text-white group-hover:${getChangeColor()} transition-colors duration-300 ${animated ? 'animate-pulse' : ''} `}
          >
            {value}
          </div>
          {suffix && (
            <span className="font-semibold text-gray-400 text-lg">
              {suffix}
            </span>
          )}
        </div>
      </div>

      {/* Scanning Effect */}
      {animated && (
        <div className="absolute inset-0 overflow-hidden opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <div
            className={`absolute h-px w-full animate-scan bg-gradient-to-r from-transparent via-${changeType === 'positive' ? 'neon-green' : changeType === 'negative' ? 'electric-pink' : 'electric-blue'}/50 to-transparent `}
            style={{ top: '30%' }}
          />
        </div>
      )}

      {/* Glow Effect */}
      <div
        className={`pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-r opacity-0 transition-opacity duration-500 group-hover:opacity-50 from-${changeType === 'positive' ? 'neon-green' : changeType === 'negative' ? 'electric-pink' : 'electric-blue'}/5 via-transparent to-${changeType === 'positive' ? 'neon-green' : changeType === 'negative' ? 'electric-pink' : 'electric-blue'}/5 blur-sm `}
      />
    </div>
  );
};

export default CyberStatsCard;
