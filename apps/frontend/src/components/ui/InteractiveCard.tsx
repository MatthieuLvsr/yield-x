'use client';

import { motion } from 'framer-motion';
import type React from 'react';
import { useRef, useState } from 'react';

interface InteractiveCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  intensity?: 'low' | 'medium' | 'high';
}

const InteractiveCard: React.FC<InteractiveCardProps> = ({
  children,
  className = '',
  glowColor = '#3b82f6',
  intensity = 'medium',
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMousePosition({ x, y });
  };

  const getIntensityValues = () => {
    switch (intensity) {
      case 'low':
        return { glowOpacity: 0.1, scaleHover: 1.02, borderOpacity: 0.2 };
      case 'medium':
        return { glowOpacity: 0.15, scaleHover: 1.03, borderOpacity: 0.3 };
      case 'high':
        return { glowOpacity: 0.2, scaleHover: 1.05, borderOpacity: 0.4 };
      default:
        return { glowOpacity: 0.15, scaleHover: 1.03, borderOpacity: 0.3 };
    }
  };

  const { glowOpacity, scaleHover, borderOpacity } = getIntensityValues();

  return (
    <motion.div
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      ref={cardRef}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      whileHover={{ scale: scaleHover }}
    >
      {/* Effet de lueur au survol */}
      {isHovered && (
        <motion.div
          animate={{ opacity: 1 }}
          className="pointer-events-none absolute inset-0"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          style={{
            background: `radial-gradient(300px circle at ${mousePosition.x}px ${mousePosition.y}px, ${glowColor}${Math.floor(glowOpacity * 255).toString(16)}, transparent 40%)`,
          }}
        />
      )}

      {/* Bordure animée */}
      <motion.div
        animate={{
          rotate: isHovered ? 360 : 0,
        }}
        className="absolute inset-0 rounded-inherit"
        style={{
          background: `linear-gradient(135deg, ${glowColor}${Math.floor(borderOpacity * 255).toString(16)}, transparent, ${glowColor}${Math.floor(borderOpacity * 255).toString(16)})`,
          padding: '1px',
        }}
        transition={{
          duration: 8,
          repeat: isHovered ? Number.POSITIVE_INFINITY : 0,
          ease: 'linear',
        }}
      >
        <div className="h-full w-full rounded-inherit bg-transparent" />
      </motion.div>

      {/* Particules au survol */}
      {isHovered &&
        Array.from({ length: 8 }, (_, i) => (
          <motion.div
            animate={{
              scale: [0, 1, 0],
              x: Math.cos((i / 8) * Math.PI * 2) * 50,
              y: Math.sin((i / 8) * Math.PI * 2) * 50,
              opacity: [1, 0.5, 0],
            }}
            className="absolute h-1 w-1 rounded-full"
            initial={{ scale: 0, x: 0, y: 0 }}
            key={i}
            style={{
              backgroundColor: glowColor,
              left: `${mousePosition.x - 2}px`,
              top: `${mousePosition.y - 2}px`,
            }}
            transition={{
              duration: 1.5,
              delay: i * 0.1,
              ease: 'easeOut',
            }}
          />
        ))}

      {/* Contenu de la carte */}
      <div className="relative z-10">{children}</div>

      {/* Effet de scan */}
      <motion.div
        animate={{
          transform: isHovered ? 'translateX(100%)' : 'translateX(-100%)',
        }}
        className="absolute inset-0 opacity-20"
        style={{
          background: `linear-gradient(90deg, transparent, ${glowColor}22, transparent)`,
          transform: 'translateX(-100%)',
        }}
        transition={{
          duration: 1.5,
          ease: 'easeInOut',
        }}
      />
    </motion.div>
  );
};

export default InteractiveCard;
