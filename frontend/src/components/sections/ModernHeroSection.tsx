"use client";

import React from 'react';
import { motion } from 'framer-motion';
import YieldLogo from '@/components/ui/YieldLogo';
import CyberLogo from '@/components/ui/CyberLogo';
import YieldButton from '@/components/ui/YieldButton';

const ModernHeroSection: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-20">
      {/* Background Elements cyberpunk */}
      <div className="absolute inset-0">
        {/* Orbes cyberpunk avec nouvelle palette */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 yieldx-glow-electric rounded-full blur-3xl opacity-20"></div>
        <div className="absolute top-3/4 right-1/4 w-80 h-80 yieldx-glow-purple rounded-full blur-3xl opacity-15"></div>
        <div className="absolute bottom-1/4 left-1/2 w-64 h-64 yieldx-glow-neon rounded-full blur-3xl opacity-10"></div>
        
        {/* Orbes additionnels Yield-X */}
        <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-rgb(var(--yieldx-holographic))/10 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-1/3 left-1/3 w-32 h-32 bg-rgb(var(--yieldx-quantum-gold))/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="container mx-auto px-6 z-10 text-center">

        {/* Badge cyberpunk avec plus d'espacement */}
        <motion.div
          className="inline-flex items-center px-8 py-4 rounded-full yieldx-card-glass border border-rgb(var(--yieldx-border-accent)) mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="w-2 h-2 bg-rgb(var(--yieldx-cyber-green)) rounded-full mr-4 animate-pulse yieldx-glow-neon"></div>
          <span className="text-rgb(var(--yieldx-text-secondary)) font-medium">The Next-Gen Solana DeFi Protocol</span>
        </motion.div>

        {/* Main Heading avec espacement amélioré */}
        <motion.h1
          className="text-6xl md:text-8xl font-bold mb-12 leading-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span className="yieldx-text-gradient">Yield-X</span>
          <br />
          <span className="text-rgb(var(--yieldx-text-primary)) text-4xl md:text-6xl font-light">Protocol</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-xl md:text-2xl text-rgb(var(--yieldx-text-secondary)) mb-12 max-w-3xl mx-auto leading-relaxed font-light"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Maximize your crypto potential with advanced yield strategies on Solana. 
          Experience seamless, secure, and transparent DeFi yield optimization.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <YieldButton variant="primary" size="lg">
            Launch App
          </YieldButton>
          <YieldButton variant="secondary" size="lg">
            Read Docs
          </YieldButton>
        </motion.div>

        {/* Stats Grid cyberpunk */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          {[
            { label: 'Total Value Locked', value: '$24.7M', color: 'yieldx-text-neon' },
            { label: 'Average APY', value: '18.2%', color: 'yieldx-text-electric' },
            { label: 'Active Users', value: '5.2K', color: 'yieldx-text-gradient' }
          ].map((stat, index) => (
            <div key={stat.label} className="yieldx-card-neon p-6 hover:scale-105 transition-all duration-300">
              <div className={`text-3xl font-bold ${stat.color} mb-2`}>
                {stat.value}
              </div>
              <div className="text-rgb(var(--yieldx-text-tertiary)) text-sm uppercase tracking-wider font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ModernHeroSection;
