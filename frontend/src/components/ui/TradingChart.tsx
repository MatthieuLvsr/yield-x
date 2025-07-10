"use client";

import { motion } from "framer-motion";
import React from "react";

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
    if (data.length < 2) return "";

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

    return `M ${points.join(" L ")}`;
  };

  return (
    <div className="glass-card p-6 rounded-3xl border border-white/10 backdrop-blur-xl">
      <div className="flex items-center justify-between mb-6">
        <h4 className="text-xl font-bold text-white">{symbol} Chart</h4>
        <div className="text-right">
          <div className="text-white font-bold text-lg">
            {formatPrice(currentPrice)}
          </div>
          <div
            className={`text-sm font-medium ${
              isPositive ? "text-green-400" : "text-red-400"
            }`}
          >
            {isPositive ? "+" : ""}
            {priceChange.toFixed(2)}%
          </div>
        </div>
      </div>

      <div className="relative">
        <svg
          width="100%"
          height="140"
          viewBox="0 0 300 140"
          className="overflow-visible"
        >
          {/* Grid lines */}
          <defs>
            <pattern
              id="grid"
              width="30"
              height="14"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 30 0 L 0 0 0 14"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Price line */}
          <motion.path
            d={generateChartPath()}
            fill="none"
            stroke={isPositive ? "#10b981" : "#ef4444"}
            strokeWidth="2"
            className="drop-shadow-lg"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />

          {/* Gradient fill */}
          <defs>
            <linearGradient
              id="priceGradient"
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop
                offset="0%"
                stopColor={isPositive ? "#10b981" : "#ef4444"}
                stopOpacity="0.3"
              />
              <stop
                offset="100%"
                stopColor={isPositive ? "#10b981" : "#ef4444"}
                stopOpacity="0"
              />
            </linearGradient>
          </defs>

          <motion.path
            d={`${generateChartPath()} L 280,120 L 20,120 Z`}
            fill="url(#priceGradient)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
          />
        </svg>

        {/* Time labels */}
        <div className="flex justify-between mt-4 text-xs text-white/60">
          <span>24h ago</span>
          <span>12h ago</span>
          <span>6h ago</span>
          <span>Now</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t border-white/10">
        <div>
          <div className="text-white/60 text-sm">24h Volume</div>
          <div className="text-white font-medium">
            ${(data.reduce((sum, d) => sum + d.volume, 0) / 1000).toFixed(1)}K
          </div>
        </div>
        <div>
          <div className="text-white/60 text-sm">24h Range</div>
          <div className="text-white font-medium">
            {formatPrice(Math.min(...data.map((d) => d.price)))} -{" "}
            {formatPrice(Math.max(...data.map((d) => d.price)))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradingChart;
