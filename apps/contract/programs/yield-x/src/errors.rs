use anchor_lang::prelude::*;

#[error_code]
pub enum CustomError {
    #[msg("Unauthorized")]
    Unauthorized,
    #[msg("Invalid timestamp")]
    InvalidTimestamp,
    #[msg("Yield token not matured yet")]
    NotMatured,
    #[msg("Invalid order parameters")]
    InvalidOrderParameters,
    #[msg("Orders cannot be matched")]
    OrdersCannotBeMatched,
    #[msg("Order not cancellable")]
    OrderNotCancellable,
    #[msg("Insufficient liquidity")]
    InsufficientLiquidity,
    #[msg("Market already exists")]
    MarketAlreadyExists,
}
