'use client';

import type React from 'react';
import { useEffect, useRef } from 'react';

interface InteractiveGlowProps {
  variant?: 'profit' | 'loss' | 'neutral';
  intensity?: number;
  className?: string;
}

const InteractiveGlow: React.FC<InteractiveGlowProps> = ({
  variant = 'neutral',
  intensity = 0.5,
  className = '',
}) => {
  const glowRef = useRef<HTMLDivElement>(null);

  const variantColors = {
    profit: {
      primary: '#10B981',
      secondary: '#00EAFF',
      tertiary: '#40E0D0',
    },
    loss: {
      primary: '#EF4444',
      secondary: '#FF6B9D',
      tertiary: '#F97316',
    },
    neutral: {
      primary: '#00EAFF',
      secondary: '#7C3AED',
      tertiary: '#40E0D0',
    },
  };

  const colors = variantColors[variant];

  useEffect(() => {
    const element = glowRef.current;
    if (!element) return;

    let animationId: number;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = (elapsed % 4000) / 4000; // 4 second cycle

      // Create dynamic glow effects
      const opacity1 = 0.1 + Math.sin(progress * Math.PI * 2) * 0.1 * intensity;
      const opacity2 =
        0.05 +
        Math.cos(progress * Math.PI * 2 + Math.PI / 3) * 0.05 * intensity;
      const opacity3 =
        0.08 +
        Math.sin(progress * Math.PI * 2 + Math.PI / 6) * 0.08 * intensity;

      const scale1 = 1 + Math.sin(progress * Math.PI * 2) * 0.2;
      const scale2 = 1 + Math.cos(progress * Math.PI * 2 + Math.PI / 4) * 0.15;
      const scale3 = 1 + Math.sin(progress * Math.PI * 2 + Math.PI / 2) * 0.25;

      element.style.setProperty('--glow-opacity-1', opacity1.toString());
      element.style.setProperty('--glow-opacity-2', opacity2.toString());
      element.style.setProperty('--glow-opacity-3', opacity3.toString());
      element.style.setProperty('--glow-scale-1', scale1.toString());
      element.style.setProperty('--glow-scale-2', scale2.toString());
      element.style.setProperty('--glow-scale-3', scale3.toString());

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [intensity]);

  return (
    <div
      className={`pointer-events-none absolute inset-0 ${className}`}
      ref={glowRef}
      style={
        {
          '--glow-primary': colors.primary,
          '--glow-secondary': colors.secondary,
          '--glow-tertiary': colors.tertiary,
          '--glow-opacity-1': '0.1',
          '--glow-opacity-2': '0.05',
          '--glow-opacity-3': '0.08',
          '--glow-scale-1': '1',
          '--glow-scale-2': '1',
          '--glow-scale-3': '1',
        } as React.CSSProperties
      }
    >
      {/* Primary glow orb */}
      <div
        className="absolute top-1/4 left-1/4 h-32 w-32 rounded-full blur-xl transition-all duration-1000"
        style={{
          background:
            'radial-gradient(circle, var(--glow-primary) 0%, transparent 70%)',
          opacity: 'var(--glow-opacity-1)',
          transform: 'scale(var(--glow-scale-1))',
        }}
      />

      {/* Secondary glow orb */}
      <div
        className="absolute top-2/3 right-1/3 h-24 w-24 rounded-full blur-lg transition-all duration-1000"
        style={{
          background:
            'radial-gradient(circle, var(--glow-secondary) 0%, transparent 70%)',
          opacity: 'var(--glow-opacity-2)',
          transform: 'scale(var(--glow-scale-2))',
        }}
      />

      {/* Tertiary glow orb */}
      <div
        className="absolute bottom-1/4 left-2/3 h-20 w-20 rounded-full blur-md transition-all duration-1000"
        style={{
          background:
            'radial-gradient(circle, var(--glow-tertiary) 0%, transparent 70%)',
          opacity: 'var(--glow-opacity-3)',
          transform: 'scale(var(--glow-scale-3))',
        }}
      />

      {/* Ambient glow overlay */}
      <div
        className="absolute inset-0 rounded-xl transition-all duration-2000"
        style={{
          background: `
            radial-gradient(ellipse at 20% 30%, var(--glow-primary)05 0%, transparent 50%),
            radial-gradient(ellipse at 80% 70%, var(--glow-secondary)03 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, var(--glow-tertiary)02 0%, transparent 50%)
          `,
          opacity: intensity,
        }}
      />
    </div>
  );
};

export default InteractiveGlow;
