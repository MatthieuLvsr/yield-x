import { Connection, PublicKey } from '@solana/web3.js';
import { getMint } from '@solana/spl-token';

/**
 * Récupère le nombre de décimales d'un token
 */
export async function getTokenDecimals(
  connection: Connection, 
  tokenMint: PublicKey
): Promise<number> {
  try {
    const mintInfo = await getMint(connection, tokenMint);
    return mintInfo.decimals;
  } catch (error) {
    console.error('Error fetching token decimals:', error);
    // Fallback sur des décimales par défaut selon le type de token
    return 6; // USDC par défaut
  }
}

/**
 * Convertit un montant en unités de base du token
 */
export function toTokenBaseUnits(amount: number, decimals: number): bigint {
  return BigInt(Math.floor(amount * Math.pow(10, decimals)));
}

/**
 * Convertit des unités de base du token en montant lisible
 */
export function fromTokenBaseUnits(amount: bigint, decimals: number): number {
  return Number(amount) / Math.pow(10, decimals);
}
