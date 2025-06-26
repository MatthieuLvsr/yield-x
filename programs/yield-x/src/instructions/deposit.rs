use anchor_lang::prelude::*;
use anchor_spl::token::{mint_to, transfer, MintTo, Transfer};
use crate::state::{Deposit, DepositEvent};

pub fn deposit(ctx: Context<Deposit>, amount: u64) -> Result<()> {
    let deposit = &mut ctx.accounts.deposit;
    let strategy = &ctx.accounts.strategy;
    let clock = Clock::get()?;
    let now = clock.unix_timestamp;
    deposit.montant = amount;
    deposit.user = ctx.accounts.signer.key();
    deposit.strategy_address = strategy.key();
    deposit.date = now;
    deposit.maturity_date = now + 30 * 24 * 60 * 60; // maturité à 30 jours
    deposit.montant_yield = amount;
    emit!(DepositEvent {
        user: ctx.accounts.signer.key(),
        strategy: strategy.key(),
        amount,
        maturity_date: deposit.maturity_date,
    });
    transfer(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.user_token_account.to_account_info(),
                to: ctx.accounts.strategy_token_account.to_account_info(),
                authority: ctx.accounts.signer.to_account_info(),
            },
        ),
        amount,
    )?;
    let seeds = &[
        b"strategy".as_ref(),
        &ctx.accounts.strategy.token_address.to_bytes(),
        &[ctx.bumps.strategy],
    ];
    mint_to(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            MintTo {
                mint: ctx.accounts.yield_token_mint.to_account_info(),
                to: ctx.accounts.user_yield_token_account.to_account_info(),
                authority: ctx.accounts.strategy.to_account_info(),
            },
            &[seeds],
        ),
        amount,
    )?;
    Ok(())
}
