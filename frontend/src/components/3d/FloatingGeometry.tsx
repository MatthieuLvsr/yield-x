"use client";

import React, { useEffect, useState } from 'react';

export function FloatingGeometry() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Animated floating shapes using CSS */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-indigo-500/20 to-purple-600/20 rounded-full animate-float-slow blur-xl" />
      <div className="absolute top-60 right-40 w-24 h-24 bg-gradient-to-br from-pink-500/20 to-red-500/20 rounded-lg rotate-45 animate-float-medium blur-lg" />
      <div className="absolute bottom-40 left-1/3 w-20 h-20 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full animate-float-fast blur-lg" />
      <div className="absolute top-1/3 right-20 w-28 h-28 bg-gradient-to-br from-violet-500/20 to-purple-500/20 rounded-xl rotate-12 animate-float-slow blur-xl" />
      <div className="absolute bottom-20 right-1/4 w-16 h-16 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-full animate-float-medium blur-lg" />
      
      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />
    </div>
  );
}
