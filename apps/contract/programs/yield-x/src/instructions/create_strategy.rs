use anchor_lang::prelude::*;
use crate::state::{CreateStrategy, CreateStrategyEvent};

pub fn create_strategy(
    ctx: Context<CreateStrategy>,
    token_address: Pubkey,
    reward_apy: u64,
) -> Result<()> {
    let strategy = &mut ctx.accounts.strategy;
    strategy.reward_apy = reward_apy;
    strategy.token_address = token_address;
    strategy.token_yield_address = ctx.accounts.token_address_yield.key();
    let clock: Clock = Clock::get()?;
    strategy.date = clock.unix_timestamp;
    emit!(CreateStrategyEvent {
        strategy: strategy.key(),
        token_address,
        apy: reward_apy,
        timestamp: strategy.date,
    });
    Ok(())
}
