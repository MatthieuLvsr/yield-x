'use client';

import { motion } from 'framer-motion';
import type React from 'react';
import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  opacity: number;
}

const DynamicBackground: React.FC = () => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Générer les particules initiales
    const initialParticles: Particle[] = [];
    for (let i = 0; i < 50; i++) {
      initialParticles.push({
        id: i,
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        color: ['#3b82f6', '#10b981', '#8b5cf6', '#06b6d4'][
          Math.floor(Math.random() * 4)
        ],
        opacity: Math.random() * 0.5 + 0.2,
      });
    }
    setParticles(initialParticles);

    // Animation des particules
    const animateParticles = () => {
      setParticles((prev) =>
        prev.map((particle) => ({
          ...particle,
          x:
            (particle.x + particle.speedX + window.innerWidth) %
            window.innerWidth,
          y:
            (particle.y + particle.speedY + window.innerHeight) %
            window.innerHeight,
        }))
      );
    };

    const interval = setInterval(animateParticles, 50);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      {/* Gradient de fond animé */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <motion.div
          animate={{
            background: [
              'linear-gradient(45deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1), rgba(16, 185, 129, 0.1))',
              'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(16, 185, 129, 0.1), rgba(59, 130, 246, 0.1))',
              'linear-gradient(225deg, rgba(16, 185, 129, 0.1), rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1))',
              'linear-gradient(315deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1), rgba(16, 185, 129, 0.1))',
            ],
          }}
          className="absolute inset-0 bg-gradient-to-r from-blue-900/20 via-purple-900/20 to-green-900/20"
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: 'reverse',
          }}
        />
      </div>

      {/* Orbes flottantes animées */}
      <motion.div
        animate={{
          x: [100, 200, 300, 200, 100],
          y: [100, 150, 200, 250, 100],
          scale: [1, 1.2, 0.8, 1.1, 1],
        }}
        className="absolute h-96 w-96 rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
        transition={{
          duration: 25,
          repeat: Number.POSITIVE_INFINITY,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        animate={{
          x: [-50, -100, -150, -100, -50],
          y: [50, 100, 50, 150, 50],
          scale: [0.8, 1.1, 1, 0.9, 0.8],
        }}
        className="absolute h-80 w-80 rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(139, 92, 246, 0.12) 0%, transparent 70%)',
          filter: 'blur(35px)',
          right: 0,
          top: '20%',
        }}
        transition={{
          duration: 30,
          repeat: Number.POSITIVE_INFINITY,
          ease: 'easeInOut',
        }}
      />

      <motion.div
        animate={{
          x: [0, 50, -50, 50, 0],
          y: [0, -50, -100, -50, 0],
          scale: [1, 0.8, 1.2, 0.9, 1],
        }}
        className="absolute h-64 w-64 rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%)',
          filter: 'blur(30px)',
          bottom: '10%',
          left: '30%',
        }}
        transition={{
          duration: 22,
          repeat: Number.POSITIVE_INFINITY,
          ease: 'easeInOut',
        }}
      />

      {/* Particules flottantes */}
      {particles.map((particle) => (
        <motion.div
          animate={{
            scale: [1, 1.5, 1],
            opacity: [
              particle.opacity,
              particle.opacity * 0.5,
              particle.opacity,
            ],
          }}
          className="absolute rounded-full"
          key={particle.id}
          style={{
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            opacity: particle.opacity,
            filter: 'blur(1px)',
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Effet de souris - Halo suivant le curseur */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
        }}
        className="pointer-events-none absolute h-64 w-64 rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%)',
          filter: 'blur(20px)',
          left: mousePos.x - 128,
          top: mousePos.y - 128,
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          ease: 'easeInOut',
        }}
      />

      {/* Lignes de connexion animées */}
      <svg className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id="lineGradient" x1="0%" x2="100%" y1="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(59, 130, 246, 0.3)" />
            <stop offset="50%" stopColor="rgba(139, 92, 246, 0.2)" />
            <stop offset="100%" stopColor="rgba(16, 185, 129, 0.3)" />
          </linearGradient>
        </defs>

        {/* Lignes diagonales animées */}
        {Array.from({ length: 8 }, (_, i) => (
          <motion.line
            animate={{ pathLength: 1 }}
            initial={{ pathLength: 0 }}
            key={i}
            opacity="0.1"
            stroke="url(#lineGradient)"
            strokeWidth="1"
            transition={{
              duration: 3 + i * 0.5,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: 'reverse',
              ease: 'easeInOut',
            }}
            x1={`${i * 15}%`}
            x2={`${i * 15 + 30}%`}
            y1="0%"
            y2="100%"
          />
        ))}
      </svg>

      {/* Grille cyberpunk subtile */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
        }}
      />

      {/* Pulse périodique */}
      <motion.div
        animate={{
          opacity: [0, 0.3, 0],
          scale: [1, 1.05, 1],
        }}
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at center, rgba(59, 130, 246, 0.05) 0%, transparent 50%)',
        }}
        transition={{
          duration: 6,
          repeat: Number.POSITIVE_INFINITY,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
};

export default DynamicBackground;
