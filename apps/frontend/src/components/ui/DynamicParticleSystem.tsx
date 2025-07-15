'use client';

import type React from 'react';
import { useEffect, useRef, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

interface DynamicParticleSystemProps {
  className?: string;
  variant?: 'profit' | 'loss' | 'neutral';
  intensity?: number;
  interactive?: boolean;
}

const DynamicParticleSystem: React.FC<DynamicParticleSystemProps> = ({
  className = '',
  variant = 'neutral',
  intensity = 0.5,
  interactive = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: 0, y: 0 });
  const [isActive, setIsActive] = useState(false);

  const colors = {
    profit: ['#10B981', '#00EAFF', '#40E0D0'],
    loss: ['#EF4444', '#FF6B9D', '#F97316'],
    neutral: ['#00EAFF', '#7C3AED', '#40E0D0'],
  };

  const createParticle = (canvas: HTMLCanvasElement): Particle => {
    const colorPalette = colors[variant];
    return {
      id: Math.random(),
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      life: 0,
      maxLife: 100 + Math.random() * 100,
      color: colorPalette[Math.floor(Math.random() * colorPalette.length)],
      size: 1 + Math.random() * 3,
    };
  };

  const updateParticle = (
    particle: Particle,
    canvas: HTMLCanvasElement,
    mouseX: number,
    mouseY: number
  ) => {
    // Physics
    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.life++;

    // Interactive mouse attraction
    if (interactive && isActive) {
      const dx = mouseX - particle.x;
      const dy = mouseY - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 100) {
        const force = (100 - distance) / 100;
        particle.vx += (dx / distance) * force * 0.1;
        particle.vy += (dy / distance) * force * 0.1;
      }
    }

    // Velocity damping
    particle.vx *= 0.99;
    particle.vy *= 0.99;

    // Boundary wrap
    if (particle.x < 0) particle.x = canvas.width;
    if (particle.x > canvas.width) particle.x = 0;
    if (particle.y < 0) particle.y = canvas.height;
    if (particle.y > canvas.height) particle.y = 0;

    return particle.life < particle.maxLife;
  };

  const drawParticle = (ctx: CanvasRenderingContext2D, particle: Particle) => {
    const alpha = 1 - particle.life / particle.maxLife;
    const size = particle.size * alpha;

    ctx.save();
    ctx.globalAlpha = alpha * 0.8;

    // Main particle
    ctx.fillStyle = particle.color;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, size, 0, Math.PI * 2);
    ctx.fill();

    // Glow effect
    ctx.globalAlpha = alpha * 0.3;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, size * 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  };

  const connectParticles = (
    ctx: CanvasRenderingContext2D,
    particles: Particle[]
  ) => {
    const maxDistance = 120;

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < maxDistance) {
          const alpha = (maxDistance - distance) / maxDistance;

          ctx.save();
          ctx.globalAlpha = alpha * 0.2;
          ctx.strokeStyle = particles[i].color;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
          ctx.restore();
        }
      }
    }
  };

  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and filter alive particles
    particlesRef.current = particlesRef.current.filter((particle) =>
      updateParticle(particle, canvas, mouseRef.current.x, mouseRef.current.y)
    );

    // Add new particles based on intensity
    const targetParticleCount = Math.floor(intensity * 30);
    while (particlesRef.current.length < targetParticleCount) {
      particlesRef.current.push(createParticle(canvas));
    }

    // Draw connections first (behind particles)
    connectParticles(ctx, particlesRef.current);

    // Draw particles
    particlesRef.current.forEach((particle) => {
      drawParticle(ctx, particle);
    });

    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleMouseEnter = () => setIsActive(true);
    const handleMouseLeave = () => setIsActive(false);

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    if (interactive) {
      canvas.addEventListener('mousemove', handleMouseMove);
      canvas.addEventListener('mouseenter', handleMouseEnter);
      canvas.addEventListener('mouseleave', handleMouseLeave);
    }

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);

      if (interactive) {
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('mouseenter', handleMouseEnter);
        canvas.removeEventListener('mouseleave', handleMouseLeave);
      }

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [intensity, variant, interactive]);

  return (
    <canvas
      className={`pointer-events-none absolute inset-0 ${className}`}
      ref={canvasRef}
      style={{ mixBlendMode: 'screen' }}
    />
  );
};

export default DynamicParticleSystem;
