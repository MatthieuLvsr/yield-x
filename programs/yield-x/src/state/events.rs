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

#[event]
pub struct CreateMarketEvent {
    pub market: Pubkey,
    pub strategy: Pubkey,
    pub yield_token_mint: Pubkey,
    pub base_token_mint: Pubkey,
    pub timestamp: i64,
}

#[event]
pub struct PlaceOrderEvent {
    pub market: Pubkey,
    pub order: Pubkey,
    pub owner: Pubkey,
    pub side: String, // "Buy" or "Sell"
    pub price: u64,
    pub quantity: u64,
    pub timestamp: i64,
}

#[event]
pub struct ExecuteTradeEvent {
    pub market: Pubkey,
    pub buyer: Pubkey,
    pub seller: Pubkey,
    pub price: u64,
    pub quantity: u64,
    pub timestamp: i64,
}

#[event]
pub struct CancelOrderEvent {
    pub market: Pubkey,
    pub order: Pubkey,
    pub owner: Pubkey,
    pub timestamp: i64,
}
