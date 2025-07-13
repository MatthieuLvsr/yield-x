"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface TokenIconProps {
  symbol: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showName?: boolean;
  className?: string;
}

const TokenIcon: React.FC<TokenIconProps> = ({
  symbol,
  name,
  size = 'md',
  showName = false,
  className = '',
}) => {
  const sizeConfig = {
    sm: { width: 20, height: 20, textSize: 'text-sm' },
    md: { width: 24, height: 24, textSize: 'text-base' },
    lg: { width: 32, height: 32, textSize: 'text-lg' },
    xl: { width: 40, height: 40, textSize: 'text-xl' },
  };

  const { width, height, textSize } = sizeConfig[size];

  // Couleurs de fallback basées sur le symbole du token
  const getTokenColor = (symbol: string) => {
    const colors = {
      'USDC': 'from-blue-500 to-blue-600',
      'USDT': 'from-green-500 to-green-600',
      'SOL': 'from-purple-500 to-purple-600',
      'ETH': 'from-indigo-500 to-indigo-600',
      'BTC': 'from-orange-500 to-orange-600',
      'YIELD': 'from-indigo-500 to-purple-600',
    };
    return colors[symbol as keyof typeof colors] || 'from-gray-500 to-gray-600';
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* Token Icon */}
      <div className="relative">
        <div 
          className={`w-${width/4} h-${height/4} rounded-full bg-gradient-to-br ${getTokenColor(symbol)} flex items-center justify-center text-white font-bold ${textSize}`}
        >
          {symbol.charAt(0)}
        </div>
        <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 blur-sm"></div>
      </div>

      {/* Token Name */}
      {showName && (
        <div className="flex flex-col">
          <span className="text-white font-medium">{symbol}</span>
          {name && (
            <span className="text-white/60 text-xs">{name}</span>
          )}
        </div>
      )}
    </div>
  );
};

interface TokenBalanceProps {
  symbol: string;
  balance: string;
  usdValue?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const TokenBalance: React.FC<TokenBalanceProps> = ({
  symbol,
  balance,
  usdValue,
  size = 'md',
  className = '',
}) => {
  const sizeConfig = {
    sm: { balanceSize: 'text-sm', usdSize: 'text-xs' },
    md: { balanceSize: 'text-base', usdSize: 'text-sm' },
    lg: { balanceSize: 'text-lg', usdSize: 'text-base' },
  };

  const { balanceSize, usdSize } = sizeConfig[size];

  return (
    <div className={`flex items-center justify-between ${className}`}>
      <TokenIcon symbol={symbol} size={size} showName />
      <div className="text-right">
        <div className={`text-white font-medium ${balanceSize}`}>
          {balance}
        </div>
        {usdValue && (
          <div className={`text-white/60 ${usdSize}`}>
            ${usdValue}
          </div>
        )}
      </div>
    </div>
  );
};

interface TokenSelectorProps {
  selectedToken: string;
  onTokenSelect: (token: string) => void;
  tokens: Array<{
    symbol: string;
    name: string;
    balance?: string;
    usdValue?: string;
  }>;
  className?: string;
}

const TokenSelector: React.FC<TokenSelectorProps> = ({
  selectedToken,
  onTokenSelect,
  tokens,
  className = '',
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const selectedTokenData = tokens.find(t => t.symbol === selectedToken);

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-3 yield-glass-card rounded-xl border border-white/10 hover:border-white/20 transition-all duration-300 flex items-center justify-between"
      >
        <div className="flex items-center space-x-3">
          <TokenIcon symbol={selectedToken} size="md" />
          <div className="text-left">
            <div className="text-white font-medium">{selectedToken}</div>
            <div className="text-white/60 text-sm">{selectedTokenData?.name}</div>
          </div>
        </div>
        <div className="text-white/60">
          {isOpen ? '▲' : '▼'}
        </div>
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full left-0 right-0 mt-2 yield-glass-card rounded-xl border border-white/10 overflow-hidden z-50"
        >
          {tokens.map((token) => (
            <button
              key={token.symbol}
              onClick={() => {
                onTokenSelect(token.symbol);
                setIsOpen(false);
              }}
              className="w-full p-3 hover:bg-white/5 transition-colors duration-200 text-left"
            >
              <TokenBalance
                symbol={token.symbol}
                balance={token.balance || '0'}
                usdValue={token.usdValue}
                size="sm"
              />
            </button>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export { TokenIcon, TokenBalance, TokenSelector };
