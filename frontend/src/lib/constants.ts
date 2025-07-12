import { PublicKey } from '@solana/web3.js';
import { IDL } from '../types/yield_app';

export const PROGRAM_ID = new PublicKey('9io1JC8pUndHgSv3GU2mCs1vrADcfY2rhE5Cip3kXL4k');

export { IDL };

// Known token mints for the strategies
export const TOKEN_MINTS = {
  // Devnet addresses
  USDC: new PublicKey('4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU'), // USDC devnet
  SOL: new PublicKey('So11111111111111111111111111111111111111112'), // Wrapped SOL (same for all networks)
  RAY: new PublicKey('4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R'), // RAY devnet (using a test token)
  
  // Mainnet addresses (commented for reference)
  // USDC: new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'), // USDC mainnet
  // RAY: new PublicKey('4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R'), // Raydium mainnet
};

// Strategy configurations
export const STRATEGIES = [
  {
    id: '1',
    name: 'Stable Yield',
    token: 'USDC',
    tokenMint: TOKEN_MINTS.USDC,
    apy: 8.5,
    risk: 'Low' as const,
    lockPeriod: 30, // days
    description: 'Conservative yield strategy with minimal risk'
  },
  {
    id: '2',
    name: 'SOL Staking Plus',
    token: 'SOL',
    tokenMint: TOKEN_MINTS.SOL,
    apy: 15.2,
    risk: 'Medium' as const,
    lockPeriod: 60, // days
    description: 'Enhanced SOL staking with additional yield opportunities'
  },
  {
    id: '3',
    name: 'DeFi Boost',
    token: 'RAY',
    tokenMint: TOKEN_MINTS.RAY,
    apy: 24.8,
    risk: 'High' as const,
    lockPeriod: 90, // days
    description: 'High-yield DeFi protocol participation'
  }
] as const;
