'use client';

import {
  ArrowTrendingUpIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import type React from 'react';

const AnalyticsSection: React.FC = () => {
  const stats = [
    {
      label: 'Total Value Locked',
      value: '$2.4M',
      change: '+12.5%',
      icon: CurrencyDollarIcon,
      color: 'text-green-400',
    },
    {
      label: 'Active Strategies',
      value: '156',
      change: '+8.2%',
      icon: ChartBarIcon,
      color: 'text-blue-400',
    },
    {
      label: 'Average APY',
      value: '14.8%',
      change: '+2.1%',
      icon: ArrowTrendingUpIcon,
      color: 'text-purple-400',
    },
    {
      label: 'Active Users',
      value: '1,234',
      change: '+15.7%',
      icon: UsersIcon,
      color: 'text-orange-400',
    },
  ];

  return (
    <section className="relative px-6 py-24" id="analytics">
      {/* Background Effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="yieldx-glow-electric absolute top-1/4 left-1/4 h-96 w-96 rounded-full opacity-20 blur-3xl" />
        <div className="yieldx-glow-neon absolute right-1/4 bottom-1/4 h-80 w-80 rounded-full opacity-15 blur-3xl" />
        <div className="yieldx-glow-purple absolute top-3/4 left-3/4 h-64 w-64 rounded-full opacity-10 blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto">
        {/* Section Header */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="yieldx-text-gradient mb-6 font-bold text-5xl">
            Protocol Analytics
          </h2>
          <p className="mx-auto max-w-2xl text-rgb(var(--yieldx-text-secondary)) text-xl">
            Real-time insights into the Yield-X protocol performance and user
            activity
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="yieldx-card-glass p-6 text-center"
              initial={{ opacity: 0, y: 30 }}
              key={stat.label}
              transition={{ duration: 0.8, delay: index * 0.1 }}
            >
              <div className="mb-4 flex justify-center">
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
              <div className="mb-2 font-bold text-3xl text-white">
                {stat.value}
              </div>
              <div className="mb-1 text-rgb(var(--yieldx-text-secondary)) text-sm">
                {stat.label}
              </div>
              <div className={`font-medium text-sm ${stat.color}`}>
                {stat.change}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Coming Soon Message */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="yieldx-card-glass p-12 text-center"
          initial={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <ChartBarIcon className="mx-auto mb-6 h-16 w-16 text-rgb(var(--yieldx-electric-blue))" />
          <h3 className="mb-4 font-bold text-2xl text-white">
            Advanced Analytics Coming Soon
          </h3>
          <p className="mx-auto max-w-2xl text-rgb(var(--yieldx-text-secondary))">
            We're building comprehensive analytics dashboards with detailed
            charts, historical data, and advanced metrics to help you make
            informed decisions.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default AnalyticsSection;
