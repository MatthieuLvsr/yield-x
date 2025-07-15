'use client';

import { motion } from 'framer-motion';
import type React from 'react';
import { useState } from 'react';
import WalletButton from '@/components/ui/WalletButton';
import YieldLogo from '@/components/ui/YieldLogo';
import { useSmoothScroll } from '@/hooks/useNavigation';

const ModernHeader: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Activer le smooth scrolling
  useSmoothScroll();

  return (
    <header className="yieldx-card-glass fixed top-0 z-50 w-full border-rgb(var(--yieldx-border-primary)) border-b">
      <div className="container mx-auto flex h-24 items-center justify-between px-6">
        {/* Logo */}
        <motion.div
          animate={{ opacity: 1, x: 0 }}
          initial={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.6 }}
        >
          <YieldLogo size="md" variant="full" />
        </motion.div>

        {/* Navigation Desktop */}
        <nav className="hidden items-center space-x-10 md:flex">
          {[
            { name: 'Protocol', href: '#protocol' },
            { name: 'Strategies', href: '#strategies' },
            { name: 'Portfolio', href: '#portfolio' },
            { name: 'Marketplace', href: '#marketplace' },
            { name: 'Analytics', href: '#analytics' },
          ].map((item, index) => (
            <motion.a
              animate={{ opacity: 1, y: 0 }}
              className="hover:yieldx-text-electric group relative py-2 font-medium text-rgb(var(--yieldx-text-secondary)) transition-all duration-300"
              href={item.href}
              initial={{ opacity: 0, y: -10 }}
              key={item.name}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              {item.name}
              <span className="-bottom-1 yieldx-glow-electric absolute left-0 h-0.5 w-0 bg-rgb(var(--yieldx-electric-blue)) transition-all duration-300 group-hover:w-full" />
            </motion.a>
          ))}
        </nav>

        {/* CTA Button */}
        <motion.div
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center space-x-4"
          initial={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.6 }}
        >
          <WalletButton />

          {/* Mobile menu button */}
          <button
            className="p-2 md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className="flex h-6 w-6 flex-col justify-center space-y-1">
              <div
                className={`h-0.5 w-full bg-rgb(var(--yieldx-text-primary)) transition-all duration-300 ${isMenuOpen ? 'translate-y-1 rotate-45' : ''}`}
              />
              <div
                className={`h-0.5 w-full bg-rgb(var(--yieldx-text-primary)) transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}
              />
              <div
                className={`h-0.5 w-full bg-rgb(var(--yieldx-text-primary)) transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1' : ''}`}
              />
            </div>
          </button>
        </motion.div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <motion.div
          animate={{ opacity: 1, height: 'auto' }}
          className="yieldx-card-glass border-rgb(var(--yieldx-border-primary)) border-t md:hidden"
          exit={{ opacity: 0, height: 0 }}
          initial={{ opacity: 0, height: 0 }}
        >
          <div className="container mx-auto space-y-4 px-6 py-6">
            {[
              { name: 'Protocol', href: '#protocol' },
              { name: 'Strategies', href: '#strategies' },
              { name: 'Portfolio', href: '#portfolio' },
              { name: 'Marketplace', href: '#marketplace' },
              { name: 'Analytics', href: '#analytics' },
            ].map((item) => (
              <a
                className="hover:yieldx-text-electric block py-2 font-medium text-rgb(var(--yieldx-text-secondary)) transition-all duration-300"
                href={item.href}
                key={item.name}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </a>
            ))}
            <button className="yieldx-btn-primary w-full">
              Connect Wallet
            </button>
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default ModernHeader;
