import { BN, web3 } from '@coral-xyz/anchor';

import {
  getAccount,
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import { PublicKey } from '@solana/web3.js';
import Elysia, { t } from 'elysia';
import { program, provider } from '../contract/event.listener';
import prisma from '../lib/prisma';
import { prismaErrorPlugin } from '../lib/prisma.plugin';
import { getTokenInfo } from '../services/price.service';

type Strategy = {
  publicKey: PublicKey;
  account: {
    tokenAddress: PublicKey;
    tokenYieldAddress: PublicKey;
    date: BN;
    rewardApy: BN;
  };
};

export const contractRouter = new Elysia({
  name: 'contract',
  prefix: '/contract',
  tags: ['Contract'],
})
  .use(prismaErrorPlugin('Contract'))
  .get('/strategies/averageApy', async () => {
    // biome-ignore lint/suspicious/noExplicitAny: External library typing limitation
    const strategies = await (program.account as any).strategy.all();
    // biome-ignore lint/suspicious/noExplicitAny: External library typing limitation
    const totalApy = strategies.reduce((acc: BN, strategy: any) => {
      return acc + strategy.account.rewardApy.toNumber();
    }, 0);
    const average = totalApy / (100 * strategies.length);
    await prisma.stats.update({
      where: { id: 'global' },
      data: {
        averageApy: average,
        strategiesCount: strategies.length,
      },
    });
    return average;
  })
  .get('/strategies/count', async () => {
    // biome-ignore lint/suspicious/noExplicitAny: External library typing limitation
    const strategies = await (program.account as any).strategy.all();
    return strategies.length;
  })
  .get('/strategies', async () => {
    // biome-ignore lint/suspicious/noExplicitAny: External library typing limitation
    const strategies = await (program.account as any).strategy.all();
    const data = (strategies as Strategy[]).map((strategy: Strategy) => ({
      publicKey: strategy.publicKey,
      account: {
        ...strategy.account,
        date: new Date(strategy.account.date.toNumber()),
        rewardApy: strategy.account.rewardApy.toNumber() / 100,
      },
    }));
    return data;
  })
  .get(
    '/strategies/:address',
    async ({ params: { address }, set }) => {
      try {
        const strategyPubkey = new PublicKey(address);

        // biome-ignore lint/suspicious/noExplicitAny: External library typing limitation
        const strategy = await (program.account as any).strategy.fetch(
          strategyPubkey
        );

        return {
          address,
          tokenAddress: strategy.tokenAddress.toBase58(),
          yieldTokenAddress: strategy.tokenYieldAddress.toBase58(),
          rewardApy: strategy.rewardApy.toNumber() / 100,
          dateCreated: new Date(strategy.date.toNumber()),
        };
      } catch (error) {
        console.error('Error fetching strategy:', error);
        set.status = 404;
        return {
          error: 'Strategy not found',
          details: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    },
    {
      params: t.Object({
        address: t.String({
          description: 'The strategy public key address',
          minLength: 32,
          maxLength: 44,
        }),
      }),
    }
  )
  .post(
    '/strategies',
    async ({ body: { tokenAddress, rewardApy }, set }) => {
      try {
        const tokenAddressPubkey = new PublicKey(tokenAddress);
        const rewardApyBN = new BN(rewardApy * 100);

        const [strategyPda] = web3.PublicKey.findProgramAddressSync(
          [
            Buffer.from('strategy'),
            tokenAddressPubkey.toBuffer(),
            rewardApyBN.toArrayLike(Buffer, 'le', 8),
          ],
          program.programId
        );

        try {
          // biome-ignore lint/suspicious/noExplicitAny: External library typing limitation
          await (program.account as any).strategy.fetch(strategyPda);
          set.status = 409;
          return {
            error: 'Strategy already exists for this token and APY',
            strategyAddress: strategyPda.toBase58(),
          };
        } catch {
          const tokenYieldKeypair = web3.Keypair.generate();
          // biome-ignore lint/suspicious/noExplicitAny: External library typing limitation
          const tx = await (program.methods as any)
            .createStrategy(tokenAddressPubkey, rewardApyBN)
            .accounts({
              strategy: strategyPda,
              tokenAddressYield: tokenYieldKeypair.publicKey,
              signer: provider.wallet.publicKey,
              systemProgram: web3.SystemProgram.programId,
              tokenProgram: TOKEN_PROGRAM_ID,
              rent: web3.SYSVAR_RENT_PUBKEY,
            })
            .signers([tokenYieldKeypair])
            .rpc();

          return {
            success: true,
            transaction: tx,
            strategy: {
              address: strategyPda.toBase58(),
              tokenAddress,
              yieldTokenAddress: tokenYieldKeypair.publicKey.toBase58(),
              rewardApy,
            },
          };
        }
      } catch (error) {
        console.error('Error creating strategy:', error);
        set.status = 500;
        return {
          error: 'Failed to create strategy',
          details: error instanceof Error ? error.message : 'Unknown error',
        };
      }
    },
    {
      body: t.Object({
        tokenAddress: t.String({
          description: 'The token address for the strategy',
          minLength: 32,
          maxLength: 44,
        }),
        rewardApy: t.Number({
          description: 'The reward APY percentage (0-100)',
          minimum: 0.01,
          maximum: 100,
        }),
      }),
    }
  )
  .get(
    '/token/:tokenAddress',
    ({ params: { tokenAddress } }) => {
      const token = getTokenInfo(tokenAddress);
      return token;
    },
    {
      params: t.Object({
        tokenAddress: t.String({
          description: 'The token address for the strategy',
          minLength: 32,
          maxLength: 44,
        }),
      }),
    }
  )
  .post(
    '/token/balance',
    async ({ body: { tokenAddress, ownerAddress }, status }) => {
      try {
        const mintPubkey = new PublicKey(tokenAddress);
        const ownerPubkey = new PublicKey(ownerAddress);

        const tokenAccount = await getAssociatedTokenAddress(
          mintPubkey,
          ownerPubkey
        );
        const token = getTokenInfo(tokenAddress);
        if (!token) {
          return status('Not Found');
        }

        const accountInfo = await getAccount(provider.connection, tokenAccount);
        const balance = Number(accountInfo.amount) / 10 ** token?.decimals;

        return balance;
      } catch (error) {
        console.log(error);
        return status('Bad Request');
      }
    },
    {
      body: t.Object({
        tokenAddress: t.String(),
        ownerAddress: t.String(),
      }),
    }
  );
