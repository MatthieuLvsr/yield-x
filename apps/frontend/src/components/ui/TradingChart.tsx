'use client';

import { motion } from 'framer-motion';
import type React from 'react';

interface PriceData {
  time: string;
  price: number;
  volume: number;
}

interface TradingChartProps {
  symbol: string;
  data: PriceData[];
  currentPrice: number;
  priceChange: number;
}

const TradingChart: React.FC<TradingChartProps> = ({
  symbol,
  data,
  currentPrice,
  priceChange,
}) => {
  const formatPrice = (price: number) => `$${price.toFixed(3)}`;
  const isPositive = priceChange >= 0;

  // Generate simple line chart points
  const generateChartPath = () => {
    if (data.length < 2) return '';

    const width = 300;
    const height = 120;
    const padding = 20;

    const prices = data.map((d) => d.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice || 1;

    const points = data.map((d, i) => {
      const x = padding + (i / (data.length - 1)) * (width - 2 * padding);
      const y =
        height -
        padding -
        ((d.price - minPrice) / priceRange) * (height - 2 * padding);
      return `${x},${y}`;
    });

    return `M ${points.join(' L ')}`;
  };

  return (
    <div className="glass-card rounded-3xl border border-white/10 p-6 backdrop-blur-xl">
      <div className="mb-6 flex items-center justify-between">
        <h4 className="font-bold text-white text-xl">{symbol} Chart</h4>
        <div className="text-right">
          <div className="font-bold text-lg text-white">
            {formatPrice(currentPrice)}
          </div>
          <div
            className={`font-medium text-sm ${
              isPositive ? 'text-green-400' : 'text-red-400'
            }`}
          >
            {isPositive ? '+' : ''}
            {priceChange.toFixed(2)}%
          </div>
        </div>
      </div>

      <div className="relative">
        <svg
          className="overflow-visible"
          height="140"
          viewBox="0 0 300 140"
          width="100%"
        >
          {/* Grid lines */}
          <defs>
            <pattern
              height="14"
              id="grid"
              patternUnits="userSpaceOnUse"
              width="30"
            >
              <path
                d="M 30 0 L 0 0 0 14"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect fill="url(#grid)" height="100%" width="100%" />

          {/* Price line */}
          <motion.path
            animate={{ pathLength: 1 }}
            className="drop-shadow-lg"
            d={generateChartPath()}
            fill="none"
            initial={{ pathLength: 0 }}
            stroke={isPositive ? '#10b981' : '#ef4444'}
            strokeWidth="2"
            transition={{ duration: 2, ease: 'easeInOut' }}
          />

          {/* Gradient fill */}
          <defs>
            <linearGradient
              id="priceGradient"
              x1="0%"
              x2="0%"
              y1="0%"
              y2="100%"
            >
              <stop
                offset="0%"
                stopColor={isPositive ? '#10b981' : '#ef4444'}
                stopOpacity="0.3"
              />
              <stop
                offset="100%"
                stopColor={isPositive ? '#10b981' : '#ef4444'}
                stopOpacity="0"
              />
            </linearGradient>
          </defs>

          <motion.path
            animate={{ opacity: 1 }}
            d={`${generateChartPath()} L 280,120 L 20,120 Z`}
            fill="url(#priceGradient)"
            initial={{ opacity: 0 }}
            transition={{ delay: 1, duration: 1 }}
          />
        </svg>

        {/* Time labels */}
        <div className="mt-4 flex justify-between text-white/60 text-xs">
          <span>24h ago</span>
          <span>12h ago</span>
          <span>6h ago</span>
          <span>Now</span>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 gap-4 border-white/10 border-t pt-4">
        <div>
          <div className="text-sm text-white/60">24h Volume</div>
          <div className="font-medium text-white">
            ${(data.reduce((sum, d) => sum + d.volume, 0) / 1000).toFixed(1)}K
          </div>
        </div>
        <div>
          <div className="text-sm text-white/60">24h Range</div>
          <div className="font-medium text-white">
            {formatPrice(Math.min(...data.map((d) => d.price)))} -{' '}
            {formatPrice(Math.max(...data.map((d) => d.price)))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingChart;
