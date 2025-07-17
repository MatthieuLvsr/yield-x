'use client';

import { motion } from 'framer-motion';
import type React from 'react';

interface YieldButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  loading?: boolean;
}

const YieldButton: React.FC<YieldButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  className = '',
  loading = false,
}) => {
  const baseClasses =
    'font-semibold rounded-2xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100';

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const variantClasses = {
    primary: 'yieldx-btn-primary',
    secondary: 'yieldx-btn-secondary',
    ghost: 'yieldx-btn-ghost',
    accent: 'yieldx-btn-primary', // Fallback pour accent
  };

  return (
    <motion.button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
          Loading...
        </div>
      ) : (
        children
      )}
    </motion.button>
  );
};

export default YieldButton;
