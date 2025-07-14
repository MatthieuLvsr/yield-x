"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import YieldLogo from '@/components/ui/YieldLogo';
import WalletButton from '@/components/ui/WalletButton';

const ModernHeader: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full z-50 yieldx-card-glass border-b border-rgb(var(--yieldx-border-primary))">
      <div className="container mx-auto px-6 h-24 flex items-center justify-between">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <YieldLogo variant="full" size="xl" />
        </motion.div>

        {/* Navigation Desktop */}
        <nav className="hidden md:flex items-center space-x-10">
          {[
            { name: 'Protocol', href: '#protocol' },
            { name: 'Strategies', href: '/strategies' },
            { name: 'Demo', href: '/demo' },
            { name: 'Portfolio', href: '#portfolio' },
            { name: 'Analytics', href: '#analytics' }
          ].map((item, index) => (
            <motion.a
              key={item.name}
              href={item.href}
              className="relative text-rgb(var(--yieldx-text-secondary)) hover:yieldx-text-electric transition-all duration-300 font-medium group py-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              {item.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-rgb(var(--yieldx-electric-blue)) transition-all duration-300 group-hover:w-full yieldx-glow-electric"></span>
            </motion.a>
          ))}
        </nav>

        {/* CTA Button */}
        <motion.div
          className="flex items-center space-x-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <WalletButton />
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className="w-6 h-6 flex flex-col justify-center space-y-1">
              <div className={`w-full h-0.5 bg-rgb(var(--yieldx-text-primary)) transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1' : ''}`}></div>
              <div className={`w-full h-0.5 bg-rgb(var(--yieldx-text-primary)) transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></div>
              <div className={`w-full h-0.5 bg-rgb(var(--yieldx-text-primary)) transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1' : ''}`}></div>
            </div>
          </button>
        </motion.div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <motion.div 
          className="md:hidden yieldx-card-glass border-t border-rgb(var(--yieldx-border-primary))"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <div className="container mx-auto px-6 py-6 space-y-4">
            {[
              { name: 'Protocol', href: '#protocol' },
              { name: 'Strategies', href: '/strategies' },
              { name: 'Demo', href: '/demo' },
              { name: 'Portfolio', href: '#portfolio' },
              { name: 'Analytics', href: '#analytics' }
            ].map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="block text-rgb(var(--yieldx-text-secondary)) hover:yieldx-text-electric transition-all duration-300 font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </a>
            ))}
            <button className="w-full yieldx-btn-primary">
              Connect Wallet
            </button>
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default ModernHeader;
