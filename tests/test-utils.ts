import type { Program } from "@coral-xyz/anchor";
import * as anchor from "@coral-xyz/anchor";
import {
  createAccount,
  createMint,
  mintTo,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import {
  type Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
} from "@solana/web3.js";
import type { YieldApp } from "../target/types/yield_app";

// Test configuration constants
const testConfig = {
  testAccounts: {
    fundingAmount: 5000000000,
    testUsers: 3,
  },
  testData: {
    defaultAPY: 1000,
    defaultDepositAmount: 1000000,
    defaultMarketFeeRate: 250,
    testTokenDecimals: 6,
    testTokenSupply: 10000000000,
  },
  validation: {
    minimumAPY: 100,
    maximumAPY: 10000,
    minimumDepositAmount: 1000,
    maximumDepositAmount: 1000000000000,
    penaltyPercentage: 10,
  },
  logging: {
    level: "info",
    enableTransactionLogs: true,
    enableAccountLogs: false,
    enablePerformanceLogs: true,
  },
};

export class TestUtils {
  private static instance: TestUtils;
  public program: Program<YieldApp>;
  public connection: Connection;
  public provider: anchor.AnchorProvider;
  public wallet: anchor.AnchorProvider["wallet"];

  private constructor() {
    this.provider = anchor.AnchorProvider.env();
    anchor.setProvider(this.provider);
    this.program = anchor.workspace.YieldApp as Program<YieldApp>;
    this.connection = this.provider.connection;
    this.wallet = this.provider.wallet;
  }

  public static getInstance(): TestUtils {
    if (!TestUtils.instance) {
      TestUtils.instance = new TestUtils();
    }
    return TestUtils.instance;
  }

  /**
   * Fund a user with SOL for testing
   */
  public async fundUser(
    publicKey: PublicKey,
    amount: number = testConfig.testAccounts.fundingAmount
  ): Promise<void> {
    const signature = await this.connection.requestAirdrop(publicKey, amount);
    await this.connection.confirmTransaction(signature);
  }

  /**
   * Create a test token mint with specified decimals
   */
  public async createTestToken(
    decimals: number = testConfig.testData.testTokenDecimals
  ): Promise<PublicKey> {
    if (!this.wallet.payer) {
      throw new Error("Wallet payer is not available");
    }
    return await createMint(
      this.connection,
      this.wallet.payer,
      this.wallet.publicKey,
      null,
      decimals
    );
  }

  /**
   * Create a token account for a user
   */
  public async createTokenAccount(
    tokenMint: PublicKey,
    owner: PublicKey
  ): Promise<PublicKey> {
    if (!this.wallet.payer) {
      throw new Error("Wallet payer is not available");
    }
    return await createAccount(
      this.connection,
      this.wallet.payer,
      tokenMint,
      owner
    );
  }

  /**
   * Mint tokens to a user account
   */
  public async mintTokensToUser(
    tokenMint: PublicKey,
    userTokenAccount: PublicKey,
    amount: number = testConfig.testData.testTokenSupply
  ): Promise<void> {
    if (!this.wallet.payer) {
      throw new Error("Wallet payer is not available");
    }
    await mintTo(
      this.connection,
      this.wallet.payer,
      tokenMint,
      userTokenAccount,
      this.wallet.publicKey,
      amount
    );
  }

  /**
   * Get strategy PDA for a given token mint
   */
  public getStrategyPDA(tokenMint: PublicKey): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
      [Buffer.from("strategy"), tokenMint.toBuffer()],
      this.program.programId
    );
  }

  /**
   * Get deposit PDA for a user and token mint
   */
  public getDepositPDA(
    userPublicKey: PublicKey,
    tokenMint: PublicKey
  ): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
      [Buffer.from("deposit"), userPublicKey.toBuffer(), tokenMint.toBuffer()],
      this.program.programId
    );
  }

  /**
   * Get strategy token account PDA
   */
  public getStrategyTokenAccountPDA(tokenMint: PublicKey): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
      [Buffer.from("strategy_token"), tokenMint.toBuffer()],
      this.program.programId
    );
  }

  /**
   * Get market PDA for a token mint
   */
  public getMarketPDA(tokenMint: PublicKey): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
      [Buffer.from("market"), tokenMint.toBuffer()],
      this.program.programId
    );
  }

  /**
   * Get order PDA for a user and token mint
   */
  public getOrderPDA(
    userPublicKey: PublicKey,
    tokenMint: PublicKey
  ): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
      [Buffer.from("order"), userPublicKey.toBuffer(), tokenMint.toBuffer()],
      this.program.programId
    );
  }

  /**
   * Create a complete test strategy
   */
  public async createTestStrategy(
    tokenMint: PublicKey,
    apy: number = testConfig.testData.defaultAPY
  ): Promise<{
    strategyPda: PublicKey;
    yieldTokenMint: Keypair;
    transactionSignature: string;
  }> {
    const yieldTokenMint = Keypair.generate();
    const [strategyPda] = this.getStrategyPDA(tokenMint);

    const tx = await this.program.methods
      .createStrategy(tokenMint, new anchor.BN(apy))
      .accountsPartial({
        tokenAddressYield: yieldTokenMint.publicKey,
        signer: this.wallet.publicKey,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        rent: SYSVAR_RENT_PUBKEY,
      })
      .signers([yieldTokenMint])
      .rpc();

    return {
      strategyPda,
      yieldTokenMint,
      transactionSignature: tx,
    };
  }

  /**
   * Create a complete test user with tokens
   */
  public async createTestUser(
    tokenMint: PublicKey,
    yieldTokenMint: PublicKey,
    tokenAmount: number = testConfig.testData.testTokenSupply
  ): Promise<{
    user: Keypair;
    userTokenAccount: PublicKey;
    userYieldTokenAccount: PublicKey;
  }> {
    const user = Keypair.generate();

    // Fund user with SOL
    await this.fundUser(user.publicKey);

    // Create token accounts
    const userTokenAccount = await this.createTokenAccount(
      tokenMint,
      user.publicKey
    );
    const userYieldTokenAccount = await this.createTokenAccount(
      yieldTokenMint,
      user.publicKey
    );

    // Mint tokens to user
    await this.mintTokensToUser(tokenMint, userTokenAccount, tokenAmount);

    return {
      user,
      userTokenAccount,
      userYieldTokenAccount,
    };
  }

  /**
   * Perform a complete deposit operation
   */
  public async performDeposit(
    user: Keypair,
    userTokenAccount: PublicKey,
    userYieldTokenAccount: PublicKey,
    strategyPda: PublicKey,
    yieldTokenMint: PublicKey,
    tokenMint: PublicKey,
    amount: number = testConfig.testData.defaultDepositAmount
  ): Promise<{
    transactionSignature: string;
    depositPda: PublicKey;
  }> {
    const [depositPda] = this.getDepositPDA(user.publicKey, tokenMint);
    const [strategyTokenAccount] = this.getStrategyTokenAccountPDA(tokenMint);

    const tx = await this.program.methods
      .deposit(new anchor.BN(amount))
      .accountsPartial({
        strategy: strategyPda,
        strategyTokenAccount: strategyTokenAccount,
        tokenMint: tokenMint,
        deposit: depositPda,
        signer: user.publicKey,
        userTokenAccount: userTokenAccount,
        userYieldTokenAccount: userYieldTokenAccount,
        yieldTokenMint: yieldTokenMint,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
        rent: SYSVAR_RENT_PUBKEY,
      })
      .signers([user])
      .rpc();

    return {
      transactionSignature: tx,
      depositPda,
    };
  }

  /**
   * Perform a complete redeem operation
   */
  public async performRedeem(
    user: Keypair,
    userTokenAccount: PublicKey,
    userYieldTokenAccount: PublicKey,
    strategyPda: PublicKey,
    yieldTokenMint: PublicKey,
    tokenMint: PublicKey,
    depositPda: PublicKey,
    withPenalty: boolean = false
  ): Promise<string> {
    const [strategyTokenAccount] = this.getStrategyTokenAccountPDA(tokenMint);

    const tx = await this.program.methods
      .redeem(withPenalty)
      .accountsPartial({
        strategy: strategyPda,
        strategyTokenAccount: strategyTokenAccount,
        userTokenAccount: userTokenAccount,
        userYieldTokenAccount: userYieldTokenAccount,
        yieldTokenMint: yieldTokenMint,
        deposit: depositPda,
        signer: user.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([user])
      .rpc();

    return tx;
  }

  /**
   * Get token account balance
   */
  public async getTokenBalance(tokenAccount: PublicKey): Promise<number> {
    const balance = await this.connection.getTokenAccountBalance(tokenAccount);
    return parseInt(balance.value.amount);
  }

  /**
   * Wait for a specific amount of time
   */
  public async wait(milliseconds: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  }

  /**
   * Calculate expected rewards based on APY and time
   */
  public calculateExpectedRewards(
    principal: number,
    apy: number,
    timeElapsedSeconds: number
  ): number {
    const annualRate = apy / 10000; // APY is in basis points
    const timeElapsedYears = timeElapsedSeconds / (365 * 24 * 60 * 60);
    return Math.floor(principal * annualRate * timeElapsedYears);
  }

  /**
   * Calculate penalty amount
   */
  public calculatePenalty(
    amount: number,
    penaltyPercentage: number = testConfig.validation.penaltyPercentage
  ): number {
    return Math.floor((amount * penaltyPercentage) / 100);
  }

  /**
   * Validate account exists and has expected data
   */
  public async validateAccount(accountAddress: PublicKey): Promise<boolean> {
    const accountInfo = await this.connection.getAccountInfo(accountAddress);
    return accountInfo !== null;
  }

  /**
   * Get current timestamp
   */
  public getCurrentTimestamp(): number {
    return Math.floor(Date.now() / 1000);
  }

  /**
   * Format public key for display
   */
  public formatPublicKey(publicKey: PublicKey): string {
    const str = publicKey.toString();
    return `${str.substring(0, 8)}...${str.substring(str.length - 8)}`;
  }

  /**
   * Log test information
   */
  public log(message: string, level: string = "info"): void {
    if (testConfig.logging.level === "debug" || level === "error") {
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] [${level.toUpperCase()}] ${message}`);
    }
  }

  /**
   * Get test configuration
   */
  public getConfig(): typeof testConfig {
    return testConfig;
  }
}

export default TestUtils;
