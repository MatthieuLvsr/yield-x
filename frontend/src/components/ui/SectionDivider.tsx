"use client";

import React from 'react';
import { motion } from 'framer-motion';

interface SectionDividerProps {
  variant?: 'wave' | 'lightning' | 'dots' | 'lines';
  color?: 'blue' | 'purple' | 'green' | 'gradient';
}

const SectionDivider: React.FC<SectionDividerProps> = ({
  variant = 'wave',
  color = 'gradient'
}) => {
  const getColorClass = () => {
    switch (color) {
      case 'blue': return 'text-blue-500';
      case 'purple': return 'text-purple-500';
      case 'green': return 'text-green-500';
      case 'gradient': return 'text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-green-500 bg-clip-text';
      default: return 'text-blue-500';
    }
  };

  const renderWave = () => (
    <div className="w-full h-24 relative overflow-hidden">
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
      >
        <motion.path
          d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
          fill="rgba(59, 130, 246, 0.1)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
        <motion.path
          d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
          fill="rgba(139, 92, 246, 0.08)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2.5, delay: 0.3, ease: "easeInOut" }}
        />
      </svg>
    </div>
  );

  const renderLightning = () => (
    <div className="w-full h-16 flex justify-center items-center">
      <svg width="300" height="60" viewBox="0 0 300 60">
        <motion.path
          d="M0 30 L50 30 L70 10 L90 30 L120 30 L140 50 L160 30 L200 30 L220 15 L240 30 L300 30"
          stroke="url(#lightningGradient)"
          strokeWidth="2"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
        />
        <defs>
          <linearGradient id="lightningGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(59, 130, 246, 0.8)" />
            <stop offset="50%" stopColor="rgba(139, 92, 246, 0.8)" />
            <stop offset="100%" stopColor="rgba(16, 185, 129, 0.8)" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );

  const renderDots = () => (
    <div className="w-full h-16 flex justify-center items-center space-x-4">
      {Array.from({ length: 15 }, (_, i) => (
        <motion.div
          key={i}
          className={`w-2 h-2 rounded-full ${getColorClass()}`}
          style={{
            backgroundColor: color === 'gradient' ? '#3b82f6' : undefined
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: [0, 1.2, 1],
            opacity: [0, 1, 0.7],
          }}
          transition={{
            duration: 2,
            delay: i * 0.1,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      ))}
    </div>
  );

  const renderLines = () => (
    <div className="w-full h-16 relative overflow-hidden">
      <div className="absolute inset-0 flex items-center">
        {/* Ligne principale */}
        <motion.div
          className="w-full h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 2 }}
        />
        
        {/* Lignes secondaires */}
        <motion.div
          className="absolute left-1/4 w-1/2 h-0.5 bg-gradient-to-r from-purple-500 to-green-500 opacity-60"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.5, delay: 0.5 }}
        />
        
        {/* Points de connexion */}
        {[25, 50, 75].map((position, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 bg-blue-500 rounded-full opacity-80"
            style={{ left: `${position}%`, top: '50%', transform: 'translateY(-50%)' }}
            initial={{ scale: 0, rotate: 0 }}
            animate={{ 
              scale: [0, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 1,
              delay: 0.8 + i * 0.2,
              repeat: Infinity,
              repeatType: "reverse",
              repeatDelay: 2
            }}
          />
        ))}
      </div>
    </div>
  );

  const renderVariant = () => {
    switch (variant) {
      case 'wave': return renderWave();
      case 'lightning': return renderLightning();
      case 'dots': return renderDots();
      case 'lines': return renderLines();
      default: return renderWave();
    }
  };

  return (
    <div className="relative py-8 overflow-hidden">
      {/* Effet de fond */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
      
      {/* Particules flottantes */}
      {Array.from({ length: 6 }, (_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-40"
          style={{
            left: `${15 + i * 15}%`,
            top: `${20 + (i % 2) * 60}%`,
          }}
          animate={{
            y: [-10, 10, -10],
            opacity: [0.4, 0.8, 0.4],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 3 + i * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.3
          }}
        />
      ))}
      
      {/* Contenu principal */}
      <div className="relative z-10">
        {renderVariant()}
      </div>
    </div>
  );
};

export default SectionDivider;
