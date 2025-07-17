use anchor_lang::prelude::*;

#[account]
pub struct DepositState {
    pub montant: u64,
    pub montant_yield: u64,
    pub user: Pubkey,
    pub strategy_address: Pubkey,
    pub date: i64,
    pub maturity_date: i64, // timestamp de maturité
}
