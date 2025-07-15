'use client';

import type React from 'react';
import { useEffect, useRef, useState } from 'react';

interface ParticleFieldProps {
  density?: number;
  speed?: number;
  color?: string;
  interactive?: boolean;
  className?: string;
}

const ParticleField: React.FC<ParticleFieldProps> = ({
  density = 30,
  speed = 0.5,
  color = '#3b82f6',
  interactive = true,
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const [particles, setParticles] = useState<
    Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
    }>
  >([]);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    const initParticles = () => {
      const newParticles = [];
      for (let i = 0; i < density; i++) {
        newParticles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * speed,
          vy: (Math.random() - 0.5) * speed,
          size: Math.random() * 2 + 1,
          opacity: Math.random() * 0.5 + 0.2,
        });
      }
      setParticles(newParticles);
    };

    const updateParticles = () => {
      setParticles((prev) =>
        prev.map((particle) => {
          const newX = particle.x + particle.vx;
          const newY = particle.y + particle.vy;

          // Rebond sur les bords
          if (newX < 0 || newX > canvas.width) particle.vx *= -1;
          if (newY < 0 || newY > canvas.height) particle.vy *= -1;

          // Interaction avec la souris
          if (interactive) {
            const dx = mousePos.x - newX;
            const dy = mousePos.y - newY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
              const force = (100 - distance) / 100;
              particle.vx -= (dx / distance) * force * 0.1;
              particle.vy -= (dy / distance) * force * 0.1;
            }
          }

          // Friction
          particle.vx *= 0.99;
          particle.vy *= 0.99;

          return {
            ...particle,
            x: Math.max(0, Math.min(canvas.width, newX)),
            y: Math.max(0, Math.min(canvas.height, newY)),
          };
        })
      );
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, index) => {
        // Dessiner les particules
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `${color}${Math.floor(particle.opacity * 255)
          .toString(16)
          .padStart(2, '0')}`;
        ctx.fill();

        // Dessiner les connexions
        particles.slice(index + 1).forEach((otherParticle) => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 100) {
            const opacity = ((100 - distance) / 100) * 0.3;
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            ctx.strokeStyle = `${color}${Math.floor(opacity * 255)
              .toString(16)
              .padStart(2, '0')}`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });
    };

    const animate = () => {
      updateParticles();
      drawParticles();
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    const handleResize = () => {
      resizeCanvas();
      initParticles();
    };

    // Initialisation
    resizeCanvas();
    initParticles();
    animate();

    // Event listeners
    if (interactive) {
      canvas.addEventListener('mousemove', handleMouseMove);
    }
    window.addEventListener('resize', handleResize);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      canvas.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, [density, speed, color, interactive, particles, mousePos]);

  return (
    <canvas
      className={`absolute inset-0 pointer-events-${interactive ? 'auto' : 'none'} ${className}`}
      ref={canvasRef}
      style={{ zIndex: 1 }}
    />
  );
};

export default ParticleField;
