"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';

interface OptimizedCustomRangeSliderProps {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  step?: number;
  label?: string;
  formatValue?: (value: number) => string;
  className?: string;
}

export const OptimizedCustomRangeSlider: React.FC<OptimizedCustomRangeSliderProps> = ({
  min,
  max,
  value,
  onChange,
  step = 1,
  label,
  formatValue = (v) => v.toString(),
  className = ""
}) => {
  const [isDragging, setIsDragging] = useState<'min' | 'max' | null>(null);
  const [localValue, setLocalValue] = useState<[number, number]>(value);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // S'assurer que les valeurs sont dans le bon range
    const clampedValue: [number, number] = [
      Math.max(min, Math.min(max, value[0])),
      Math.max(min, Math.min(max, value[1]))
    ];
    
    // Si les valeurs sont en dehors du range, les ajuster
    if (clampedValue[0] < min || clampedValue[1] > max || clampedValue[0] === clampedValue[1]) {
      // Utiliser les valeurs min/max par défaut si les valeurs sont invalides
      const defaultValue: [number, number] = [min, max];
      setLocalValue(defaultValue);
      onChange(defaultValue);
    } else {
      setLocalValue(clampedValue);
    }
  }, [value, min, max, onChange]);

  const calculatePosition = useCallback((clientX: number) => {
    if (!sliderRef.current) return 0;
    
    const rect = sliderRef.current.getBoundingClientRect();
    const percentage = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    return min + percentage * (max - min);
  }, [min, max]);

  const snapToStep = useCallback((val: number) => {
    return Math.round(val / step) * step;
  }, [step]);

  const updateValue = useCallback((e: MouseEvent | React.MouseEvent, thumb: 'min' | 'max') => {
    const rawValue = calculatePosition(e.clientX);
    const snappedValue = snapToStep(Math.max(min, Math.min(max, rawValue)));
    
    let newMin = localValue[0];
    let newMax = localValue[1];
    
    if (thumb === 'min') {
      newMin = Math.min(snappedValue, localValue[1] - step);
    } else {
      newMax = Math.max(snappedValue, localValue[0] + step);
    }
    
    // Assurer que les valeurs restent dans les limites
    newMin = Math.max(min, Math.min(max - step, newMin));
    newMax = Math.min(max, Math.max(min + step, newMax));
    
    const newRange: [number, number] = [newMin, newMax];
    setLocalValue(newRange);
    onChange(newRange);
  }, [calculatePosition, snapToStep, localValue, min, max, step, onChange]);

  const handleMouseDown = (e: React.MouseEvent, thumb: 'min' | 'max') => {
    e.preventDefault();
    setIsDragging(thumb);
    updateValue(e, thumb);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      updateValue(e, isDragging);
    }
  }, [isDragging, updateValue]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(null);
  }, []);

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

  const minPercentage = Math.max(0, Math.min(100, ((localValue[0] - min) / (max - min)) * 100));
  const maxPercentage = Math.max(0, Math.min(100, ((localValue[1] - min) / (max - min)) * 100));

  // Debug : log des valeurs
  console.log('OptimizedCustomRangeSlider Debug:', {
    min,
    max,
    localValue,
    minPercentage,
    maxPercentage
  });

  return (
    <div className={`w-full space-y-3 ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-300">{label}</span>
          <span className="text-sm font-semibold text-blue-400">
            {formatValue(localValue[0])} - {formatValue(localValue[1])}
          </span>
        </div>
      )}
      
      <div className="relative px-3 py-4">
        {/* Slider Track */}
        <div
          ref={sliderRef}
          className="relative h-2 bg-gray-700/50 rounded-full cursor-pointer"
        >
          {/* Active Range */}
          <div
            className="absolute h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
            style={{
              left: `${minPercentage}%`,
              width: `${Math.max(0, maxPercentage - minPercentage)}%`
            }}
          />
          
          {/* Min Thumb */}
          <div
            className={`absolute w-5 h-5 bg-white border-2 rounded-full cursor-grab active:cursor-grabbing transition-all duration-200 shadow-lg ${
              isDragging === 'min' 
                ? 'border-blue-500 scale-125 shadow-lg shadow-blue-500/50' 
                : 'border-gray-400 hover:border-blue-400 hover:scale-110'
            }`}
            style={{
              left: `${minPercentage}%`,
              top: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: isDragging === 'min' ? 30 : 20
            }}
            onMouseDown={(e) => handleMouseDown(e, 'min')}
          >
            <div className="absolute inset-1 bg-blue-500 rounded-full" />
          </div>
          
          {/* Max Thumb */}
          <div
            className={`absolute w-5 h-5 bg-white border-2 rounded-full cursor-grab active:cursor-grabbing transition-all duration-200 shadow-lg ${
              isDragging === 'max' 
                ? 'border-purple-500 scale-125 shadow-lg shadow-purple-500/50' 
                : 'border-gray-400 hover:border-purple-400 hover:scale-110'
            }`}
            style={{
              left: `${maxPercentage}%`,
              top: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: isDragging === 'max' ? 30 : 20
            }}
            onMouseDown={(e) => handleMouseDown(e, 'max')}
          >
            <div className="absolute inset-1 bg-purple-500 rounded-full" />
          </div>
        </div>
        
        {/* Labels */}
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>{formatValue(min)}</span>
          <span>{formatValue(max)}</span>
        </div>
      </div>
    </div>
  );
};
