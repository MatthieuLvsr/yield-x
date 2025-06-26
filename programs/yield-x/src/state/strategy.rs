use anchor_lang::prelude::*;

#[account]
pub struct Strategy {
    pub token_address: Pubkey,
    pub token_yield_address: Pubkey,
    pub date: i64,
    pub reward_apy: u64,
}
