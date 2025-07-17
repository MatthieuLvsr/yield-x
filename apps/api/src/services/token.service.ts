import { getMint } from '@solana/spl-token';
import { PublicKey } from '@solana/web3.js';
import { program } from '../contract/event.listener';

export const fetchStrategyInfo = async (strategyAddress: string) => {
  const strategy = new PublicKey(strategyAddress);
  // biome-ignore lint/suspicious/noExplicitAny: TypeScript inference limitations with Anchor-generated types
  return await (program.account as any).strategy.fetch(strategy);
};

export const fetchTokenInfo = async (tokenAddress: string) => {
  const connection = program.provider.connection;
  const mintPublicKey = new PublicKey(tokenAddress);
  const mintInfo = await getMint(connection, mintPublicKey);

  return {
    address: tokenAddress,
    supply: mintInfo.supply.toString(),
    decimals: mintInfo.decimals,
    mintAuthority: mintInfo.mintAuthority?.toString() || null,
    freezeAuthority: mintInfo.freezeAuthority?.toString() || null,
    isInitialized: mintInfo.isInitialized,
  };
};

export const retrieveTokenFromStrategy = async (strategyAddress: string) => {
  const strategyInfo = await fetchStrategyInfo(strategyAddress);
  return await fetchTokenInfo(strategyInfo.tokenAddress.toString());
};
