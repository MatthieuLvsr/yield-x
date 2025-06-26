use anchor_lang::prelude::*;

#[error_code]
pub enum CustomError {
    #[msg("Unauthorized")]
    Unauthorized,
    #[msg("Invalid timestamp")]
    InvalidTimestamp,
    #[msg("Yield token not matured yet")]
    NotMatured,
}
