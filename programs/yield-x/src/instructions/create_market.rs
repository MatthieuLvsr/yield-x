use anchor_lang::prelude::*;
use crate::state::{CreateMarket, CreateMarketEvent};

pub fn create_market(
    ctx: Context<CreateMarket>,
    fee_rate: u64,
) -> Result<()> {
    let market = &mut ctx.accounts.market;
    let strategy = &ctx.accounts.strategy;
    let clock = Clock::get()?;
    
    market.strategy_address = strategy.key();
    market.yield_token_mint = ctx.accounts.yield_token_mint.key();
    market.base_token_mint = ctx.accounts.base_token_mint.key();
    market.authority = ctx.accounts.authority.key();
    market.fee_rate = fee_rate;
    market.total_volume = 0;
    market.created_at = clock.unix_timestamp;

    emit!(CreateMarketEvent {
        market: market.key(),
        strategy: strategy.key(),
        yield_token_mint: market.yield_token_mint,
        base_token_mint: market.base_token_mint,
        timestamp: market.created_at,
    });

    Ok(())
}
