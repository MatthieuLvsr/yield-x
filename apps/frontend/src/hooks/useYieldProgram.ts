'use client';

import { AnchorProvider, BN, Program, web3 } from '@coral-xyz/anchor';
import { getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, SYSVAR_RENT_PUBKEY, SystemProgram } from '@solana/web3.js';
import { useCallback, useMemo } from 'react';
import idl from '../idl/idl.json' with { type: 'json' };
import { PROGRAM_ID } from '../lib/constants';
import {
  deriveDepositPda,
  deriveStrategyPda,
  deriveStrategyTokenAccountPda,
} from '../lib/pda';
import { getTokenDecimals, toTokenBaseUnits } from '../lib/tokenUtils';

export const useYieldProgram = () => {
  const { connection } = useConnection();
  const wallet = useWallet();

  const provider = useMemo(() => {
    if (!(wallet.publicKey && wallet.signTransaction)) return null;

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
      console.log(
        'Program created successfully:',
        program.programId.toString()
      );
      return program;
    } catch (error) {
      console.error('Error creating program:', error);
      console.error(
        'IDL structure:',
        JSON.stringify(idl, null, 2).substring(0, 500)
      );
      return null;
    }
  }, [provider]);

  const deposit = useCallback(
    async (
      strategyAddress: PublicKey,
      tokenMint: PublicKey,
      amount: number
    ) => {
      if (!(program && wallet.publicKey && wallet.sendTransaction)) {
        throw new Error('Program or wallet not available');
      }

      try {
        console.log('Starting deposit:', {
          strategyAddress: strategyAddress.toString(),
          tokenMint: tokenMint.toString(),
          amount,
        });

        // Récupérer les données de la stratégie pour obtenir le yield token mint et l'APY
        const strategyAccount =
          await program.account.strategy.fetch(strategyAddress);
        console.log('Strategy account data:', strategyAccount);

        const yieldTokenMint = new PublicKey(
          (strategyAccount as any).tokenYieldAddress
        );
        const apy = (strategyAccount as any).rewardApy;
        console.log('Yield token mint:', yieldTokenMint.toString());
        console.log('Strategy APY:', apy);

        // Convertir l'APY en bytes pour le PDA
        const apyBytes = new BN(apy).toArrayLike(Buffer, 'le', 8);

        // Récupérer dynamiquement les décimales du token
        const decimals = await getTokenDecimals(connection, tokenMint);
        console.log('Token decimals:', decimals);

        // Convertir le montant en unités de base du token
        const depositAmount = new BN(
          toTokenBaseUnits(amount, decimals).toString()
        );

        // Dériver les PDAs nécessaires avec l'APY inclus
        const depositPda = deriveDepositPda(
          wallet.publicKey,
          tokenMint,
          apy,
          program.programId
        );

        console.log('Deposit PDA:', depositPda.toString());

        // Obtenir les comptes de tokens associés
        const userTokenAccount = await getAssociatedTokenAddress(
          tokenMint,
          wallet.publicKey
        );

        // Calculer le strategyTokenAccount avec les bonnes seeds (incluant APY)
        const strategyTokenAccount = deriveStrategyTokenAccountPda(
          tokenMint,
          apy,
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
            strategyTokenAccount,
            tokenMint,
            deposit: depositPda,
            signer: wallet.publicKey,
            userTokenAccount,
            userYieldTokenAccount,
            yieldTokenMint,
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
          const { createAssociatedTokenAccountInstruction } = await import(
            '@solana/spl-token'
          );
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
    },
    [program, wallet.publicKey, wallet.sendTransaction, connection]
  );

  const getUserDeposits = useCallback(async () => {
    if (!(program && wallet.publicKey)) return [];

    try {
      console.log('Fetching user deposits for:', wallet.publicKey.toString());

      // Récupérer tous les comptes DepositState du programme
      const allDeposits = await program.account.depositState.all();
      console.log('All deposits found:', allDeposits.length);

      // Filtrer pour ne garder que ceux de l'utilisateur
      const userDeposits = allDeposits.filter(
        (deposit) =>
          (deposit.account as any).user.toString() ===
          wallet.publicKey!.toString()
      );

      console.log('User deposits found:', userDeposits.length);

      // Formater les données pour l'UI
      const formattedDeposits = await Promise.all(
        userDeposits.map(async (deposit) => {
          try {
            const depositAccount = deposit.account as any;

            // Récupérer les données de la stratégie associée
            const strategyData = await program.account.strategy.fetch(
              depositAccount.strategyAddress
            );

            // Calculer les informations utiles
            const currentTime = Math.floor(Date.now() / 1000);
            const timeUntilMaturity =
              depositAccount.maturityDate.toNumber() - currentTime;
            const isMatured = timeUntilMaturity <= 0;

            return {
              publicKey: deposit.publicKey.toString(),
              amount: depositAccount.montant.toString(),
              yieldAmount: depositAccount.montantYield.toString(),
              depositDate: new Date(
                depositAccount.date.toNumber() * 1000
              ).toISOString(),
              maturityDate: new Date(
                depositAccount.maturityDate.toNumber() * 1000
              ).toISOString(),
              timeUntilMaturity: Math.max(0, timeUntilMaturity),
              isMatured,
              strategyAddress: depositAccount.strategyAddress.toString(),
              tokenAddress: (strategyData as any).tokenAddress.toString(),
              yieldTokenAddress: (
                strategyData as any
              ).tokenYieldAddress.toString(),
              apy: (strategyData as any).rewardApy.toString(),
            };
          } catch (error) {
            console.error('Error processing deposit:', error);
            return null;
          }
        })
      );

      // Filtrer les résultats null
      const validDeposits = formattedDeposits.filter(
        (deposit) => deposit !== null
      );
      console.log('Valid formatted deposits:', validDeposits);

      return validDeposits;
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

  const redeem = useCallback(
    async (depositAddress: PublicKey, withPenalty = false) => {
      if (!(program && wallet.publicKey && wallet.sendTransaction)) {
        throw new Error('Program or wallet not available');
      }

      try {
        console.log('Starting redeem process...');
        console.log('Deposit address:', depositAddress.toString());
        console.log('With penalty:', withPenalty);

        // Récupérer les données du dépôt
        const depositData =
          await program.account.depositState.fetch(depositAddress);
        console.log('Deposit data:', depositData);

        // Récupérer les données de la stratégie
        const strategyAddress = (depositData as any).strategyAddress;
        const strategyData =
          await program.account.strategy.fetch(strategyAddress);
        console.log('Strategy data:', strategyData);

        const tokenMint = (strategyData as any).tokenAddress;
        const yieldTokenMint = (strategyData as any).tokenYieldAddress;
        const apy = (strategyData as any).rewardApy;

        // Convertir l'APY en bytes pour le PDA
        const apyBytes = new BN(apy).toArrayLike(Buffer, 'le', 8);

        // Dériver les PDAs et comptes nécessaires avec l'APY inclus
        const strategyPda = deriveStrategyPda(
          tokenMint,
          apy,
          program.programId
        );

        // PDA pour le strategy_token_account avec APY
        const strategyTokenAccount = deriveStrategyTokenAccountPda(
          tokenMint,
          apy,
          program.programId
        );

        const userTokenAccount = await getAssociatedTokenAddress(
          tokenMint,
          wallet.publicKey
        );

        const userYieldTokenAccount = await getAssociatedTokenAddress(
          yieldTokenMint,
          wallet.publicKey
        );

        console.log('Accounts for redeem:', {
          deposit: depositAddress.toString(),
          strategy: strategyAddress.toString(),
          strategyTokenAccount: strategyTokenAccount.toString(),
          tokenMint: tokenMint.toString(),
          yieldTokenMint: yieldTokenMint.toString(),
          userTokenAccount: userTokenAccount.toString(),
          userYieldTokenAccount: userYieldTokenAccount.toString(),
          signer: wallet.publicKey.toString(),
        });

        // Créer la transaction de redeem
        const tx = await program.methods
          .redeem(withPenalty)
          .accounts({
            strategy: strategyAddress,
            strategyTokenAccount,
            userTokenAccount,
            userYieldTokenAccount,
            yieldTokenMint,
            deposit: depositAddress,
            signer: wallet.publicKey,
            tokenProgram: TOKEN_PROGRAM_ID,
          })
          .transaction();

        // Envoyer la transaction
        const signature = await wallet.sendTransaction(tx, connection);
        console.log('Redeem transaction sent:', signature);

        // Attendre la confirmation
        await connection.confirmTransaction(signature, 'confirmed');
        console.log('Redeem transaction confirmed:', signature);

        return {
          signature,
          depositAddress,
        };
      } catch (error) {
        console.error('Error redeeming:', error);
        throw error;
      }
    },
    [program, wallet.publicKey, wallet.sendTransaction, connection]
  );

  return {
    program,
    deposit,
    redeem,
    getUserDeposits,
    getAllStrategies,
    isReady: !!program && !!wallet.publicKey,
  };
};
