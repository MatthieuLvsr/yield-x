"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface YieldCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'glass' | 'stats' | 'primary' | 'secondary';
  hover?: boolean;
  onClick?: () => void;
}

const YieldCard: React.FC<YieldCardProps> = ({
  children,
  className = '',
  variant = 'glass',
  hover = true,
  onClick,
}) => {
  const baseClasses = 'transition-all duration-300';
  
  const variantClasses = {
    glass: 'yieldx-card-glass',
    stats: 'yieldx-card-neon',
    primary: 'yieldx-card-holographic',
    secondary: 'yieldx-card-neon',
  };

  const hoverClasses = hover ? 'hover:scale-105 cursor-pointer' : '';

  const Component = onClick ? motion.div : motion.div;

  return (
    <Component
      className={`${baseClasses} ${variantClasses[variant]} ${hoverClasses} ${className}`}
      onClick={onClick}
      whileHover={hover ? { y: -2 } : undefined}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      {children}
    </Component>
  );
};

export default YieldCard;
