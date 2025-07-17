'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import type React from 'react';

interface CyberLogoProps {
  variant?: 'full' | 'icon' | 'text';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'hero' | 'full';
  animated?: boolean;
  glowEffect?: boolean;
  className?: string;
}

const CyberLogo: React.FC<CyberLogoProps> = ({
  variant = 'full',
  size = 'md',
  animated = true,
  glowEffect = true,
  className = '',
}) => {
  const sizeConfig = {
    xs: { width: 24, height: 24, textSize: 'text-base', spacing: 'space-x-2' },
    sm: { width: 32, height: 32, textSize: 'text-lg', spacing: 'space-x-2' },
    md: { width: 44, height: 44, textSize: 'text-xl', spacing: 'space-x-3' },
    lg: { width: 56, height: 56, textSize: 'text-2xl', spacing: 'space-x-4' },
    xl: { width: 72, height: 72, textSize: 'text-3xl', spacing: 'space-x-4' },
    '2xl': {
      width: 96,
      height: 96,
      textSize: 'text-4xl',
      spacing: 'space-x-5',
    },
    '3xl': {
      width: 128,
      height: 128,
      textSize: 'text-5xl',
      spacing: 'space-x-6',
    },
    hero: {
      width: 160,
      height: 160,
      textSize: 'text-6xl',
      spacing: 'space-x-8',
    },
    full: {
      width: 300,
      height: 300,
      textSize: 'text-7xl',
      spacing: 'space-x-2',
    },
  };

  const { width, height, textSize, spacing } = sizeConfig[size];

  const logoIcon = (
    <div className="group relative">
      <div className="relative">
        <Image
          alt="YIELD-X"
          className={`transition-all duration-500 ${animated ? 'group-hover:rotate-3 group-hover:scale-110' : ''} ${glowEffect ? 'drop-shadow-2xl' : ''} `}
          height={height}
          src="/yield-x-logo.png"
          width={width}
        />

        {/* Cyber glow effect */}
        {glowEffect && (
          <>
            <div className="absolute inset-0 animate-pulse rounded-full bg-electric-blue/20 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />
            <div
              className="absolute inset-0 rounded-full bg-neon-green/10 opacity-0 blur-2xl transition-opacity duration-700 group-hover:opacity-100"
              style={{ animationDelay: '0.2s' }}
            />
          </>
        )}
      </div>

      {/* Scanning lines */}
      {animated && glowEffect && (
        <div className="absolute inset-0 overflow-hidden rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <div
            className="absolute h-px w-full animate-scan bg-gradient-to-r from-transparent via-electric-blue to-transparent"
            style={{ top: '30%' }}
          />
          <div
            className="absolute h-px w-full animate-scan bg-gradient-to-r from-transparent via-neon-green to-transparent"
            style={{ top: '70%', animationDelay: '0.5s' }}
          />
        </div>
      )}

      {/* Corner accents */}
      {size === 'hero' ||
      size === '3xl' ||
      size === '2xl' ||
      size === 'full' ? (
        <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <div className="absolute top-[-18px] left-[-18px] h-5 w-5 border-cyan-400 border-t-2 border-l-2" />
          <div className="absolute top-[-18px] right-[-18px] h-5 w-5 border-blue-400 border-t-2 border-r-2" />
          <div className="absolute bottom-[-18px] left-[-18px] h-5 w-5 border-teal-400 border-b-2 border-l-2" />
          <div className="absolute right-[-18px] bottom-[-18px] h-5 w-5 border-green-400 border-r-2 border-b-2" />
        </div>
      ) : null}
    </div>
  );

  const logoText = (
    <span
      className={`yieldx-text-gradient font-bold ${textSize} ${animated ? 'transition-transform duration-300 hover:scale-105' : ''} ${glowEffect ? 'hover:drop-shadow-lg' : ''} `}
    >
      YIELD-X
    </span>
  );

  const logoComponent = (() => {
    switch (variant) {
      case 'icon':
        return logoIcon;

      case 'text':
        return logoText;

      case 'full':
      default:
        return (
          <div
            className={`flex items-center ${spacing} ${animated ? 'hover:scale-105' : ''} transition-transform duration-300`}
          >
            {logoIcon}
            {logoText}
          </div>
        );
    }
  })();

  const motionProps = animated
    ? {
        initial: { opacity: 0, scale: 0.8, rotateY: -15 },
        animate: { opacity: 1, scale: 1, rotateY: 0 },
        transition: {
          duration: 0.8,
          ease: 'easeOut',
          rotateY: { duration: 1.2 },
        },
        whileHover: {
          scale: variant === 'full' ? 1.05 : 1.1,
          transition: { duration: 0.2 },
        },
      }
    : {};

  return (
    <motion.div
      className={`yieldx-logo-container ${className}`}
      {...motionProps}
    >
      {logoComponent}
    </motion.div>
  );
};

export default CyberLogo;
