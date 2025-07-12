mod errors;
mod instructions;
mod state;

use anchor_lang::prelude::*;

use state::*;

declare_id!("5AgAdfDBk9664vxvSVXLcBHMYV7sT6N6gKVbt1iE5Q7K");

#[program]
pub mod yield_app {
    use super::*;
    
    // Original yield farming instructions
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
    
    // Marketplace instructions for YT trading
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
    
    pub fn execute_trade(
        ctx: Context<ExecuteTrade>,
        trade_quantity: u64,
    ) -> Result<()> {
        instructions::execute_trade::execute_trade(ctx, trade_quantity)
    }
    
    pub fn cancel_order(ctx: Context<CancelOrder>) -> Result<()> {
        instructions::cancel_order::cancel_order(ctx)
    }
}
