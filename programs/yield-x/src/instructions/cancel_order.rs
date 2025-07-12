use anchor_lang::prelude::*;
use anchor_spl::token::{transfer, Transfer};
use crate::state::{CancelOrder, CancelOrderEvent, OrderStatus, OrderSide};
use crate::errors::CustomError;

pub fn cancel_order(ctx: Context<CancelOrder>) -> Result<()> {
    let order = &mut ctx.accounts.order;
    let market = &ctx.accounts.market;
    let clock = Clock::get()?;
    let now = clock.unix_timestamp;

    // Check order can be cancelled
    require!(
        order.status == OrderStatus::Open || order.status == OrderStatus::PartiallyFilled,
        CustomError::OrderNotCancellable
    );

    // Calculate remaining quantity and return tokens to owner
    let remaining_quantity = order.quantity - order.filled_quantity;
    
    if remaining_quantity > 0 {
        match order.side {
            OrderSide::Sell => {
                // Return remaining YT tokens to owner
                transfer(
                    CpiContext::new(
                        ctx.accounts.token_program.to_account_info(),
                        Transfer {
                            from: ctx.accounts.escrow_token_account.to_account_info(),
                            to: ctx.accounts.owner_token_account.to_account_info(),
                            authority: market.to_account_info(), // Market authority signs
                        },
                    ),
                    remaining_quantity,
                )?;
            }
            OrderSide::Buy => {
                // Return remaining base tokens to owner
                let remaining_cost = order.price.checked_mul(remaining_quantity)
                    .ok_or(CustomError::InvalidOrderParameters)?;
                transfer(
                    CpiContext::new(
                        ctx.accounts.token_program.to_account_info(),
                        Transfer {
                            from: ctx.accounts.escrow_token_account.to_account_info(),
                            to: ctx.accounts.owner_token_account.to_account_info(),
                            authority: market.to_account_info(), // Market authority signs
                        },
                    ),
                    remaining_cost,
                )?;
            }
        }
    }

    // Update order status
    order.status = OrderStatus::Cancelled;

    emit!(CancelOrderEvent {
        market: market.key(),
        order: order.key(),
        owner: ctx.accounts.owner.key(),
        timestamp: now,
    });

    Ok(())
}
