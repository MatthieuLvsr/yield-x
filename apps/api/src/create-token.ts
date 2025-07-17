import { AnchorProvider, Program } from '@coral-xyz/anchor';
import {
  createAssociatedTokenAccountInstruction,
  createInitializeMintInstruction,
  createMintToInstruction,
  getAccount,
  getAssociatedTokenAddress,
  getMint,
  MINT_SIZE,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import {
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
} from '@solana/web3.js';
import type { YieldApp } from './contract/yield_app';
import idl from './contract/yield_app.json' with { type: 'json' };

const TOKEN_METADATA = {
  name: 'TEST Token',
  symbol: 'TST',
  decimals: 9,
  supply: 1_000_000, // 1 million tokens
};

async function createToken() {
  try {
    const provider = AnchorProvider.env();
    const connection = provider.connection;
    const payer = provider.wallet.publicKey;

    console.log('Creating token with the following configuration:');
    console.log(`- Name: ${TOKEN_METADATA.name}`);
    console.log(`- Symbol: ${TOKEN_METADATA.symbol}`);
    console.log(`- Decimals: ${TOKEN_METADATA.decimals}`);
    console.log(`- Initial Supply: ${TOKEN_METADATA.supply.toLocaleString()}`);
    console.log(`- Payer: ${payer.toString()}`);
    console.log(`- Network: ${connection.rpcEndpoint}`);

    const mintKeypair = Keypair.generate();
    console.log(`\nMint Address: ${mintKeypair.publicKey.toString()}`);

    const rentExemptBalance =
      await connection.getMinimumBalanceForRentExemption(MINT_SIZE);

    const createMintAccountInstruction = SystemProgram.createAccount({
      fromPubkey: payer,
      newAccountPubkey: mintKeypair.publicKey,
      space: MINT_SIZE,
      lamports: rentExemptBalance,
      programId: TOKEN_PROGRAM_ID,
    });

    const initializeMintInstruction = createInitializeMintInstruction(
      mintKeypair.publicKey,
      TOKEN_METADATA.decimals,
      payer, // Mint authority
      payer // Freeze authority
    );

    const associatedTokenAccount = await getAssociatedTokenAddress(
      mintKeypair.publicKey,
      payer
    );

    const associatedTokenAccountInstruction =
      createAssociatedTokenAccountInstruction(
        payer,
        associatedTokenAccount,
        payer,
        mintKeypair.publicKey
      );

    const totalSupply = TOKEN_METADATA.supply * 10 ** TOKEN_METADATA.decimals;

    const mintToInstruction = createMintToInstruction(
      mintKeypair.publicKey,
      associatedTokenAccount,
      payer,
      totalSupply
    );

    const transaction = new Transaction().add(
      createMintAccountInstruction,
      initializeMintInstruction,
      associatedTokenAccountInstruction,
      mintToInstruction
    );

    // Send transaction
    console.log('\nSending transaction...');
    const signature = await provider.sendAndConfirm(
      transaction,
      [mintKeypair], // Only the mint keypair needs to sign
      {
        commitment: 'confirmed',
      }
    );

    console.log('\n✅ Token created successfully!');
    console.log(`Transaction signature: ${signature}`);
    console.log(`Mint address: ${mintKeypair.publicKey.toString()}`);
    console.log(
      `Associated token account: ${associatedTokenAccount.toString()}`
    );

    // Verify the mint
    const mintInfo = await getMint(connection, mintKeypair.publicKey);
    console.log('\nMint verification:');
    console.log(`- Supply: ${mintInfo.supply.toString()}`);
    console.log(`- Decimals: ${mintInfo.decimals}`);
    console.log(`- Mint authority: ${mintInfo.mintAuthority?.toString()}`);
    console.log(`- Freeze authority: ${mintInfo.freezeAuthority?.toString()}`);

    // Verify the token account
    const tokenAccount = await getAccount(connection, associatedTokenAccount);
    console.log('\nToken account verification:');
    console.log(`- Owner: ${tokenAccount.owner.toString()}`);
    console.log(`- Balance: ${tokenAccount.amount.toString()}`);
    console.log(`- Mint: ${tokenAccount.mint.toString()}`);

    return {
      mintAddress: mintKeypair.publicKey.toString(),
      tokenAccount: associatedTokenAccount.toString(),
      signature,
    };
  } catch (error) {
    console.error('Error creating token:', error);
    throw error;
  }
}

export async function mintAdditionalTokens(
  mintAddress: string,
  recipientAddress: string,
  amount: number
) {
  try {
    const provider = AnchorProvider.env();
    const connection = provider.connection;
    const payer = provider.wallet.publicKey;

    const mintPubkey = new PublicKey(mintAddress);
    const recipientPubkey = new PublicKey(recipientAddress);

    const recipientTokenAccount = await getAssociatedTokenAddress(
      mintPubkey,
      recipientPubkey
    );

    try {
      await getAccount(connection, recipientTokenAccount);
    } catch {
      const createAccountInstruction = createAssociatedTokenAccountInstruction(
        payer,
        recipientTokenAccount,
        recipientPubkey,
        mintPubkey
      );

      const transaction = new Transaction().add(createAccountInstruction);
      await provider.sendAndConfirm(transaction, []);
    }

    const mintToInstruction = createMintToInstruction(
      mintPubkey,
      recipientTokenAccount,
      payer,
      amount * 10 ** TOKEN_METADATA.decimals
    );

    const transaction = new Transaction().add(mintToInstruction);
    const signature = await provider.sendAndConfirm(transaction, []);

    console.log(`✅ Minted ${amount} tokens to ${recipientAddress}`);
    console.log(`Transaction signature: ${signature}`);

    return signature;
  } catch (error) {
    console.error('Error minting additional tokens:', error);
    throw error;
  }
}

export async function getTokenBalance(
  mintAddress: string,
  ownerAddress: string
): Promise<number> {
  try {
    const provider = AnchorProvider.env();
    const connection = provider.connection;

    const mintPubkey = new PublicKey(mintAddress);
    const ownerPubkey = new PublicKey(ownerAddress);

    const tokenAccount = await getAssociatedTokenAddress(
      mintPubkey,
      ownerPubkey
    );
    console.log(TOKEN_METADATA);

    const accountInfo = await getAccount(connection, tokenAccount);
    const balance = Number(accountInfo.amount) / 10 ** TOKEN_METADATA.decimals;

    return balance;
  } catch (error) {
    console.error('Error getting token balance:', error);
    return 0;
  }
}

// createToken()
//   .then((result) => {
//     console.log('\n🎉 Token creation completed!');
//     console.log('Result:', result);
//   })
//   .catch((error) => {
//     console.error('Failed to create token:', error);
//     process.exit(1);
//   });

// getTokenBalance(
//   'FkrQEzph18Ljo9vjiEGaGmATndQ6XSQPQaNGMpv8G1zx',
//   AnchorProvider.env().wallet.publicKey.toString()
// )
//   .then((result) => {
//     console.log('\n🎉 Token creation completed!');
//     console.log('Result:', result);
//   })
//   .catch((error) => {
//     console.error('Failed to create token:', error);
//     process.exit(1);
//   });

const provider = AnchorProvider.env();
const program = new Program(idl as YieldApp, provider);
const strategies = await program.account.strategy.all();
console.log(`Found ${strategies.length} strategies:`);
for (const strategy of strategies) {
  console.log({
    publicKey: strategy.publicKey.toString(),
    account: {
      tokenAddress: strategy.account.tokenAddress.toString(),
      rewardApy: strategy.account.rewardApy.toNumber() / 100,
      account: strategy.account,
    },
  });
}
