"use client";

import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Program, AnchorProvider, BN, web3 } from '@coral-xyz/anchor';
import { PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from '@solana/spl-token';
import { useMemo, useCallback } from 'react';
import { PROGRAM_ID } from '@/lib/constants';
import { IDL } from '@/types/yield_app';

export const useYieldProgram = () => {
  const { connection } = useConnection();
  const wallet = useWallet();

  const provider = useMemo(() => {
    if (!wallet.publicKey || !wallet.signTransaction) return null;
    
    return new AnchorProvider(
      connection,
      wallet as any,
      AnchorProvider.defaultOptions()
    );
  }, [connection, wallet]);

  const program = useMemo(() => {
    if (!provider) return null;
    
    return new Program(IDL as any, provider);
  }, [provider]);

  const deposit = useCallback(async (
    strategyAddress: PublicKey,
    tokenMint: PublicKey,
    amount: number
  ) => {
    if (!program || !wallet.publicKey) {
      throw new Error('Program or wallet not available');
    }

    try {
      // Simuler le dépôt pour l'instant
      console.log('Déposing:', { strategyAddress: strategyAddress.toString(), tokenMint: tokenMint.toString(), amount });
      
      // Retourner une transaction simulée
      return {
        signature: 'simulated_tx_' + Date.now(),
        depositAddress: web3.Keypair.generate().publicKey,
      };
    } catch (error) {
      console.error('Error depositing:', error);
      throw error;
    }
  }, [program, wallet.publicKey]);

  const getUserDeposits = useCallback(async () => {
    if (!program || !wallet.publicKey) return [];

    try {
      // Retourner des données simulées pour l'instant
      return [];
    } catch (error) {
      console.error('Error fetching user deposits:', error);
      return [];
    }
  }, [program, wallet.publicKey]);

  const getAllStrategies = useCallback(async () => {
    if (!program) return [];

    try {
      // Retourner des données simulées pour l'instant
      return [];
    } catch (error) {
      console.error('Error fetching strategies:', error);
      return [];
    }
  }, [program]);

  return {
    program,
    deposit,
    getUserDeposits,
    getAllStrategies,
    isReady: !!program && !!wallet.publicKey,
  };
};
