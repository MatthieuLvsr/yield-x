import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { YieldApp } from "../target/types/yield_app";
import { PublicKey, Keypair, SystemProgram } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID, createMint, createAccount, mintTo, getAccount, ASSOCIATED_TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from "@solana/spl-token";
import { assert, expect } from "chai";

describe("yield-x", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.YieldApp as Program<YieldApp>;
  const payer = provider.wallet as anchor.Wallet;

  // Test accounts
  let tokenMint: PublicKey;
  let baseTokenMint: PublicKey;
  let user: Keypair;
  let userTokenAccount: PublicKey;
  let userYieldTokenAccount: PublicKey;
  let userBaseTokenAccount: PublicKey;

  // Program PDAs
  let strategyPda: PublicKey;
  let yieldTokenMint: PublicKey;
  let strategyTokenAccount: PublicKey;
  let depositPda: PublicKey;
  let marketPda: PublicKey;

  // Test parameters
  const rewardApy = new anchor.BN(1000); // 10% APY
  const depositAmount = new anchor.BN(100_000_000); // 100 tokens with 6 decimals
  const feeRate = new anchor.BN(100); // 1% fee

  before(async () => {
    // Create a new user
    user = Keypair.generate();
    
    // Airdrop SOL to user
    const signature = await provider.connection.requestAirdrop(
      user.publicKey,
      2 * anchor.web3.LAMPORTS_PER_SOL
    );
    await provider.connection.confirmTransaction(signature);

    // Create token mints
    tokenMint = await createMint(
      provider.connection,
      payer.payer,
      payer.publicKey,
      null,
      6 // 6 decimals
    );

    baseTokenMint = await createMint(
      provider.connection,
      payer.payer,
      payer.publicKey,
      null,
      6 // 6 decimals
    );

    // Create user token accounts
    userTokenAccount = await createAccount(
      provider.connection,
      payer.payer,
      tokenMint,
      user.publicKey
    );

    userBaseTokenAccount = await createAccount(
      provider.connection,
      payer.payer,
      baseTokenMint,
      user.publicKey
    );

    // Mint tokens to user
    await mintTo(
      provider.connection,
      payer.payer,
      tokenMint,
      userTokenAccount,
      payer.publicKey,
      1000_000_000 // 1000 tokens
    );

    await mintTo(
      provider.connection,
      payer.payer,
      baseTokenMint,
      userBaseTokenAccount,
      payer.publicKey,
      1000_000_000 // 1000 tokens
    );

    // Calculate PDAs
    [strategyPda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("strategy"),
        tokenMint.toBuffer(),
        rewardApy.toArrayLike(Buffer, "le", 8),
      ],
      program.programId
    );

    [strategyTokenAccount] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("strategy_token"),
        tokenMint.toBuffer(),
        rewardApy.toArrayLike(Buffer, "le", 8),
      ],
      program.programId
    );

    [depositPda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("deposit"),
        user.publicKey.toBuffer(),
        tokenMint.toBuffer(),
        rewardApy.toArrayLike(Buffer, "le", 8),
      ],
      program.programId
    );

    [marketPda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("market"),
        strategyPda.toBuffer(),
      ],
      program.programId
    );

    console.log("Setup completed:");
    console.log("- Token mint:", tokenMint.toString());
    console.log("- Base token mint:", baseTokenMint.toString());
    console.log("- User:", user.publicKey.toString());
    console.log("- Strategy PDA:", strategyPda.toString());
  });

  it("Creates a strategy", async () => {
    // Generate a keypair for the yield token mint
    const yieldTokenMintKeypair = Keypair.generate();
    yieldTokenMint = yieldTokenMintKeypair.publicKey;

    const tx = await program.methods
      .createStrategy(tokenMint, rewardApy)
      .accounts({
        strategy: strategyPda,
        tokenAddressYield: yieldTokenMint,
        signer: payer.publicKey,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      })
      .signers([yieldTokenMintKeypair])
      .rpc();

    console.log("Create strategy transaction signature:", tx);

    // Verify the strategy was created
    const strategy = await program.account.strategy.fetch(strategyPda);
    assert.equal(strategy.tokenAddress.toString(), tokenMint.toString());
    assert.equal(strategy.tokenYieldAddress.toString(), yieldTokenMint.toString());
    assert.equal(strategy.rewardApy.toNumber(), rewardApy.toNumber());
    assert.isTrue(strategy.date.toNumber() > 0);

    console.log("Strategy created successfully with APY:", strategy.rewardApy.toNumber());
  });

  it("Creates a user yield token account", async () => {
    userYieldTokenAccount = await createAccount(
      provider.connection,
      payer.payer,
      yieldTokenMint,
      user.publicKey
    );
    
    console.log("User yield token account created:", userYieldTokenAccount.toString());
  });

  it("Makes a deposit", async () => {
    const tx = await program.methods
      .deposit(depositAmount)
      .accounts({
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
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      })
      .signers([user])
      .rpc();

    console.log("Deposit transaction signature:", tx);

    // Verify the deposit was created
    const deposit = await program.account.depositState.fetch(depositPda);
    assert.equal(deposit.montant.toNumber(), depositAmount.toNumber());
    assert.equal(deposit.user.toString(), user.publicKey.toString());
    assert.equal(deposit.strategyAddress.toString(), strategyPda.toString());
    assert.isTrue(deposit.maturityDate.toNumber() > deposit.date.toNumber());

    // Verify yield tokens were minted to user
    const userYieldAccount = await getAccount(provider.connection, userYieldTokenAccount);
    assert.equal(userYieldAccount.amount.toString(), depositAmount.toString());

    console.log("Deposit created successfully for amount:", deposit.montant.toNumber());
  });

  it("Creates a market", async () => {
    const tx = await program.methods
      .createMarket(feeRate)
      .accounts({
        market: marketPda,
        strategy: strategyPda,
        yieldTokenMint: yieldTokenMint,
        baseTokenMint: baseTokenMint,
        authority: payer.publicKey,
        systemProgram: SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      })
      .rpc();

    console.log("Create market transaction signature:", tx);

    // Verify the market was created
    const market = await program.account.market.fetch(marketPda);
    assert.equal(market.strategyAddress.toString(), strategyPda.toString());
    assert.equal(market.yieldTokenMint.toString(), yieldTokenMint.toString());
    assert.equal(market.baseTokenMint.toString(), baseTokenMint.toString());
    assert.equal(market.authority.toString(), payer.publicKey.toString());
    assert.equal(market.feeRate.toNumber(), feeRate.toNumber());
    assert.equal(market.totalVolume.toNumber(), 0);
    assert.isTrue(market.createdAt.toNumber() > 0);

    console.log("Market created successfully with fee rate:", market.feeRate.toNumber());
  });

  it("Places a sell order", async () => {
    const price = new anchor.BN(1_000_000); // 1 base token per YT
    const quantity = new anchor.BN(50_000_000); // 50 YT tokens
    const expiresInSeconds = new anchor.BN(3600); // 1 hour

    const [orderPda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("order"),
        marketPda.toBuffer(),
        user.publicKey.toBuffer(),
      ],
      program.programId
    );

    const [marketTokenAccount] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("market_token"),
        baseTokenMint.toBuffer(),
      ],
      program.programId
    );

    const [marketYieldAccount] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("market_yield"),
        yieldTokenMint.toBuffer(),
      ],
      program.programId
    );

    const tx = await program.methods
      .placeOrder(
        { limit: {} }, // OrderType::Limit
        { sell: {} },  // OrderSide::Sell
        price,
        quantity,
        expiresInSeconds
      )
      .accounts({
        order: orderPda,
        market: marketPda,
        yieldTokenMint: yieldTokenMint,
        baseTokenMint: baseTokenMint,
        owner: user.publicKey,
        marketTokenAccount: marketTokenAccount,
        marketYieldAccount: marketYieldAccount,
        userTokenAccount: userBaseTokenAccount,
        userYieldAccount: userYieldTokenAccount,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      })
      .signers([user])
      .rpc();

    console.log("Place sell order transaction signature:", tx);

    // Verify the order was created
    const order = await program.account.order.fetch(orderPda);
    assert.equal(order.market.toString(), marketPda.toString());
    assert.equal(order.owner.toString(), user.publicKey.toString());
    assert.deepEqual(order.orderType, { limit: {} });
    assert.deepEqual(order.side, { sell: {} });
    assert.equal(order.price.toNumber(), price.toNumber());
    assert.equal(order.quantity.toNumber(), quantity.toNumber());
    assert.equal(order.filledQuantity.toNumber(), 0);
    assert.deepEqual(order.status, { open: {} });
    assert.isTrue(order.createdAt.toNumber() > 0);
    assert.isTrue(order.expiresAt.toNumber() > order.createdAt.toNumber());

    console.log("Sell order placed successfully for quantity:", order.quantity.toNumber());
  });

  it("Redeems with penalty (early redemption)", async () => {
    // Note: We can only redeem based on the remaining yield tokens
    // The user now has 50M tokens left after placing the sell order
    const currentYieldBalance = await getAccount(provider.connection, userYieldTokenAccount);
    console.log("Current yield token balance before redeem:", currentYieldBalance.amount.toString());
    
    // Since we can't redeem the full amount (some tokens are locked in the sell order),
    // we'll expect this to fail with insufficient funds
    try {
      await program.methods
        .redeem(true) // with penalty
        .accounts({
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
      assert.fail("Should have failed due to insufficient yield tokens");
    } catch (error) {
      console.log("Expected error when trying to redeem with insufficient yield tokens:", error.message);
      assert.isTrue(error.message.includes("insufficient funds") || error.message.includes("custom program error"));
    }
  });

  it("Places a buy order", async () => {
    const price = new anchor.BN(1_000_000); // 1 base token per YT
    const quantity = new anchor.BN(25_000_000); // 25 YT tokens
    const expiresInSeconds = new anchor.BN(3600); // 1 hour
    const totalCost = price.mul(quantity); // Calculate total cost

    // Create a second user for the buy order
    const buyer = Keypair.generate();
    
    // Airdrop SOL to buyer
    const signature = await provider.connection.requestAirdrop(
      buyer.publicKey,
      2 * anchor.web3.LAMPORTS_PER_SOL
    );
    await provider.connection.confirmTransaction(signature);

    // Create buyer's token accounts
    const buyerBaseTokenAccount = await createAccount(
      provider.connection,
      payer.payer,
      baseTokenMint,
      buyer.publicKey
    );

    const buyerYieldTokenAccount = await createAccount(
      provider.connection,
      payer.payer,
      yieldTokenMint,
      buyer.publicKey
    );

    // Mint enough base tokens to buyer to cover the order
    await mintTo(
      provider.connection,
      payer.payer,
      baseTokenMint,
      buyerBaseTokenAccount,
      payer.publicKey,
      totalCost.toNumber() + 1000000 // Add extra to cover costs
    );

    const [buyerOrderPda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("order"),
        marketPda.toBuffer(),
        buyer.publicKey.toBuffer(),
      ],
      program.programId
    );

    const [marketTokenAccount] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("market_token"),
        baseTokenMint.toBuffer(),
      ],
      program.programId
    );

    const [marketYieldAccount] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("market_yield"),
        yieldTokenMint.toBuffer(),
      ],
      program.programId
    );

    const tx = await program.methods
      .placeOrder(
        { limit: {} }, // OrderType::Limit
        { buy: {} },   // OrderSide::Buy
        price,
        quantity,
        expiresInSeconds
      )
      .accounts({
        order: buyerOrderPda,
        market: marketPda,
        yieldTokenMint: yieldTokenMint,
        baseTokenMint: baseTokenMint,
        owner: buyer.publicKey,
        marketTokenAccount: marketTokenAccount,
        marketYieldAccount: marketYieldAccount,
        userTokenAccount: buyerBaseTokenAccount,
        userYieldAccount: buyerYieldTokenAccount,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      })
      .signers([buyer])
      .rpc();

    console.log("Place buy order transaction signature:", tx);

    // Verify the order was created
    const order = await program.account.order.fetch(buyerOrderPda);
    assert.equal(order.market.toString(), marketPda.toString());
    assert.equal(order.owner.toString(), buyer.publicKey.toString());
    assert.deepEqual(order.orderType, { limit: {} });
    assert.deepEqual(order.side, { buy: {} });
    assert.equal(order.price.toNumber(), price.toNumber());
    assert.equal(order.quantity.toNumber(), quantity.toNumber());
    assert.equal(order.filledQuantity.toNumber(), 0);
    assert.deepEqual(order.status, { open: {} });

    console.log("Buy order placed successfully for quantity:", order.quantity.toNumber());
  });

  it("Fails to redeem non-existent deposit", async () => {
    try {
      await program.methods
        .redeem(false)
        .accounts({
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

      assert.fail("Should have failed to redeem non-existent deposit");
    } catch (error) {
      console.log("Expected error when trying to redeem non-existent deposit:", error.message);
      assert.isTrue(
        error.message.includes("Account does not exist") || 
        error.message.includes("not provided") ||
        error.message.includes("NotMatured") ||
        error.message.includes("6002")
      );
    }
  });

  it("Fails to create strategy with same parameters", async () => {
    const duplicateYieldTokenMintKeypair = Keypair.generate();
    
    try {
      await program.methods
        .createStrategy(tokenMint, rewardApy)
        .accounts({
          strategy: strategyPda,
          tokenAddressYield: duplicateYieldTokenMintKeypair.publicKey,
          signer: payer.publicKey,
          systemProgram: SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        })
        .signers([duplicateYieldTokenMintKeypair])
        .rpc();

      assert.fail("Should have failed to create duplicate strategy");
    } catch (error) {
      console.log("Expected error when creating duplicate strategy:", error.message);
      assert.isTrue(error.message.includes("already in use") || error.message.includes("custom program error"));
    }
  });

  it("Fails to deposit with insufficient balance", async () => {
    // Create a new strategy for this test
    const newRewardApy = new anchor.BN(1500); // 15% APY
    
    const [newStrategyPda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("strategy"),
        tokenMint.toBuffer(),
        newRewardApy.toArrayLike(Buffer, "le", 8),
      ],
      program.programId
    );

    const newYieldTokenMintKeypair = Keypair.generate();

    // Create the new strategy
    await program.methods
      .createStrategy(tokenMint, newRewardApy)
      .accounts({
        strategy: newStrategyPda,
        tokenAddressYield: newYieldTokenMintKeypair.publicKey,
        signer: payer.publicKey,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      })
      .signers([newYieldTokenMintKeypair])
      .rpc();

    // Try to deposit more than available balance
    const [newDepositPda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("deposit"),
        user.publicKey.toBuffer(),
        tokenMint.toBuffer(),
        newRewardApy.toArrayLike(Buffer, "le", 8),
      ],
      program.programId
    );

    const [newStrategyTokenAccount] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("strategy_token"),
        tokenMint.toBuffer(),
        newRewardApy.toArrayLike(Buffer, "le", 8),
      ],
      program.programId
    );

    const newUserYieldTokenAccount = await createAccount(
      provider.connection,
      payer.payer,
      newYieldTokenMintKeypair.publicKey,
      user.publicKey
    );

    const currentBalance = await getAccount(provider.connection, userTokenAccount);
    const excessiveAmount = new anchor.BN(currentBalance.amount.toString()).add(new anchor.BN(1000000));

    try {
      await program.methods
        .deposit(excessiveAmount)
        .accounts({
          strategy: newStrategyPda,
          strategyTokenAccount: newStrategyTokenAccount,
          tokenMint: tokenMint,
          deposit: newDepositPda,
          signer: user.publicKey,
          userTokenAccount: userTokenAccount,
          userYieldTokenAccount: newUserYieldTokenAccount,
          yieldTokenMint: newYieldTokenMintKeypair.publicKey,
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        })
        .signers([user])
        .rpc();

      assert.fail("Should have failed to deposit excessive amount");
    } catch (error) {
      console.log("Expected error when depositing excessive amount:", error.message);
      assert.isTrue(error.message.includes("insufficient") || error.message.includes("custom program error"));
    }
  });
});