use anchor_lang::prelude::*;

#[account]
pub struct Market {
    pub strategy_address: Pubkey,
    pub yield_token_mint: Pubkey,
    pub base_token_mint: Pubkey, // SOL or USDC
    pub authority: Pubkey,
    pub fee_rate: u64, // Fee in basis points (100 = 1%)
    pub total_volume: u64,
    pub created_at: i64,
}

#[account]
#[derive(InitSpace)]
pub struct Order {
    pub market: Pubkey,
    pub owner: Pubkey,
    pub order_type: OrderType,
    pub side: OrderSide,
    pub price: u64,    // Price in base token units
    pub quantity: u64, // Quantity of YT tokens
    pub filled_quantity: u64,
    pub status: OrderStatus,
    pub created_at: i64,
    pub expires_at: i64,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq, InitSpace)]
pub enum OrderType {
    Market,
    Limit,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq, InitSpace)]
pub enum OrderSide {
    Buy,
    Sell,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq, InitSpace)]
pub enum OrderStatus {
    Open,
    PartiallyFilled,
    Filled,
    Cancelled,
    Expired,
}

#[account]
pub struct Trade {
    pub market: Pubkey,
    pub buyer: Pubkey,
    pub seller: Pubkey,
    pub price: u64,
    pub quantity: u64,
    pub timestamp: i64,
}
