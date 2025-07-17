'use client';

import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import type React from 'react';
import { useEffect, useState } from 'react';
import { isUsingMockData } from '@/lib/config';

const DataModeIndicator: React.FC = () => {
  const [isClient, setIsClient] = useState(false);
  const [isMockMode, setIsMockMode] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setIsMockMode(isUsingMockData());
  }, []);

  if (!isClient || process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div className="fixed top-4 left-4 z-50">
      <div
        className={`flex items-center gap-2 rounded-lg border px-3 py-2 font-medium text-sm transition-all duration-300 ${
          isMockMode
            ? 'border-blue-400/30 bg-blue-500/20 text-blue-300'
            : 'border-green-400/30 bg-green-500/20 text-green-300'
        }`}
      >
        {isMockMode ? (
          <EyeIcon className="h-4 w-4" />
        ) : (
          <EyeSlashIcon className="h-4 w-4" />
        )}
        <span>{isMockMode ? 'MOCK DATA' : 'LIVE DATA'}</span>
      </div>
    </div>
  );
};

export default DataModeIndicator;
