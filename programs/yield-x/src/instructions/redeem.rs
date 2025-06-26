use anchor_lang::prelude::*;
use anchor_spl::token;
use crate::errors::CustomError;
use crate::state::*;

pub fn redeem(ctx: Context<Redeem>, with_penalty: bool) -> Result<()> {
    let deposit = &mut ctx.accounts.deposit;
    let strategy = &ctx.accounts.strategy;
    let clock = Clock::get()?;
    let now = clock.unix_timestamp;
    require_keys_eq!(
        deposit.user,
        ctx.accounts.signer.key(),
        CustomError::Unauthorized
    );
    let elapsed = now - deposit.date;
    require!(elapsed >= 0, CustomError::InvalidTimestamp);
    let apy = strategy.reward_apy as u128;
    let principal = deposit.montant as u128;
    let seconds_in_year = 31_536_000u128;
    let yield_amount = principal * apy * (elapsed as u128) / 100u128 / seconds_in_year;
    let mut total_to_return = principal + yield_amount;
    let matured = now >= deposit.maturity_date;
    if !matured {
        require!(with_penalty, CustomError::NotMatured);
        // Appliquer une pénalité de 10% sur le principal
        let penalty = total_to_return * 10 / 100;
        total_to_return = total_to_return.saturating_sub(penalty);
    }
    let seeds = &[
        b"strategy".as_ref(),
        &strategy.token_address.to_bytes(),
        &[ctx.bumps.strategy],
    ];
    token::burn(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            token::Burn {
                mint: ctx.accounts.yield_token_mint.to_account_info(),
                from: ctx.accounts.user_yield_token_account.to_account_info(),
                authority: ctx.accounts.signer.to_account_info(),
            },
            &[],
        ),
        deposit.montant_yield,
    )?;
    token::transfer(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            token::Transfer {
                from: ctx.accounts.strategy_token_account.to_account_info(),
                to: ctx.accounts.user_token_account.to_account_info(),
                authority: ctx.accounts.strategy.to_account_info(),
            },
            &[seeds],
        ),
        total_to_return as u64,
    )?;
    emit!(RedeemEvent {
        user: ctx.accounts.signer.key(),
        strategy: strategy.key(),
        amount_redeemed: total_to_return as u64,
        penalty_applied: !matured,
        timestamp: now,
    });
    Ok(())
}
