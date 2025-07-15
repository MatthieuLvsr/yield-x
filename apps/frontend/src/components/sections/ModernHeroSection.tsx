"use client";

import React from 'react';
import { motion } from 'framer-motion';
import YieldLogo from '@/components/ui/YieldLogo';
import CyberLogo from '@/components/ui/CyberLogo';
import YieldButton from '@/components/ui/YieldButton';
import AnimatedParticles from '@/components/ui/AnimatedParticles';

const ModernHeroSection: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Elements cyberpunk - reproduit l'atmosphère de l'image */}
      <div className="absolute inset-0">
        {/* Particules animées */}
        <AnimatedParticles />
        
        {/* Orbes de fond subtils */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/3 rounded-full blur-3xl"></div>
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-blue-500/3 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/2 w-64 h-64 bg-cyan-400/3 rounded-full blur-3xl"></div>
        
        {/* Effet de grille subtil pour donner de la profondeur */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/2 to-transparent opacity-30"></div>
      </div>

      <div className="container mx-auto px-6 z-10 text-center flex flex-col items-center justify-center min-h-[80vh]">

        {/* Badge cyberpunk - reproduit exactement l'image */}
        {/* <motion.div
          className="inline-flex items-center px-8 py-3 rounded-full yieldx-card-glass border border-rgb(var(--yieldx-border-accent)) mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-rgb(var(--yieldx-text-secondary)) font-medium text-sm">The Next-Gen Solana DeFi Protocol</span>
        </motion.div> */}

        {/* Main Heading - reproduit exactement l'image avec Yield-X en gros et Protocol en dessous */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <CyberLogo variant="icon" size="full" />
          <h1 className="text-7xl md:text-8xl lg:text-[8rem] font-bold mb-4 leading-none tracking-tight">
            <span className="yieldx-text-gradient bg-gradient-to-r from-cyan-400 via-blue-500 to-blue-600 bg-clip-text text-transparent">
              YIELD-X
            </span>
          </h1>
          <h2 className="font-bold text-3xl md:text-4xl lg:text-5xl text-rgb(var(--yieldx-text-primary)) leading-none tracking-wide">
            EARN. BORROW. GROW.
          </h2>
        </motion.div>

        {/* Subtitle - plus subtil et moins proéminent */}
        <motion.p
          className="text-lg md:text-xl text-rgb(var(--yieldx-text-secondary)) mb-16 max-w-2xl mx-auto leading-relaxed font-light opacity-80"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Maximize your crypto potential with advanced yield strategies on Solana
        </motion.p>

        {/* CTA Buttons - plus espacés et moins proéminents */}
        <motion.div
          className="flex flex-col sm:flex-row gap-6 justify-center mb-20"
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

        {/* Stats Grid cyberpunk - plus subtil */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto opacity-70"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          {[
            { label: 'Total Value Locked', value: '$24.7M', color: 'text-cyan-400' },
            { label: 'Average APY', value: '18.2%', color: 'text-blue-400' },
            { label: 'Active Users', value: '5.2K', color: 'text-cyan-300' }
          ].map((stat, index) => (
            <div key={stat.label} className="p-4 hover:scale-105 transition-all duration-300 bg-gray-800/20 rounded-lg border border-gray-700/30">
              <div className={`text-2xl font-bold ${stat.color} mb-1`}>
                {stat.value}
              </div>
              <div className="text-rgb(var(--yieldx-text-tertiary)) text-xs uppercase tracking-wider font-medium">
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
