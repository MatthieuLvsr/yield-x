"use client";

import React from 'react';
import { isUsingMockData, getAppConfig } from '@/lib/config';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const DataModeIndicator: React.FC = () => {
  const config = getAppConfig();
  const isMockMode = isUsingMockData();

  // Only show in development
  if (typeof window === 'undefined' || process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div className="fixed top-4 left-4 z-50">
      <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-all duration-300 ${
        isMockMode
          ? 'bg-blue-500/20 border-blue-400/30 text-blue-300'
          : 'bg-green-500/20 border-green-400/30 text-green-300'
      }`}>
        {isMockMode ? (
          <EyeIcon className="w-4 h-4" />
        ) : (
          <EyeSlashIcon className="w-4 h-4" />
        )}
        <span>
          {isMockMode ? 'MOCK DATA' : 'LIVE DATA'}
        </span>
      </div>
    </div>
  );
};

export default DataModeIndicator;
