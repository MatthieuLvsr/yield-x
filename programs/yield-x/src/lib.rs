mod errors;
mod instructions;
mod state;

use anchor_lang::prelude::*;

use state::*;

declare_id!("4vjdLHMEk7ywaHUMoen37337vqN86cKhxoXAFRvAYveA");

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
}
