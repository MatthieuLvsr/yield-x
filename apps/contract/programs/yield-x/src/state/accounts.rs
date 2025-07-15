use crate::state::{DepositState, Strategy, Market, Order, OrderType, OrderSide};
use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token, TokenAccount};

#[derive(Accounts)]
#[instruction(token_address: Pubkey, reward_apy: u64)]
pub struct CreateStrategy<'info> {
    #[account(
        init,
        payer = signer,
        space = 8 + 32 + 32 + 8 + 8,
        seeds = [b"strategy", token_address.key().as_ref(), &reward_apy.to_le_bytes()],
        bump
    )]
    pub strategy: Account<'info, Strategy>,
    #[account(
        init,
        payer = signer,
        mint::decimals = 6,
        mint::authority = strategy
    )]
    pub token_address_yield: Account<'info, Mint>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
#[instruction(amount: u64)]
pub struct Deposit<'info> {
    #[account(
        mut,
        seeds = [b"strategy", strategy.token_address.key().as_ref(), &strategy.reward_apy.to_le_bytes()],
        bump,
    )]
    pub strategy: Account<'info, Strategy>,
    #[account(
        init_if_needed,
        payer = signer,
        token::mint = token_mint,
        token::authority = strategy,
        seeds = [b"strategy_token", strategy.token_address.key().as_ref(), &strategy.reward_apy.to_le_bytes()],
        bump,
    )]
    pub strategy_token_account: Account<'info, TokenAccount>,
    #[account()]
    pub token_mint: Account<'info, Mint>,
    #[account(
        init,
        payer = signer,
        space = 8 + 8 + 8 + 32 + 32 + 8 + 8,
        seeds = [b"deposit", signer.key().as_ref(), strategy.token_address.key().as_ref(), &strategy.reward_apy.to_le_bytes()],
        bump
    )]
    pub deposit: Account<'info, DepositState>,
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(mut)]
    pub user_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub user_yield_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub yield_token_mint: Account<'info, Mint>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct Redeem<'info> {
    #[account(
        mut,
        seeds = [b"strategy", strategy.token_address.key().as_ref(), &strategy.reward_apy.to_le_bytes()],
        bump,
    )]
    pub strategy: Account<'info, Strategy>,
    #[account(
        mut,
        seeds = [b"strategy_token", strategy.token_address.key().as_ref(), &strategy.reward_apy.to_le_bytes()],
        bump,
    )]
    pub strategy_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub user_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub user_yield_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub yield_token_mint: Account<'info, Mint>,
    #[account(
        mut,
        seeds = [b"deposit", signer.key().as_ref(), strategy.token_address.key().as_ref(), &strategy.reward_apy.to_le_bytes()],
        bump,
        close = signer
    )]
    pub deposit: Account<'info, DepositState>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct CreateMarket<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + std::mem::size_of::<Market>(),
        seeds = [b"market", strategy.key().as_ref()],
        bump
    )]
    pub market: Account<'info, Market>,
    
    #[account(constraint = strategy.key() != Pubkey::default())]
    pub strategy: Account<'info, Strategy>,
    
    /// CHECK: This is the yield token mint for the strategy
    pub yield_token_mint: AccountInfo<'info>,
    
    /// CHECK: This is the base token mint (SOL or USDC)
    pub base_token_mint: AccountInfo<'info>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
#[instruction(order_type: OrderType, side: OrderSide, price: u64, quantity: u64, expires_in_seconds: i64)]
pub struct PlaceOrder<'info> {
    #[account(
        init,
        payer = owner,
        space = 8 + std::mem::size_of::<Order>(),
        seeds = [b"order", market.key().as_ref(), owner.key().as_ref()],
        bump
    )]
    pub order: Account<'info, Order>,
    
    #[account(mut)]
    pub market: Account<'info, Market>,
    
    #[account(mut)]
    pub owner: Signer<'info>,
    
    /// CHECK: This is the owner's token account for the asset being traded
    #[account(mut)]
    pub owner_token_account: AccountInfo<'info>,
    
    /// CHECK: This is the escrow token account managed by the market
    #[account(mut)]
    pub escrow_token_account: AccountInfo<'info>,
    
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct ExecuteTrade<'info> {
    #[account(mut)]
    pub market: Account<'info, Market>,
    
    #[account(mut)]
    pub buy_order: Account<'info, Order>,
    
    #[account(mut)]
    pub sell_order: Account<'info, Order>,
    
    /// CHECK: Buyer's YT token account - validated through program logic
    #[account(mut)]
    pub buyer_yt_account: AccountInfo<'info>,
    
    /// CHECK: Buyer's base token account - validated through program logic
    #[account(mut)]
    pub buyer_base_account: AccountInfo<'info>,
    
    /// CHECK: Seller's YT token account - validated through program logic
    #[account(mut)]
    pub seller_yt_account: AccountInfo<'info>,
    
    /// CHECK: Seller's base token account - validated through program logic
    #[account(mut)]
    pub seller_base_account: AccountInfo<'info>,
    
    /// CHECK: Escrow YT token account - validated through program logic
    #[account(mut)]
    pub escrow_yt_account: AccountInfo<'info>,
    
    /// CHECK: Escrow base token account - validated through program logic
    #[account(mut)]
    pub escrow_base_account: AccountInfo<'info>,
    
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CancelOrder<'info> {
    #[account(mut)]
    pub market: Account<'info, Market>,
    
    #[account(
        mut,
        constraint = order.owner == owner.key(),
        close = owner
    )]
    pub order: Account<'info, Order>,
    
    #[account(mut)]
    pub owner: Signer<'info>,
    
    /// CHECK: This is the owner's token account for receiving back funds
    #[account(mut)]
    pub owner_token_account: AccountInfo<'info>,
    
    /// CHECK: This is the escrow token account managed by the market
    #[account(mut)]
    pub escrow_token_account: AccountInfo<'info>,
    
    pub token_program: Program<'info, Token>,
}
