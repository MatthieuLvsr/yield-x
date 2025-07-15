'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import type React from 'react';

interface YieldLogoProps {
  variant?: 'full' | 'icon' | 'text';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  animated?: boolean;
  className?: string;
}

const YieldLogo: React.FC<YieldLogoProps> = ({
  variant = 'full',
  size = 'md',
  animated = true,
  className = '',
}) => {
  const sizeConfig = {
    xs: { width: 20, height: 20, textSize: 'text-base', spacing: 'space-x-2' },
    sm: { width: 28, height: 28, textSize: 'text-lg', spacing: 'space-x-2' },
    md: { width: 36, height: 36, textSize: 'text-xl', spacing: 'space-x-3' },
    lg: { width: 48, height: 48, textSize: 'text-2xl', spacing: 'space-x-3' },
    xl: { width: 64, height: 64, textSize: 'text-3xl', spacing: 'space-x-4' },
    '2xl': {
      width: 80,
      height: 80,
      textSize: 'text-4xl',
      spacing: 'space-x-4',
    },
    '3xl': {
      width: 96,
      height: 96,
      textSize: 'text-5xl',
      spacing: 'space-x-5',
    },
  };

  const { width, height, textSize, spacing } = sizeConfig[size];

  const logoComponent = (() => {
    switch (variant) {
      case 'icon':
        return (
          <div className={`relative ${className}`}>
            <Image
              alt="Yield-X"
              className={`${animated ? 'yieldx-will-change' : ''} transition-all duration-300 hover:scale-110`}
              height={height}
              src="/yield-x-logo.png"
              width={width}
            />
            {animated && (
              <div className="yieldx-glow-electric absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 hover:opacity-100" />
            )}
          </div>
        );

      case 'text':
        return (
          <span
            className={`yieldx-text-gradient font-bold ${textSize} ${className}`}
          >
            YIELD-X
          </span>
        );

      case 'full':
      default:
        return (
          <div className={`flex items-center ${spacing} ${className}`}>
            <div className="relative">
              <Image
                alt="Yield-X"
                className={`${animated ? 'yieldx-will-change' : ''} transition-all duration-300 hover:scale-110`}
                height={height}
                src="/yield-x-logo.png"
                width={width}
              />
              {animated && (
                <div className="yieldx-glow-electric absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 hover:opacity-100" />
              )}
            </div>
            <span className={`yieldx-text-gradient font-bold ${textSize}`}>
              YIELD-X
            </span>
          </div>
        );
    }
  })();

  return animated ? (
    <motion.div
      animate={{ opacity: 1, scale: 1 }}
      initial={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.6 }}
    >
      {logoComponent}
    </motion.div>
  ) : (
    <>{logoComponent}</>
  );
};

export default YieldLogo;
