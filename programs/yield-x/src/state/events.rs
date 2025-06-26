use anchor_lang::prelude::*;

#[event]
pub struct DepositEvent {
    pub user: Pubkey,
    pub strategy: Pubkey,
    pub amount: u64,
    pub maturity_date: i64,
}

#[event]
pub struct RedeemEvent {
    pub user: Pubkey,
    pub strategy: Pubkey,
    pub amount_redeemed: u64,
    pub penalty_applied: bool,
    pub timestamp: i64,
}

#[event]
pub struct CreateStrategyEvent {
    pub strategy: Pubkey,
    pub token_address: Pubkey,
    pub apy: u64,
    pub timestamp: i64,
}
