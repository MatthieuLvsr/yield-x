"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';

interface CustomStrategySliderProps {
  strategies: string[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  className?: string;
}

export const CustomStrategySlider: React.FC<CustomStrategySliderProps> = ({
  strategies,
  value,
  onChange,
  label,
  className = ""
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Inclure "All" en première position
  const allStrategies = ['All', ...strategies.filter(s => s !== 'All')];
  const currentIndex = allStrategies.indexOf(localValue);
  const validIndex = currentIndex === -1 ? 0 : currentIndex;

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const updateValue = useCallback((e: MouseEvent | React.MouseEvent) => {
    if (!sliderRef.current) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const percentage = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const newIndex = Math.round(percentage * (allStrategies.length - 1));
    const newValue = allStrategies[newIndex];
    
    setLocalValue(newValue);
    onChange(newValue);
  }, [allStrategies, onChange]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      updateValue(e);
    }
  }, [isDragging, updateValue]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    updateValue(e);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const percentage = allStrategies.length > 1 ? (validIndex / (allStrategies.length - 1)) * 100 : 0;

  const getStrategyDisplayName = (strategy: string) => {
    if (strategy === 'All') return 'Toutes les stratégies';
    return strategy;
  };

  return (
    <div className={`space-y-3 ${className}`} style={{ 
      willChange: 'transform',
      transform: 'translateZ(0)',
      backfaceVisibility: 'hidden'
    }}>
      {label && (
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-300">{label}</span>
          <span className="text-sm font-semibold text-blue-400">
            {getStrategyDisplayName(localValue)}
          </span>
        </div>
      )}
      
      <div className="relative" style={{ 
        willChange: 'transform',
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden'
      }}>
        {/* Slider track */}
        <div
          ref={sliderRef}
          className="relative h-2 bg-gray-800/50 rounded-full border border-gray-700/50 cursor-pointer"
          onMouseDown={handleMouseDown}
        >
          {/* Inactive track */}
          <div className="absolute h-full w-full bg-gray-700/30 rounded-full" />
          
          {/* Active track */}
          <div
            className="absolute h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-150 ease-out"
            style={{ 
              width: `${percentage}%`
            }}
          />
          
          {/* Strategy markers */}
          {allStrategies.map((strategy, index) => {
            const markerPercentage = allStrategies.length > 1 ? (index / (allStrategies.length - 1)) * 100 : 0;
            const isActive = index === validIndex;
            
            return (
              <div
                key={strategy}
                className={`absolute top-1/2 w-3 h-3 -translate-y-1/2 rounded-full border-2 z-10 transition-all duration-150 ${
                  isActive
                    ? 'bg-white border-blue-400 shadow-lg shadow-blue-500/50 scale-110' 
                    : 'bg-gray-600 border-gray-500 hover:border-blue-400 hover:scale-105'
                }`}
                style={{ 
                  left: `${markerPercentage}%`, 
                  transform: 'translate(-50%, -50%)'
                }}
              />
            );
          })}
          
          {/* Main thumb */}
          <div
            className={`absolute top-1/2 w-5 h-5 -translate-y-1/2 rounded-full border-2 cursor-grab active:cursor-grabbing z-20 transition-all duration-150 ${
              isDragging
                ? 'bg-white border-blue-400 shadow-lg shadow-blue-500/50 scale-110' 
                : 'bg-white border-gray-300 hover:border-blue-400 hover:scale-105'
            }`}
            style={{ left: `${percentage}%`, transform: 'translate(-50%, -50%)' }}
            onMouseDown={handleMouseDown}
          >
            {/* Inner dot */}
            <div className="absolute inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
          </div>
        </div>
        
        {/* Strategy labels */}
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>All</span>
          <span>{strategies.length} stratégies</span>
        </div>
      </div>
    </div>
  );
};
