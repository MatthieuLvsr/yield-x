'use client';

import { motion } from 'framer-motion';
import type React from 'react';

interface AnimatedSectionBackgroundProps {
  children: React.ReactNode;
  variant?: 'default' | 'hero' | 'portfolio' | 'strategies' | 'marketplace';
  className?: string;
}

const AnimatedSectionBackground: React.FC<AnimatedSectionBackgroundProps> = ({
  children,
  variant = 'default',
  className = '',
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'hero':
        return {
          orbs: [
            {
              size: 'w-96 h-96',
              color: 'rgba(59, 130, 246, 0.15)',
              position: 'top-1/4 left-1/4',
              blur: 'blur-3xl',
            },
            {
              size: 'w-80 h-80',
              color: 'rgba(139, 92, 246, 0.12)',
              position: 'bottom-1/4 right-1/4',
              blur: 'blur-3xl',
            },
            {
              size: 'w-64 h-64',
              color: 'rgba(16, 185, 129, 0.1)',
              position: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
              blur: 'blur-2xl',
            },
          ],
          animations: {
            duration: 20,
            scale: [1, 1.2, 0.8, 1],
            rotate: [0, 180, 360],
          },
        };
      case 'portfolio':
        return {
          orbs: [
            {
              size: 'w-80 h-80',
              color: 'rgba(16, 185, 129, 0.12)',
              position: 'top-1/4 right-1/3',
              blur: 'blur-3xl',
            },
            {
              size: 'w-72 h-72',
              color: 'rgba(59, 130, 246, 0.1)',
              position: 'bottom-1/3 left-1/4',
              blur: 'blur-3xl',
            },
          ],
          animations: {
            duration: 25,
            scale: [0.8, 1.1, 0.9, 1],
            rotate: [0, -90, -180, -270, -360],
          },
        };
      case 'strategies':
        return {
          orbs: [
            {
              size: 'w-88 h-88',
              color: 'rgba(139, 92, 246, 0.13)',
              position: 'top-1/3 left-1/5',
              blur: 'blur-3xl',
            },
            {
              size: 'w-76 h-76',
              color: 'rgba(6, 182, 212, 0.11)',
              position: 'bottom-1/4 right-1/5',
              blur: 'blur-3xl',
            },
          ],
          animations: {
            duration: 22,
            scale: [1, 0.9, 1.1, 1],
            rotate: [0, 120, 240, 360],
          },
        };
      case 'marketplace':
        return {
          orbs: [
            {
              size: 'w-84 h-84',
              color: 'rgba(245, 158, 11, 0.1)',
              position: 'top-1/4 left-1/2 -translate-x-1/2',
              blur: 'blur-3xl',
            },
            {
              size: 'w-68 h-68',
              color: 'rgba(239, 68, 68, 0.08)',
              position: 'bottom-1/3 right-1/4',
              blur: 'blur-2xl',
            },
          ],
          animations: {
            duration: 18,
            scale: [1, 1.15, 0.85, 1],
            rotate: [0, -45, -90, -135, -180],
          },
        };
      default:
        return {
          orbs: [
            {
              size: 'w-72 h-72',
              color: 'rgba(59, 130, 246, 0.08)',
              position: 'top-1/3 left-1/3',
              blur: 'blur-3xl',
            },
            {
              size: 'w-60 h-60',
              color: 'rgba(139, 92, 246, 0.06)',
              position: 'bottom-1/3 right-1/3',
              blur: 'blur-2xl',
            },
          ],
          animations: {
            duration: 30,
            scale: [1, 1.05, 0.95, 1],
            rotate: [0, 60, 120, 180, 240, 300, 360],
          },
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <section className={`relative ${className}`}>
      {/* Orbes animées spécifiques à la section */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {styles.orbs.map((orb, index) => (
          <motion.div
            animate={{
              scale: styles.animations.scale,
              rotate: styles.animations.rotate,
              x: [0, 20, -20, 0],
              y: [0, -15, 15, 0],
            }}
            className={`absolute ${orb.size} ${orb.position} ${orb.blur} rounded-full`}
            key={index}
            style={{
              background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
            }}
            transition={{
              duration: styles.animations.duration + index * 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
              delay: index * 3,
            }}
          />
        ))}

        {/* Particules flottantes */}
        {Array.from({ length: 6 }, (_, i) => (
          <motion.div
            animate={{
              y: [-20, 20, -20],
              opacity: [0.3, 0.7, 0.3],
              scale: [1, 1.5, 1],
            }}
            className="absolute h-1 w-1 rounded-full bg-blue-400 opacity-30"
            key={`particle-${i}`}
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + (i % 2) * 40}%`,
            }}
            transition={{
              duration: 4 + i,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
              delay: i * 0.5,
            }}
          />
        ))}

        {/* Lignes de connexion animées */}
        {variant === 'hero' && (
          <svg className="absolute inset-0 h-full w-full opacity-20">
            <motion.path
              animate={{ pathLength: 1 }}
              d="M 50 100 Q 150 50 250 100 T 450 100"
              fill="none"
              initial={{ pathLength: 0 }}
              stroke="rgba(59, 130, 246, 0.3)"
              strokeWidth="1"
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                repeatType: 'reverse',
                ease: 'easeInOut',
              }}
            />
          </svg>
        )}
      </div>

      {/* Contenu de la section */}
      <div className="relative z-10">{children}</div>
    </section>
  );
};

export default AnimatedSectionBackground;
