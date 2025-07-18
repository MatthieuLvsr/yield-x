mod errors;
mod instructions;
mod state;

use anchor_lang::prelude::*;

use state::*;

declare_id!("QJvUCdXMYeX2yuYauzVGrtovcP7trePhd5y8jCi21yk");

#[program]
pub mod yield_app {
    use super::*;
    pub fn create_strategy(
        ctx: Context<CreateStrategy>,
        token_address: Pubkey,
        reward_apy: u64,
    ) -> Result<()> {
        instructions::create_strategy::create_strategy(ctx, token_address, reward_apy)
    }
    pub fn deposit(ctx: Context<Deposit>, amount: u64) -> Result<()> {
        instructions::deposit::deposit(ctx, amount)
    }
    pub fn redeem(ctx: Context<Redeem>, with_penalty: bool) -> Result<()> {
        instructions::redeem::redeem(ctx, with_penalty)
    }
    pub fn create_market(
        ctx: Context<CreateMarket>,
        fee_rate: u64,
    ) -> Result<()> {
        instructions::create_market::create_market(ctx, fee_rate)
    }
    
    pub fn place_order(
        ctx: Context<PlaceOrder>,
        order_type: OrderType,
        side: OrderSide,
        price: u64,
        quantity: u64,
        expires_in_seconds: i64,
    ) -> Result<()> {
        instructions::place_order::place_order(ctx, order_type, side, price, quantity, expires_in_seconds)
    }
}
