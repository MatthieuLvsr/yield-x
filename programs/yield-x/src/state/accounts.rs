use anchor_lang::prelude::*;
use anchor_spl::token::{Mint, Token, TokenAccount};
use crate::state::{DepositState, Strategy};

#[derive(Accounts)]
#[instruction(token_address: Pubkey, reward_apy: u64)]
pub struct CreateStrategy<'info> {
    #[account(
        init,
        payer = signer,
        space = 8 + 32 + 32 + 8 + 8,
        seeds = [b"strategy", token_address.key().as_ref()],
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
        seeds = [b"strategy", &strategy.token_address.to_bytes()],
        bump,
    )]
    pub strategy: Account<'info, Strategy>,
    #[account(
        init_if_needed,
        payer = signer,
        token::mint = token_mint,
        token::authority = strategy,
        seeds = [b"strategy_token", strategy.token_address.as_ref()],
        bump,
    )]
    pub strategy_token_account: Account<'info, TokenAccount>,
    #[account()]
    pub token_mint: Account<'info, Mint>,
    #[account(
        init,
        payer = signer,
        space = 8 + 8 + 8 + 32 + 32 + 8,
        seeds = [b"deposit", signer.key().as_ref(), strategy.token_address.as_ref()],
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
        seeds = [b"strategy", &strategy.token_address.to_bytes()],
        bump,
    )]
    pub strategy: Account<'info, Strategy>,
    #[account(
        mut,
        seeds = [b"strategy_token", strategy.token_address.as_ref()],
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
        seeds = [b"deposit", signer.key().as_ref(), strategy.token_address.as_ref()],
        bump,
    )]
    pub deposit: Account<'info, DepositState>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub token_program: Program<'info, Token>,
}
