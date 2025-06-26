"use client";

import React from 'react';
import { motion } from 'framer-motion';

const ModernHeroSection: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden hero-grid">
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl floating-animation"></div>
        <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl floating-animation" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/4 left-1/2 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl floating-animation" style={{ animationDelay: '4s' }}></div>
        
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-30">
          <div className="h-full w-full bg-gradient-to-b from-transparent via-indigo-500/5 to-transparent"></div>
        </div>
      </div>

      <div className="container mx-auto px-6 z-10 text-center">
        {/* Badge */}
        <motion.div
          className="inline-flex items-center px-4 py-2 rounded-full glass-card border border-white/20 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="w-2 h-2 bg-green-400 rounded-full mr-2 pulse-glow"></div>
          <span className="text-sm text-white/80">The Solana Liquidity Protocol</span>
        </motion.div>

        {/* Main Heading */}
        <motion.h1
          className="text-6xl md:text-8xl font-bold mb-8 leading-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span className="gradient-text">Yield-X</span>
          <br />
          <span className="text-white/90 text-4xl md:text-6xl">Protocol</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-xl md:text-2xl text-white/70 mb-12 max-w-3xl mx-auto leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Put your crypto to work to earn more crypto, or borrow against your holdings. 
          Yield-X's smart contracts operate on-chain and are open-source.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <button className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold text-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 glow-effect">
            Launch App
          </button>
          <button className="px-8 py-4 glass-card border border-white/20 text-white rounded-xl font-semibold text-lg hover:bg-white/10 transition-all duration-300">
            Read Docs
          </button>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          {[
            { label: 'Total Value Locked', value: '$24.7M', gradient: 'from-green-400 to-emerald-600' },
            { label: 'Average APY', value: '18.2%', gradient: 'from-blue-400 to-indigo-600' },
            { label: 'Active Users', value: '5.2K', gradient: 'from-purple-400 to-pink-600' }
          ].map((stat, index) => (
            <div key={stat.label} className="glass-card p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300">
              <div className={`text-3xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-2`}>
                {stat.value}
              </div>
              <div className="text-white/60 text-sm uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
        >
          <div className="flex flex-col items-center space-y-2">
            <div className="text-white/40 text-sm">Scroll to explore</div>
            <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-white/40 rounded-full mt-2 animate-bounce"></div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ModernHeroSection;
