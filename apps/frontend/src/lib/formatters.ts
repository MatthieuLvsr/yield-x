/**
 * Utilities for formatting token amounts with proper decimal conversion
 */

// Token decimals mapping - extend as needed
const TOKEN_DECIMALS: Record<string, number> = {
  'USDC': 6,
  'USDT': 6,
  'SOL': 9,
  'WSOL': 9,
  // Add more tokens as needed
};

/**
 * Convert base units to human-readable format
 */
export function formatTokenAmount(
  amount: string | number,
  decimals: number = 6,
  options: {
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    symbol?: string;
  } = {}
): string {
  const {
    minimumFractionDigits = 2,
    maximumFractionDigits = 6,
    symbol = ''
  } = options;

  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  const converted = numAmount / Math.pow(10, decimals);
  
  const formatted = converted.toLocaleString(undefined, {
    minimumFractionDigits,
    maximumFractionDigits
  });

  return symbol ? `${formatted} ${symbol}` : formatted;
}

/**
 * Format currency amount with symbol
 */
export function formatCurrency(
  amount: string | number,
  decimals: number = 6,
  symbol: string = 'USDC'
): string {
  return formatTokenAmount(amount, decimals, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
    symbol
  });
}

/**
 * Format percentage with proper decimal places
 */
export function formatPercentage(
  value: string | number,
  decimals: number = 2
): string {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  return `${numValue.toFixed(decimals)}%`;
}

/**
 * Format date in readable format
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Format time remaining
 */
export function formatTimeRemaining(seconds: number): string {
  if (seconds <= 0) return 'Matured';
  
  const days = Math.floor(seconds / (24 * 60 * 60));
  const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((seconds % (60 * 60)) / 60);
  
  if (days > 0) {
    return `${days}d ${hours}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
}

/**
 * Get token decimals by symbol
 */
export function getTokenDecimals(symbol: string): number {
  return TOKEN_DECIMALS[symbol.toUpperCase()] || 6;
}

/**
 * Format large numbers with appropriate units (K, M, B)
 */
export function formatLargeNumber(
  amount: string | number,
  decimals: number = 6
): string {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  const converted = numAmount / Math.pow(10, decimals);
  
  if (converted >= 1e9) {
    return `${(converted / 1e9).toFixed(1)}B`;
  } else if (converted >= 1e6) {
    return `${(converted / 1e6).toFixed(1)}M`;
  } else if (converted >= 1e3) {
    return `${(converted / 1e3).toFixed(1)}K`;
  }
  
  return converted.toFixed(2);
}
