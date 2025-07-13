"use client";

import React from 'react';
import { motion } from 'framer-motion';
import YieldCard from '@/components/ui/YieldCard';

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  variant?: 'primary' | 'secondary' | 'accent' | 'success';
  index?: number;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  trend = 'neutral',
  trendValue,
  variant = 'primary',
  index = 0,
}) => {
  const gradientClasses = {
    primary: 'yield-primary-gradient',
    secondary: 'yield-secondary-gradient',
    accent: 'yield-accent-gradient',
    success: 'yield-success-gradient',
  };

  const trendColors = {
    up: 'text-green-400',
    down: 'text-red-400',
    neutral: 'text-gray-400',
  };

  const trendIcons = {
    up: '↗',
    down: '↘',
    neutral: '→',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <YieldCard variant="stats" className="p-6 text-center">
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider">
            {title}
          </h3>
          <div className={`text-3xl font-bold ${gradientClasses[variant]} bg-clip-text text-transparent`}>
            {value}
          </div>
          {subtitle && (
            <p className="text-sm text-white/50">{subtitle}</p>
          )}
          {trendValue && (
            <div className={`flex items-center justify-center space-x-1 text-sm ${trendColors[trend]}`}>
              <span>{trendIcons[trend]}</span>
              <span>{trendValue}</span>
            </div>
          )}
        </div>
      </YieldCard>
    </motion.div>
  );
};

interface YieldStatsProps {
  stats: Array<{
    title: string;
    value: string;
    subtitle?: string;
    trend?: 'up' | 'down' | 'neutral';
    trendValue?: string;
    variant?: 'primary' | 'secondary' | 'accent' | 'success';
  }>;
  className?: string;
}

const YieldStats: React.FC<YieldStatsProps> = ({ stats, className = '' }) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
      {stats.map((stat, index) => (
        <StatCard key={stat.title} {...stat} index={index} />
      ))}
    </div>
  );
};

export default YieldStats;
