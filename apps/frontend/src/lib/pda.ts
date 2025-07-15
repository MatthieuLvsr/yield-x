"use client";

import { PublicKey } from '@solana/web3.js';
import { PROGRAM_ID } from '@/lib/constants';
import { BN } from '@coral-xyz/anchor';

export const getStrategyPDA = (tokenMint: PublicKey): [PublicKey, number] => {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from("strategy"),
      tokenMint.toBuffer(),
    ],
    PROGRAM_ID
  );
};

export const getDepositPDA = (strategy: PublicKey, user: PublicKey): [PublicKey, number] => {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from("deposit"),
      strategy.toBuffer(),
      user.toBuffer(),
    ],
    PROGRAM_ID
  );
};

export const getYieldTokenMintPDA = (strategy: PublicKey): [PublicKey, number] => {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from("yield_token"),
      strategy.toBuffer(),
    ],
    PROGRAM_ID
  );
};

// Fonction utilitaire pour dériver le PDA d'une stratégie avec APY
export const deriveStrategyPda = (tokenMint: PublicKey, apy: number, programId: PublicKey): PublicKey => {
  const apyBytes = new BN(apy).toArrayLike(Buffer, 'le', 8);
  const [strategyPda] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("strategy"),
      tokenMint.toBuffer(),
      apyBytes,
    ],
    programId
  );
  return strategyPda;
};

// Fonction utilitaire pour dériver le PDA du strategy_token_account avec APY
export const deriveStrategyTokenAccountPda = (tokenMint: PublicKey, apy: number, programId: PublicKey): PublicKey => {
  const apyBytes = new BN(apy).toArrayLike(Buffer, 'le', 8);
  const [strategyTokenAccountPda] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("strategy_token"),
      tokenMint.toBuffer(),
      apyBytes,
    ],
    programId
  );
  return strategyTokenAccountPda;
};

// Fonction utilitaire pour dériver le PDA d'un dépôt avec APY
export const deriveDepositPda = (userPubkey: PublicKey, tokenMint: PublicKey, apy: number, programId: PublicKey): PublicKey => {
  const apyBytes = new BN(apy).toArrayLike(Buffer, 'le', 8);
  const [depositPda] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("deposit"),
      userPubkey.toBuffer(),
      tokenMint.toBuffer(),
      apyBytes,
    ],
    programId
  );
  return depositPda;
};
