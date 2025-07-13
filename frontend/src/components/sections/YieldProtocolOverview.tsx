"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheckIcon, 
  BoltIcon, 
  ChartBarIcon, 
  SparklesIcon 
} from '@heroicons/react/24/outline';
import YieldLogo from '@/components/ui/YieldLogo';
import YieldStats from '@/components/ui/YieldStats';
import YieldCard from '@/components/ui/YieldCard';
import CyberLogo from '../ui/CyberLogo';

const YieldProtocolOverview: React.FC = () => {
  const protocolStats = [
    {
      title: 'Total Value Locked',
      value: '$24.7M',
      subtitle: 'Across all strategies',
      trend: 'up' as const,
      trendValue: '+12.5%',
      variant: 'success' as const,
    },
    {
      title: 'Average APY',
      value: '18.2%',
      subtitle: 'Weighted average',
      trend: 'up' as const,
      trendValue: '+2.1%',
      variant: 'primary' as const,
    },
    {
      title: 'Active Strategies',
      value: '12',
      subtitle: 'Live protocols',
      trend: 'neutral' as const,
      trendValue: '2 new',
      variant: 'secondary' as const,
    },
    {
      title: 'Total Users',
      value: '5,247',
      subtitle: 'Unique depositors',
      trend: 'up' as const,
      trendValue: '+156',
      variant: 'accent' as const,
    },
  ];

  const features = [
    {
      icon: ShieldCheckIcon,
      title: 'Secure & Audited',
      description: 'Smart contracts audited by leading security firms with full transparency.',
    },
    {
      icon: BoltIcon,
      title: 'High Performance',
      description: 'Built on Solana for fast, cheap transactions with minimal slippage.',
    },
    {
      icon: ChartBarIcon,
      title: 'Optimized Yields',
      description: 'Advanced algorithms automatically find the best yield opportunities.',
    },
    {
      icon: SparklesIcon,
      title: 'Governance Token',
      description: 'YIELD-X token holders participate in protocol governance and earn rewards.',
    },
  ];

  return (
    <section className="py-24 px-6" id="protocol">
      <div className="container mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
                {/* Logo Animation avec CyberLogo hero size */}
                <motion.div
                  className="flex justify-center mb-16"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, delay: 0.2 }}
                >
                  <CyberLogo variant="icon" size="hero" glowEffect={true} />
                </motion.div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="yieldx-text-gradient">Protocol Overview</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Yield-X is a decentralized yield optimization protocol built on Solana, 
            designed to maximize returns while minimizing risks through advanced strategies.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <YieldStats stats={protocolStats} />
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
            >
              <YieldCard variant="glass" className="p-6 text-center h-full">
                <div className="flex justify-center mb-4">
                  <feature.icon className="w-10 h-10 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{feature.description}</p>
              </YieldCard>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className="yieldx-card-glass p-8 max-w-2xl mx-auto border border-white/10 relative overflow-hidden">
            {/* Subtle accent */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-green-500/5 rounded-lg"></div>
            
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-white mb-4">
                Ready to Start Earning?
              </h3>
              <p className="text-gray-300 mb-6">
                Join thousands of users who are already maximizing their yields with Yield-X Protocol.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="yieldx-btn-primary">
                  Start Earning
                </button>
                <button className="yieldx-btn-ghost">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default YieldProtocolOverview;
