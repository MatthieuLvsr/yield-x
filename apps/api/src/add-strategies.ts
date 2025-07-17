import { AnchorProvider, BN, Program, web3 } from '@coral-xyz/anchor';
import { bs58 } from '@coral-xyz/anchor/dist/cjs/utils/bytes';
import {
  getAccount,
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import { type Connection, PublicKey } from '@solana/web3.js';
import type { YieldApp } from './contract/yield_app';
import idl from './contract/yield_app.json' with { type: 'json' };

const provider = AnchorProvider.env();
const program = new Program(idl as YieldApp, provider);

if (!program) {
  throw new Error('Program not found');
}

const user = provider.wallet.publicKey;
const base58Secret = process.env.PRIVATE_KEY_PHANTOM as string;
const phantomWallet = web3.Keypair.fromSecretKey(bs58.decode(base58Secret));

console.log('Event listener started ->', {
  programId: program.programId.toString(),
  rpcEndpoint: provider.connection.rpcEndpoint,
  user: user.toString(),
  phantomWallet: phantomWallet.publicKey.toString(),
});

// const USDC_DEVNET_ADDRESS = new PublicKey(
//   '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU'
// );
// const createdTokenAddresses = ['FkrQEzph18Ljo9vjiEGaGmATndQ6XSQPQaNGMpv8G1zx'];

const TOKEN_ADDRESS = new PublicKey(
  '6STxEweKGgYcxV9PMWUPdYUNA9wxGmz8YyEGYzBu7vvA'
);

async function getTokenAccountAddress(walletPubkey: PublicKey) {
  return await getAssociatedTokenAddress(TOKEN_ADDRESS, walletPubkey);
}

async function getTokenBalance(
  connection: Connection,
  walletPubkey: PublicKey
) {
  const usdcTokenAccount = await getTokenAccountAddress(walletPubkey);
  const accountInfo = await getAccount(connection, usdcTokenAccount);
  return Number(accountInfo.amount);
}

const balance = await getTokenBalance(provider.connection, user);

console.log(
  'User wallet balance:',
  (balance / 1_000_000).toLocaleString(undefined, {
    minimumFractionDigits: 6,
    maximumFractionDigits: 6,
  })
);

const rewardApyBN = new BN(12 * 100);

const [strategyPda] = web3.PublicKey.findProgramAddressSync(
  [
    Buffer.from('strategy'),
    TOKEN_ADDRESS.toBuffer(),
    rewardApyBN.toArrayLike(Buffer, 'le', 8),
  ],
  program.programId
);

const tokenYieldKeypair = web3.Keypair.generate();

if (!program.methods.createStrategy) {
  throw new Error('Program does not have createStrategy method');
}

const tx = await program.methods
  .createStrategy(TOKEN_ADDRESS, rewardApyBN)
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

console.log('Strategy created! Tx:', tx);
console.log('Strategy PDA:', strategyPda.toBase58());
console.log('Yield token mint:', tokenYieldKeypair.publicKey.toBase58());
