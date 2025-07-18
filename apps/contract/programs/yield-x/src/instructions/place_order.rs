use anchor_lang::prelude::*;
use anchor_spl::token::{transfer, Transfer};
use crate::errors::CustomError;
use crate::state::{OrderSide, OrderStatus, OrderType, PlaceOrder, PlaceOrderEvent};

pub fn place_order(
    ctx: Context<PlaceOrder>,
    order_type: OrderType,
    side: OrderSide,
    price: u64,
    quantity: u64,
    expires_in_seconds: i64,
) -> Result<()> {
    let order = &mut ctx.accounts.order;
    let market = &mut ctx.accounts.market;
    let clock = Clock::get()?;
    let now = clock.unix_timestamp;

    // Initialize order
    order.market = market.key();
    order.owner = ctx.accounts.owner.key();
    order.order_type = order_type;
    order.side = side.clone();
    order.price = price;
    order.quantity = quantity;
    order.filled_quantity = 0;
    order.status = OrderStatus::Open;
    order.created_at = now;
    order.expires_at = now + expires_in_seconds;

    // Transfer tokens to escrow based on order side
    match side {
        OrderSide::Sell => {
            // For sell orders, transfer YT tokens to escrow
            transfer(
                CpiContext::new(
                    ctx.accounts.token_program.to_account_info(),
                    Transfer {
                        from: ctx.accounts.user_yield_account.to_account_info(),
                        to: ctx.accounts.market_yield_account.to_account_info(),
                        authority: ctx.accounts.owner.to_account_info(),
                    },
                ),
                quantity,
            )?;
        }
        OrderSide::Buy => {
            // For buy orders, transfer base tokens to escrow
            let total_cost = price
                .checked_mul(quantity)
                .ok_or(CustomError::InvalidOrderParameters)?;
            transfer(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.user_token_account.to_account_info(),
                to: ctx.accounts.market_token_account.to_account_info(),
                authority: ctx.accounts.owner.to_account_info(),
            },
        ),
        total_cost,
    )?;
        }
    }

    let side_str = match side {
        OrderSide::Buy => "Buy".to_string(),
        OrderSide::Sell => "Sell".to_string(),
    };

    emit!(PlaceOrderEvent {
        market: market.key(),
        order: order.key(),
        owner: ctx.accounts.owner.key(),
        side: side_str,
        price,
        quantity,
        timestamp: now,
    });

    Ok(())
}
