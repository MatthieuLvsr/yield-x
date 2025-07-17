'use client';

import { motion } from 'framer-motion';
import type React from 'react';
import AnimatedParticles from '@/components/ui/AnimatedParticles';
import CyberLogo from '@/components/ui/CyberLogo';
import YieldButton from '@/components/ui/YieldButton';
import YieldLogo from '@/components/ui/YieldLogo';

const ModernHeroSection: React.FC = () => {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Background Elements cyberpunk - reproduit l'atmosphère de l'image */}
      <div className="absolute inset-0">
        {/* Particules animées */}
        <AnimatedParticles />

        {/* Orbes de fond subtils */}
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-cyan-500/3 blur-3xl" />
        <div className="absolute top-3/4 right-1/4 h-80 w-80 rounded-full bg-blue-500/3 blur-3xl" />
        <div className="absolute bottom-1/4 left-1/2 h-64 w-64 rounded-full bg-cyan-400/3 blur-3xl" />

        {/* Effet de grille subtil pour donner de la profondeur */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/2 to-transparent opacity-30" />
      </div>

      <div className="container z-10 mx-auto flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
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
          animate={{ opacity: 1, y: 0 }}
          className="mb-20"
          initial={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <CyberLogo size="full" variant="icon" />
          <h1 className="mb-4 font-bold text-7xl leading-none tracking-tight md:text-8xl lg:text-[8rem]">
            <span className="yieldx-text-gradient bg-gradient-to-r from-cyan-400 via-blue-500 to-blue-600 bg-clip-text text-transparent">
              YIELD-X
            </span>
          </h1>
          <h2 className="font-bold text-3xl text-rgb(var(--yieldx-text-primary)) leading-none tracking-wide md:text-4xl lg:text-5xl">
            EARN. BORROW. GROW.
          </h2>
        </motion.div>

        {/* Subtitle - plus subtil et moins proéminent */}
        <motion.p
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto mb-16 max-w-2xl font-light text-lg text-rgb(var(--yieldx-text-secondary)) leading-relaxed opacity-80 md:text-xl"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Maximize your crypto potential with advanced yield strategies on
          Solana
        </motion.p>

        {/* CTA Buttons - plus espacés et moins proéminents */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="mb-20 flex flex-col justify-center gap-6 sm:flex-row"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <YieldButton size="lg" variant="primary">
            Launch App
          </YieldButton>
          <YieldButton size="lg" variant="secondary">
            Read Docs
          </YieldButton>
        </motion.div>

        {/* Stats Grid cyberpunk - plus subtil */}
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto grid max-w-3xl grid-cols-1 gap-6 opacity-70 md:grid-cols-3"
          initial={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          {[
            {
              label: 'Total Value Locked',
              value: '$24.7M',
              color: 'text-cyan-400',
            },
            { label: 'Average APY', value: '18.2%', color: 'text-blue-400' },
            { label: 'Active Users', value: '5.2K', color: 'text-cyan-300' },
          ].map((stat, index) => (
            <div
              className="rounded-lg border border-gray-700/30 bg-gray-800/20 p-4 transition-all duration-300 hover:scale-105"
              key={stat.label}
            >
              <div className={`font-bold text-2xl ${stat.color} mb-1`}>
                {stat.value}
              </div>
              <div className="font-medium text-rgb(var(--yieldx-text-tertiary)) text-xs uppercase tracking-wider">
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
