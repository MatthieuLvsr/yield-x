'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface CyberLogoProps {
  variant?: 'full' | 'icon' | 'text';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'hero';
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
    '2xl': { width: 96, height: 96, textSize: 'text-4xl', spacing: 'space-x-5' },
    '3xl': { width: 128, height: 128, textSize: 'text-5xl', spacing: 'space-x-6' },
    hero: { width: 160, height: 160, textSize: 'text-6xl', spacing: 'space-x-8' },
  };

  const { width, height, textSize, spacing } = sizeConfig[size];

  const logoIcon = (
    <div className="relative group">
      <div className="relative">
        <Image
          src="/yield-x-logo.png"
          alt="Yield-X"
          width={width}
          height={height}
          className={`
            transition-all duration-500 
            ${animated ? 'group-hover:scale-110 group-hover:rotate-3' : ''}
            ${glowEffect ? 'drop-shadow-2xl' : ''}
          `}
        />
        
        {/* Cyber glow effect */}
        {glowEffect && (
          <>
            <div className="absolute inset-0 bg-electric-blue/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse" />
            <div className="absolute inset-0 bg-neon-green/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={{ animationDelay: '0.2s' }} />
          </>
        )}
      </div>

      {/* Scanning lines */}
      {animated && glowEffect && (
        <div className="absolute inset-0 overflow-hidden rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-electric-blue to-transparent animate-scan" style={{ top: '30%' }} />
          <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-neon-green to-transparent animate-scan" style={{ top: '70%', animationDelay: '0.5s' }} />
        </div>
      )}

      {/* Corner accents */}
      {size === 'hero' || size === '3xl' || size === '2xl' ? (
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-cyan-400" />
          <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-blue-400" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-teal-400" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-green-400" />
        </div>
      ) : null}
    </div>
  );

  const logoText = (
    <span className={`
      font-bold yieldx-text-gradient ${textSize}
      ${animated ? 'hover:scale-105 transition-transform duration-300' : ''}
      ${glowEffect ? 'hover:drop-shadow-lg' : ''}
    `}>
      Yield-X
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
          <div className={`flex items-center ${spacing} ${animated ? 'hover:scale-105' : ''} transition-transform duration-300`}>
            {logoIcon}
            {logoText}
          </div>
        );
    }
  })();

  const motionProps = animated ? {
    initial: { opacity: 0, scale: 0.8, rotateY: -15 },
    animate: { opacity: 1, scale: 1, rotateY: 0 },
    transition: { 
      duration: 0.8, 
      ease: "easeOut",
      rotateY: { duration: 1.2 }
    },
    whileHover: {
      scale: variant === 'full' ? 1.05 : 1.1,
      transition: { duration: 0.2 }
    }
  } : {};

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
