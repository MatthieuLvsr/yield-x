import { AnchorProvider, Program } from '@coral-xyz/anchor';
import prisma from '../lib/prisma';
import { convertToUSD, usdToCents } from '../services/price.service';
import { retrieveTokenFromStrategy } from '../services/token.service';
import type { DepositEvent, RedeemEvent } from './event.type';
import type { YieldApp } from './yield_app';
import idl from './yield_app.json' with { type: 'json' };

export const provider = AnchorProvider.env();
export const program = new Program(idl as YieldApp, provider);

if (!program) {
  throw new Error('Program not found');
}

// Pure function to create log message
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

const updateTVLStats = async (
  usdValue: number,
  operation: 'increment' | 'decrement'
) =>
  prisma.stats.upsert({
    where: { id: 'global' },
    update: {
      tvl: {
        [operation]: usdToCents(usdValue),
      },
    },
    create: {
      id: 'global',
      tvl: operation === 'increment' ? usdToCents(usdValue) : BigInt(0),
      averageApy: 0,
      activeUsers: 0,
    },
  });

const handleConversionResult = (
  result: { success: boolean; data?: number; error?: Error },
  operation: 'increment' | 'decrement'
) => {
  if (!result.success) {
    return {
      success: false,
      message: `Conversion failed: ${result.error?.message}`,
    };
  }

  const usdValue = result.data as number;
  return updateTVLStats(usdValue, operation)
    .then(() => ({
      success: true,
      message: `TVL ${operation}ed by $${usdValue.toFixed(2)}`,
      usdValue,
    }))
    .catch((error) => ({
      success: false,
      message: `Database update failed: ${error.message}`,
    }));
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

    const conversionResult = convertToUSD(
      token.address,
      BigInt(amount),
      token.decimals
    );

    const updateResult = await handleConversionResult(
      conversionResult,
      operation
    );

    if (updateResult.success) {
      console.log(`✅ ${updateResult.message}`);
      console.log(
        `Converting ${amount} tokens to $${updateResult.usdValue?.toFixed(2)} USD`
      );
    } else {
      console.error(`❌ ${updateResult.message}`);
    }
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
};
