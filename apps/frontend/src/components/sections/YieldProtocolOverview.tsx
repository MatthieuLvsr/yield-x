'use client';

import {
  BoltIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import type React from 'react';
import YieldCard from '@/components/ui/YieldCard';
import YieldLogo from '@/components/ui/YieldLogo';
import YieldStats from '@/components/ui/YieldStats';
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
      description:
        'Smart contracts audited by leading security firms with full transparency.',
    },
    {
      icon: BoltIcon,
      title: 'High Performance',
      description:
        'Built on Solana for fast, cheap transactions with minimal slippage.',
    },
    {
      icon: ChartBarIcon,
      title: 'Optimized Yields',
      description:
        'Advanced algorithms automatically find the best yield opportunities.',
    },
    {
      icon: SparklesIcon,
      title: 'Governance Token',
      description:
        'YIELD-X token holders participate in protocol governance and earn rewards.',
    },
  ];

  return (
    <section className="px-6 py-24" id="protocol">
      <div className="container mx-auto">
        {/* Header */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.8 }}
        >
          {/* Logo Animation avec CyberLogo hero size */}
          <motion.div
            animate={{ opacity: 1, scale: 1 }}
            className="mb-16 flex justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <CyberLogo glowEffect={true} size="hero" variant="icon" />
          </motion.div>
          <h2 className="relative mb-6 font-bold text-4xl md:text-5xl">
            <span className="yieldx-text-gradient">Protocol Overview</span>
          </h2>
          <p className="relative mx-auto max-w-3xl text-gray-300 text-xl">
            Yield-X is a decentralized yield optimization protocol built on
            Solana, designed to maximize returns while minimizing risks through
            advanced strategies.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <YieldStats stats={protocolStats} />
        </motion.div>

        {/* Features Grid */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
          initial={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {features.map((feature, index) => (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              key={feature.title}
              transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
            >
              <YieldCard className="h-full p-6 text-center" variant="glass">
                <div className="mb-4 flex justify-center">
                  <feature.icon className="h-10 w-10 text-blue-400" />
                </div>
                <h3 className="mb-3 font-semibold text-white text-xl">
                  {feature.title}
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </YieldCard>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <div className="yieldx-card-glass relative mx-auto max-w-2xl overflow-hidden border border-white/10 p-8">
            {/* Subtle accent */}
            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/5 to-green-500/5" />

            <div className="relative z-10">
              <h3 className="mb-4 font-bold text-2xl text-white">
                Ready to Start Earning?
              </h3>
              <p className="mb-6 text-gray-300">
                Join thousands of users who are already maximizing their yields
                with Yield-X Protocol.
              </p>
              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <button className="yieldx-btn-primary">Start Earning</button>
                <button className="yieldx-btn-ghost">Learn More</button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default YieldProtocolOverview;
