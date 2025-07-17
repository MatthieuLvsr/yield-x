/**
 * Configuration utility for switching between mock and real data
 * This module provides a centralized way to manage data sources
 */

export interface AppConfig {
  useMockData: boolean;
  appEnv: string;
  mockDelay: number;
  enableDemoMode: boolean;
  api: {
    baseUrl: string;
    wsUrl: string;
  };
  solana: {
    rpcEndpoint: string;
    network: string;
    programId: string;
    commitment: string;
  };
}

/**
 * Get the current application configuration based on environment variables
 */
export const getAppConfig = (): AppConfig => {
  const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

  return {
    useMockData,
    appEnv: process.env.NEXT_PUBLIC_APP_ENV || 'development',
    mockDelay: Number.parseInt(process.env.NEXT_PUBLIC_MOCK_DELAY || '800'),
    enableDemoMode: process.env.NEXT_PUBLIC_ENABLE_DEMO_MODE === 'true',
    api: {
      baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || '',
      wsUrl: process.env.NEXT_PUBLIC_WS_URL || '',
    },
    solana: {
      rpcEndpoint:
        process.env.NEXT_PUBLIC_RPC_ENDPOINT || 'https://api.devnet.solana.com',
      network: process.env.NEXT_PUBLIC_NETWORK || 'devnet',
      programId: process.env.NEXT_PUBLIC_PROGRAM_ID || '',
      commitment: process.env.NEXT_PUBLIC_COMMITMENT || 'confirmed',
    },
  };
};

/**
 * Check if the app is running in mock data mode
 */
export const isUsingMockData = (): boolean => {
  return getAppConfig().useMockData;
};

/**
 * Check if demo mode is enabled
 */
export const isDemoModeEnabled = (): boolean => {
  return getAppConfig().enableDemoMode;
};

/**
 * Get the mock delay for simulating API calls
 */
export const getMockDelay = (): number => {
  return getAppConfig().mockDelay;
};

/**
 * Development utilities
 */
export const isDevelopment = (): boolean => {
  return process.env.NODE_ENV === 'development';
};

export const isProduction = (): boolean => {
  return process.env.NODE_ENV === 'production';
};

/**
 * Log the current configuration (development only)
 */
export const logConfig = (): void => {
  if (isDevelopment()) {
    const config = getAppConfig();
    console.log('🔧 App Configuration:', {
      mode: config.useMockData ? 'MOCK DATA' : 'REAL DATA',
      environment: config.appEnv,
      mockDelay: config.mockDelay,
      demoMode: config.enableDemoMode,
      apiConfigured: !!config.api.baseUrl,
      solanaNetwork: config.solana.network,
    });
  }
};

// Log configuration on module load (development only)
if (typeof window !== 'undefined' && isDevelopment()) {
  logConfig();
}
