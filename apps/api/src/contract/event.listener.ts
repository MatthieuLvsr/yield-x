import { AnchorProvider, Program } from '@coral-xyz/anchor';
import prisma from '../lib/prisma';
import { convertToUSD, usdToCents } from '../services/price.service';
import { retrieveTokenFromStrategy } from '../services/token.service';
import type {
  CreateStrategyEvent,
  DepositEvent,
  RedeemEvent,
} from './event.type';
import type { YieldApp } from './yield_app';
import idl from './yield_app.json' with { type: 'json' };

export const provider = AnchorProvider.env();
export const program = new Program(idl as YieldApp, provider);

if (!program) {
  throw new Error('Program not found');
}

const createEventLog = (
  type: string,
  event: DepositEvent | RedeemEvent,
  slot: number
) => ({
  type,
  user: event.user.toString(),
  strategy: event.strategy.toString(),
  amount:
    'amount' in event ? Number(event.amount) : Number(event.amountRedeemed),
  slot,
  timestamp: new Date().toISOString(),
});

const initStats = async () => {
  return await prisma.stats.create({
    data: {
      id: 'global',
      tvl: BigInt(0),
      averageApy: 0,
      activeUsers: 0,
      strategiesCount: 0,
    },
  });
};

const updateTVLStats = async (
  usdValue: number,
  operation: 'increment' | 'decrement'
) => {
  console.log(
    `input ${usdValue} -> op: ${operation} -> usdToCents: ${usdToCents(usdValue)}`
  );

  let stats = await prisma.stats.findUnique({ where: { id: 'global' } });

  if (!stats) {
    stats = await initStats();
  }

  const changeAmount = usdToCents(usdValue);
  const newTvl =
    operation === 'increment'
      ? stats.tvl + changeAmount
      : stats.tvl - changeAmount;

  return await prisma.stats.update({
    where: { id: 'global' },
    data: {
      tvl: newTvl,
    },
  });
};

const createEventHandler =
  (operation: 'increment' | 'decrement') =>
  async (event: DepositEvent | RedeemEvent, slot: number) => {
    const eventType = operation === 'increment' ? 'DEPOSIT' : 'REDEEM';
    const amount =
      'amount' in event ? Number(event.amount) : Number(event.amountRedeemed);

    console.log(
      `💸 ${eventType} EVENT:`,
      createEventLog(eventType, event, slot)
    );

    const token = await retrieveTokenFromStrategy(event.strategy.toString());
    const usdValue = convertToUSD(
      token.address,
      BigInt(amount),
      token.decimals
    );

    const updatedStatsResult = await updateTVLStats(usdValue, operation);
    console.log('updateResult -> ', updatedStatsResult);
    console.log(`Converting ${amount} tokens to $${usdValue.toFixed(2)} USD`);
  };

const handleDepositEvent = createEventHandler('increment');
const handleRedeemEvent = createEventHandler('decrement');

export const startEventListener = () => {
  console.log('Event listener started ->', {
    walletPubKey: provider.wallet.publicKey.toString(),
    programId: program.programId.toString(),
    rpcEndpoint: provider.connection.rpcEndpoint,
    commitment: provider.connection.commitment,
    timestamp: new Date().toISOString(),
  });

  console.log('Listening for events... Press Ctrl+C to exit');

  // Register event handlers
  program.addEventListener('redeemEvent', handleRedeemEvent);
  program.addEventListener('depositEvent', handleDepositEvent);
  program.addEventListener(
    'createStrategyEvent',
    async (event: CreateStrategyEvent) => {
      let stats = await prisma.stats.findUnique({ where: { id: 'global' } });
      if (!stats) {
        stats = await initStats();
      }

      await prisma.stats.update({
        where: { id: 'global' },
        data: {
          averageApy:
            (stats.averageApy * stats.strategiesCount + event.apy) /
            (stats.strategiesCount + 1),
          strategiesCount: stats.strategiesCount + 1,
        },
      });
    }
  );
};
