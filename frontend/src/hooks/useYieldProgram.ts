"use client";

import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Program, AnchorProvider, BN, web3 } from '@coral-xyz/anchor';
import { PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from '@solana/spl-token';
import { useMemo, useCallback } from 'react';
import { PROGRAM_ID } from '../lib/constants';
import idl from '../idl/idl.json';
import { getTokenDecimals, toTokenBaseUnits } from '../lib/tokenUtils';

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
    
    try {
      console.log('Creating program with IDL:', typeof idl, Object.keys(idl));
      console.log('IDL programId:', idl.programId);
      console.log('Provider:', provider);
      
      const program = new Program(idl as any, PROGRAM_ID, provider);
      console.log('Program created successfully:', program.programId.toString());
      return program;
    } catch (error) {
      console.error('Error creating program:', error);
      console.error('IDL structure:', JSON.stringify(idl, null, 2).substring(0, 500));
      return null;
    }
  }, [provider]);

  const deposit = useCallback(async (
    strategyAddress: PublicKey,
    tokenMint: PublicKey,
    amount: number
  ) => {
    if (!program || !wallet.publicKey || !wallet.sendTransaction) {
      throw new Error('Program or wallet not available');
    }

    try {
      console.log('Starting deposit:', { strategyAddress: strategyAddress.toString(), tokenMint: tokenMint.toString(), amount });

      // Récupérer les données de la stratégie pour obtenir le yield token mint
      const strategyAccount = await program.account.strategy.fetch(strategyAddress);
      console.log('Strategy account data:', strategyAccount);
      
      const yieldTokenMint = new PublicKey((strategyAccount as any).tokenYieldAddress);
      console.log('Yield token mint:', yieldTokenMint.toString());

      // Récupérer dynamiquement les décimales du token
      const decimals = await getTokenDecimals(connection, tokenMint);
      console.log('Token decimals:', decimals);

      // Convertir le montant en unités de base du token
      const depositAmount = new BN(toTokenBaseUnits(amount, decimals).toString());

      // Dériver les PDAs nécessaires (correspondant à accounts.rs)
      const [depositPda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("deposit"),
          wallet.publicKey.toBytes(),
          tokenMint.toBytes() // Utiliser tokenMint au lieu de strategyAddress
        ],
        program.programId
      );

      console.log('Deposit PDA:', depositPda.toString());

      // Obtenir les comptes de tokens associés
      const userTokenAccount = await getAssociatedTokenAddress(
        tokenMint,
        wallet.publicKey
      );

      // Calculer le strategyTokenAccount avec les bonnes seeds
      const [strategyTokenAccount] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("strategy_token"),
          tokenMint.toBytes()
        ],
        program.programId
      );

      const userYieldTokenAccount = await getAssociatedTokenAddress(
        yieldTokenMint,
        wallet.publicKey
      );

      // Vérifier si le compte yield token existe, sinon il sera créé lors du mint
      try {
        await connection.getTokenAccountBalance(userYieldTokenAccount);
        console.log('User yield token account exists');
      } catch (error) {
        console.log('User yield token account will be created during mint');
      }

      console.log('Accounts for deposit:', {
        strategy: strategyAddress.toString(),
        strategyTokenAccount: strategyTokenAccount.toString(),
        tokenMint: tokenMint.toString(),
        deposit: depositPda.toString(),
        signer: wallet.publicKey.toString(),
        userTokenAccount: userTokenAccount.toString(),
        userYieldTokenAccount: userYieldTokenAccount.toString(),
        yieldTokenMint: yieldTokenMint.toString(),
        tokenProgram: TOKEN_PROGRAM_ID.toString(),
        systemProgram: SystemProgram.programId.toString(),
        rent: SYSVAR_RENT_PUBKEY.toString(),
      });

      // Créer la transaction avec l'ordre exact de l'IDL
      const tx = await program.methods
        .deposit(depositAmount)
        .accounts({
          strategy: strategyAddress,
          strategyTokenAccount: strategyTokenAccount,
          tokenMint: tokenMint,
          deposit: depositPda,
          signer: wallet.publicKey,
          userTokenAccount: userTokenAccount,
          userYieldTokenAccount: userYieldTokenAccount,
          yieldTokenMint: yieldTokenMint,
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
          rent: SYSVAR_RENT_PUBKEY,
        })
        .transaction();

      // Ajouter l'instruction pour créer le compte yield token si nécessaire
      try {
        await connection.getTokenAccountBalance(userYieldTokenAccount);
      } catch (error) {
        console.log('Adding create ATA instruction for yield token');
        const { createAssociatedTokenAccountInstruction } = await import('@solana/spl-token');
        const createATAIx = createAssociatedTokenAccountInstruction(
          wallet.publicKey, // payer
          userYieldTokenAccount, // ata
          wallet.publicKey, // owner
          yieldTokenMint // mint
        );
        tx.instructions.unshift(createATAIx);
      }

      // Envoyer la transaction
      const signature = await wallet.sendTransaction(tx, connection);
      console.log('Transaction sent:', signature);
      
      // Attendre la confirmation
      await connection.confirmTransaction(signature, 'confirmed');
      console.log('Transaction confirmed:', signature);
      
      return {
        signature,
        depositAddress: depositPda,
      };
    } catch (error) {
      console.error('Error depositing:', error);
      throw error;
    }
  }, [program, wallet.publicKey, wallet.sendTransaction, connection]);

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
