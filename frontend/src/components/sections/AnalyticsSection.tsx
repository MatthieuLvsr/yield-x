"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ChartBarIcon, CurrencyDollarIcon, ArrowTrendingUpIcon, UsersIcon } from '@heroicons/react/24/outline';

const AnalyticsSection: React.FC = () => {
  const stats = [
    {
      label: 'Total Value Locked',
      value: '$2.4M',
      change: '+12.5%',
      icon: CurrencyDollarIcon,
      color: 'text-green-400'
    },
    {
      label: 'Active Strategies',
      value: '156',
      change: '+8.2%',
      icon: ChartBarIcon,
      color: 'text-blue-400'
    },
    {
      label: 'Average APY',
      value: '14.8%',
      change: '+2.1%',
      icon: ArrowTrendingUpIcon,
      color: 'text-purple-400'
    },
    {
      label: 'Active Users',
      value: '1,234',
      change: '+15.7%',
      icon: UsersIcon,
      color: 'text-orange-400'
    }
  ];

  return (
    <section className="relative py-24 px-6" id="analytics">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 yieldx-glow-electric rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 yieldx-glow-neon rounded-full blur-3xl opacity-15"></div>
        <div className="absolute top-3/4 left-3/4 w-64 h-64 yieldx-glow-purple rounded-full blur-3xl opacity-10"></div>
      </div>

      <div className="container mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-5xl font-bold yieldx-text-gradient mb-6">
            Protocol Analytics
          </h2>
          <p className="text-xl text-rgb(var(--yieldx-text-secondary)) max-w-2xl mx-auto">
            Real-time insights into the Yield-X protocol performance and user activity
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="yieldx-card-glass p-6 text-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
            >
              <div className="flex justify-center mb-4">
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
              <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
              <div className="text-sm text-rgb(var(--yieldx-text-secondary)) mb-1">{stat.label}</div>
              <div className={`text-sm font-medium ${stat.color}`}>{stat.change}</div>
            </motion.div>
          ))}
        </div>

        {/* Coming Soon Message */}
        <motion.div
          className="text-center yieldx-card-glass p-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <ChartBarIcon className="w-16 h-16 text-rgb(var(--yieldx-electric-blue)) mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-white mb-4">Advanced Analytics Coming Soon</h3>
          <p className="text-rgb(var(--yieldx-text-secondary)) max-w-2xl mx-auto">
            We're building comprehensive analytics dashboards with detailed charts, 
            historical data, and advanced metrics to help you make informed decisions.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default AnalyticsSection;
