'use client';

import type React from 'react';
import DynamicParticleSystem from './DynamicParticleSystem';

interface ChartBackgroundProps {
  className?: string;
  intensity?: 'low' | 'medium' | 'high';
  variant?: 'profit' | 'loss' | 'neutral';
}

const ChartBackground: React.FC<ChartBackgroundProps> = ({
  className = '',
  intensity = 'medium',
  variant = 'neutral',
}) => {
  const particleCount = {
    low: 8,
    medium: 15,
    high: 25,
  }[intensity];

  const variantStyles = {
    profit: {
      primary: 'rgba(16, 185, 129, 0.1)',
      secondary: 'rgba(0, 234, 255, 0.05)',
      accent: '#10B981',
    },
    loss: {
      primary: 'rgba(239, 68, 68, 0.1)',
      secondary: 'rgba(249, 115, 22, 0.05)',
      accent: '#EF4444',
    },
    neutral: {
      primary: 'rgba(0, 234, 255, 0.1)',
      secondary: 'rgba(64, 224, 208, 0.05)',
      accent: '#00EAFF',
    },
  }[variant];

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* Advanced Particle System */}
      <DynamicParticleSystem
        className="opacity-60"
        intensity={
          intensity === 'low' ? 0.3 : intensity === 'medium' ? 0.6 : 0.9
        }
        interactive={true}
        variant={variant}
      />

      {/* Base animated gradient */}
      <div
        className="absolute inset-0 animate-pulse opacity-40"
        style={{
          background: `radial-gradient(ellipse at 30% 50%, ${variantStyles.primary}, transparent 70%),
                       radial-gradient(ellipse at 70% 20%, ${variantStyles.secondary}, transparent 60%)`,
        }}
      />

      {/* Enhanced cyberpunk grid overlay */}
      <div className="absolute inset-0 opacity-30">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `
              linear-gradient(${variantStyles.accent}33 1px, transparent 1px),
              linear-gradient(90deg, ${variantStyles.accent}33 1px, transparent 1px),
              radial-gradient(circle at 25% 25%, ${variantStyles.accent}20 2px, transparent 2px),
              radial-gradient(circle at 75% 75%, ${variantStyles.accent}20 2px, transparent 2px)
            `,
            backgroundSize: '30px 30px, 30px 30px, 60px 60px, 60px 60px',
            animation: 'float 12s ease-in-out infinite',
          }}
        />
      </div>

      {/* Scanning lines with better positioning */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute h-px w-full animate-scan opacity-70"
          style={{
            background: `linear-gradient(90deg, transparent, ${variantStyles.accent}90, transparent)`,
            top: '25%',
            animationDuration: '5s',
          }}
        />
        <div
          className="absolute h-px w-full animate-scan opacity-50"
          style={{
            background: `linear-gradient(90deg, transparent, ${variantStyles.accent}70, transparent)`,
            top: '75%',
            animationDelay: '2.5s',
            animationDuration: '7s',
          }}
        />
        {/* Vertical scanning lines */}
        <div
          className="absolute h-full w-px animate-scan opacity-40"
          style={{
            background: `linear-gradient(0deg, transparent, ${variantStyles.accent}60, transparent)`,
            left: '20%',
            animationDelay: '1s',
            animationDuration: '6s',
            transform: 'rotate(90deg)',
            transformOrigin: 'center',
          }}
        />
      </div>

      {/* Enhanced corner data nodes with pulsing */}
      <div className="absolute top-4 left-4 opacity-80">
        <div
          className="h-3 w-3 animate-data-pulse rounded-full"
          style={{
            backgroundColor: variantStyles.accent,
            boxShadow: `0 0 15px ${variantStyles.accent}70, inset 0 0 5px ${variantStyles.accent}90`,
          }}
        />
        <div className="absolute inset-0 animate-ping rounded-full border border-white/20" />
      </div>
      <div className="absolute top-4 right-4 opacity-80">
        <div
          className="h-3 w-3 animate-data-pulse rounded-full"
          style={{
            backgroundColor: variantStyles.accent,
            boxShadow: `0 0 15px ${variantStyles.accent}70, inset 0 0 5px ${variantStyles.accent}90`,
            animationDelay: '1s',
          }}
        />
        <div
          className="absolute inset-0 animate-ping rounded-full border border-white/20"
          style={{ animationDelay: '1s' }}
        />
      </div>
      <div className="absolute bottom-4 left-4 opacity-80">
        <div
          className="h-3 w-3 animate-data-pulse rounded-full"
          style={{
            backgroundColor: variantStyles.accent,
            boxShadow: `0 0 15px ${variantStyles.accent}70, inset 0 0 5px ${variantStyles.accent}90`,
            animationDelay: '2s',
          }}
        />
        <div
          className="absolute inset-0 animate-ping rounded-full border border-white/20"
          style={{ animationDelay: '2s' }}
        />
      </div>
      <div className="absolute right-4 bottom-4 opacity-80">
        <div
          className="h-3 w-3 animate-data-pulse rounded-full"
          style={{
            backgroundColor: variantStyles.accent,
            boxShadow: `0 0 15px ${variantStyles.accent}70, inset 0 0 5px ${variantStyles.accent}90`,
            animationDelay: '3s',
          }}
        />
        <div
          className="absolute inset-0 animate-ping rounded-full border border-white/20"
          style={{ animationDelay: '3s' }}
        />
      </div>

      {/* Enhanced central data flow lines */}
      <div className="absolute inset-0 overflow-hidden opacity-40">
        <svg
          className="h-full w-full"
          preserveAspectRatio="none"
          viewBox="0 0 100 100"
        >
          <defs>
            <linearGradient
              id={`dataFlow-${variant}`}
              x1="0%"
              x2="100%"
              y1="0%"
              y2="0%"
            >
              <stop offset="0%" stopColor="transparent" />
              <stop
                offset="20%"
                stopColor={variantStyles.accent}
                stopOpacity="0.8"
              />
              <stop
                offset="50%"
                stopColor={variantStyles.accent}
                stopOpacity="1"
              />
              <stop
                offset="80%"
                stopColor={variantStyles.accent}
                stopOpacity="0.8"
              />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
            <filter id={`glow-${variant}`}>
              <feGaussianBlur result="coloredBlur" stdDeviation="2" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <path
            className="animate-pulse"
            d="M0,20 Q25,10 50,20 T100,20"
            fill="none"
            filter={`url(#glow-${variant})`}
            stroke={`url(#dataFlow-${variant})`}
            strokeWidth="1"
          />
          <path
            className="animate-pulse"
            d="M0,50 Q30,40 60,50 T100,50"
            fill="none"
            filter={`url(#glow-${variant})`}
            stroke={`url(#dataFlow-${variant})`}
            strokeWidth="0.8"
            style={{ animationDelay: '1s', animationDuration: '3s' }}
          />
          <path
            className="animate-pulse"
            d="M0,80 Q35,90 70,80 T100,80"
            fill="none"
            filter={`url(#glow-${variant})`}
            stroke={`url(#dataFlow-${variant})`}
            strokeWidth="1"
            style={{ animationDelay: '2s' }}
          />
        </svg>
      </div>
    </div>
  );
};

export default ChartBackground;
