'use client';

import type React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';

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
  className = '',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Inclure "All" en première position
  const allStrategies = ['All', ...strategies.filter((s) => s !== 'All')];
  const currentIndex = allStrategies.indexOf(localValue);
  const validIndex = currentIndex === -1 ? 0 : currentIndex;

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const updateValue = useCallback(
    (e: MouseEvent | React.MouseEvent) => {
      if (!sliderRef.current) return;

      const rect = sliderRef.current.getBoundingClientRect();
      const percentage = Math.max(
        0,
        Math.min(1, (e.clientX - rect.left) / rect.width)
      );
      const newIndex = Math.round(percentage * (allStrategies.length - 1));
      const newValue = allStrategies[newIndex];

      setLocalValue(newValue);
      onChange(newValue);
    },
    [allStrategies, onChange]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging) {
        updateValue(e);
      }
    },
    [isDragging, updateValue]
  );

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

  const percentage =
    allStrategies.length > 1
      ? (validIndex / (allStrategies.length - 1)) * 100
      : 0;

  const getStrategyDisplayName = (strategy: string) => {
    if (strategy === 'All') return 'Toutes les stratégies';
    return strategy;
  };

  return (
    <div
      className={`space-y-3 ${className}`}
      style={{
        willChange: 'transform',
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
      }}
    >
      {label && (
        <div className="flex items-center justify-between">
          <span className="font-medium text-gray-300 text-sm">{label}</span>
          <span className="font-semibold text-blue-400 text-sm">
            {getStrategyDisplayName(localValue)}
          </span>
        </div>
      )}

      <div
        className="relative"
        style={{
          willChange: 'transform',
          transform: 'translateZ(0)',
          backfaceVisibility: 'hidden',
        }}
      >
        {/* Slider track */}
        <div
          className="relative h-2 cursor-pointer rounded-full border border-gray-700/50 bg-gray-800/50"
          onMouseDown={handleMouseDown}
          ref={sliderRef}
        >
          {/* Inactive track */}
          <div className="absolute h-full w-full rounded-full bg-gray-700/30" />

          {/* Active track */}
          <div
            className="absolute h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-150 ease-out"
            style={{
              width: `${percentage}%`,
            }}
          />

          {/* Strategy markers */}
          {allStrategies.map((strategy, index) => {
            const markerPercentage =
              allStrategies.length > 1
                ? (index / (allStrategies.length - 1)) * 100
                : 0;
            const isActive = index === validIndex;

            return (
              <div
                className={`-translate-y-1/2 absolute top-1/2 z-10 h-3 w-3 rounded-full border-2 transition-all duration-150 ${
                  isActive
                    ? 'scale-110 border-blue-400 bg-white shadow-blue-500/50 shadow-lg'
                    : 'border-gray-500 bg-gray-600 hover:scale-105 hover:border-blue-400'
                }`}
                key={strategy}
                style={{
                  left: `${markerPercentage}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              />
            );
          })}

          {/* Main thumb */}
          <div
            className={`-translate-y-1/2 absolute top-1/2 z-20 h-5 w-5 cursor-grab rounded-full border-2 transition-all duration-150 active:cursor-grabbing ${
              isDragging
                ? 'scale-110 border-blue-400 bg-white shadow-blue-500/50 shadow-lg'
                : 'border-gray-300 bg-white hover:scale-105 hover:border-blue-400'
            }`}
            onMouseDown={handleMouseDown}
            style={{
              left: `${percentage}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            {/* Inner dot */}
            <div className="absolute inset-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
          </div>
        </div>

        {/* Strategy labels */}
        <div className="mt-2 flex justify-between text-gray-500 text-xs">
          <span>All</span>
          <span>{strategies.length} stratégies</span>
        </div>
      </div>
    </div>
  );
};
