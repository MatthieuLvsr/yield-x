type TokenInfo = {
  readonly address: string;
  readonly symbol: string;
  readonly name: string;
  readonly price: number;
  readonly decimals: number;
  readonly lastUpdated: Date;
};

const DEVNET_PRICES = new Map<string, TokenInfo>([
  [
    '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU',
    {
      address: '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU',
      symbol: 'USDC',
      name: 'USDC',
      price: 1.0,
      decimals: 6,
      lastUpdated: new Date(),
    },
  ],
  [
    'So11111111111111111111111111111111111111112',
    {
      address: 'So11111111111111111111111111111111111111112',
      symbol: 'SOL',
      name: 'Solana',
      price: 175.0,
      decimals: 9,
      lastUpdated: new Date(),
    },
  ],
  [
    'FkrQEzph18Ljo9vjiEGaGmATndQ6XSQPQaNGMpv8G1zx',
    {
      address: 'FkrQEzph18Ljo9vjiEGaGmATndQ6XSQPQaNGMpv8G1zx',
      symbol: 'TST',
      name: 'Test Token',
      price: 10.0,
      decimals: 9,
      lastUpdated: new Date(),
    },
  ],
  [
    '6STxEweKGgYcxV9PMWUPdYUNA9wxGmz8YyEGYzBu7vvA',
    {
      address: '6STxEweKGgYcxV9PMWUPdYUNA9wxGmz8YyEGYzBu7vvA',
      symbol: 'TST2',
      name: 'Test2 Token',
      price: 42.0,
      decimals: 9,
      lastUpdated: new Date(),
    },
  ],
]);

export const getTokenInfo = (tokenAddress: string) => {
  if (isDevnet()) {
    const token = DEVNET_PRICES.get(tokenAddress);
    if (!token) {
      throw new Error(`Token not found: ${tokenAddress}`);
    }
    return token;
  }

  // TODO -> fetch mainnet price
  return DEVNET_PRICES.get('4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU');
};

const getDevnetPrice = (token: string): number =>
  DEVNET_PRICES.get(token)?.price ?? 0;

const getMainnetPrice = (tokenAddress: string) => {
  // TODO
  return tokenAddress;
};

export const isDevnet = (): boolean => process.env.NODE_ENV !== 'production';

export const getTokenPrice = (identifier: string) => {
  if (isDevnet()) {
    return getDevnetPrice(identifier);
  }

  getMainnetPrice(identifier);
  return 100;
};

export const usdToCents = (usdAmount: number): bigint =>
  BigInt(Math.floor(usdAmount * 100));

export const convertToUSD = (
  tokenAddress: string,
  amount: bigint,
  decimals: number
) => {
  const price = getTokenPrice(tokenAddress);
  const tokenAmount = Number(amount) / 10 ** decimals;
  const usdValue = tokenAmount * price;

  return usdValue;
};
