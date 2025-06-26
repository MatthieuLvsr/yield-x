"use client";

import { PublicKey } from '@solana/web3.js';
import { PROGRAM_ID } from '@/lib/constants';

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
