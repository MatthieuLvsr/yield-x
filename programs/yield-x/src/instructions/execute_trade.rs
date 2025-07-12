use anchor_lang::prelude::*;
use anchor_spl::token::{transfer, Transfer};
use crate::state::{ExecuteTrade, ExecuteTradeEvent, OrderStatus, OrderSide};
use crate::errors::CustomError;

pub fn execute_trade(
    ctx: Context<ExecuteTrade>,
    trade_quantity: u64,
) -> Result<()> {
    let market = &mut ctx.accounts.market;
    let buy_order = &mut ctx.accounts.buy_order;
    let sell_order = &mut ctx.accounts.sell_order;
    let clock = Clock::get()?;
    let now = clock.unix_timestamp;

    // Validate orders can be matched
    require!(
        buy_order.side == OrderSide::Buy && sell_order.side == OrderSide::Sell,
        CustomError::OrdersCannotBeMatched
    );
    require!(
        buy_order.price >= sell_order.price,
        CustomError::OrdersCannotBeMatched
    );
    require!(
        buy_order.status == OrderStatus::Open || buy_order.status == OrderStatus::PartiallyFilled,
        CustomError::OrdersCannotBeMatched
    );
    require!(
        sell_order.status == OrderStatus::Open || sell_order.status == OrderStatus::PartiallyFilled,
        CustomError::OrdersCannotBeMatched
    );

    // Calculate trade details
    let max_buy_quantity = buy_order.quantity - buy_order.filled_quantity;
    let max_sell_quantity = sell_order.quantity - sell_order.filled_quantity;
    let actual_quantity = trade_quantity.min(max_buy_quantity).min(max_sell_quantity);
    
    require!(actual_quantity > 0, CustomError::InsufficientLiquidity);

    let trade_price = sell_order.price; // Price taker (sell order) determines price
    let total_cost = trade_price.checked_mul(actual_quantity)
        .ok_or(CustomError::InvalidOrderParameters)?;

    // Calculate market fees
    let fee_amount = total_cost.checked_mul(market.fee_rate)
        .ok_or(CustomError::InvalidOrderParameters)?
        .checked_div(10000) // fee_rate is in basis points
        .ok_or(CustomError::InvalidOrderParameters)?;
    
    let net_amount = total_cost.checked_sub(fee_amount)
        .ok_or(CustomError::InvalidOrderParameters)?;

    // Transfer YT tokens from seller escrow to buyer
    transfer(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.escrow_yt_account.to_account_info(),
                to: ctx.accounts.buyer_yt_account.to_account_info(),
                authority: market.to_account_info(), // Market authority signs
            },
        ),
        actual_quantity,
    )?;

    // Transfer base tokens from buyer escrow to seller
    transfer(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Transfer {
                from: ctx.accounts.escrow_base_account.to_account_info(),
                to: ctx.accounts.seller_base_account.to_account_info(),
                authority: market.to_account_info(), // Market authority signs
            },
        ),
        net_amount,
    )?;

    // Update order states
    buy_order.filled_quantity += actual_quantity;
    sell_order.filled_quantity += actual_quantity;

    // Update order statuses
    if buy_order.filled_quantity >= buy_order.quantity {
        buy_order.status = OrderStatus::Filled;
    } else {
        buy_order.status = OrderStatus::PartiallyFilled;
    }

    if sell_order.filled_quantity >= sell_order.quantity {
        sell_order.status = OrderStatus::Filled;
    } else {
        sell_order.status = OrderStatus::PartiallyFilled;
    }

    // Update market volume
    market.total_volume += total_cost;

    emit!(ExecuteTradeEvent {
        market: market.key(),
        buyer: buy_order.owner,
        seller: sell_order.owner,
        price: trade_price,
        quantity: actual_quantity,
        timestamp: now,
    });

    Ok(())
}
