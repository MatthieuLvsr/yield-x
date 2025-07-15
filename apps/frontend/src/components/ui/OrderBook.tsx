"use client";

import { motion } from "framer-motion";
import React from "react";

interface OrderBookEntry {
  price: number;
  quantity: number;
  total: number;
}

interface OrderBookProps {
  symbol: string;
  buyOrders: OrderBookEntry[];
  sellOrders: OrderBookEntry[];
}

const OrderBook: React.FC<OrderBookProps> = ({
  symbol,
  buyOrders,
  sellOrders,
}) => {
  const formatPrice = (price: number) => `$${price.toFixed(3)}`;
  const formatQuantity = (quantity: number) => `${quantity.toFixed(2)}`;

  return (
    <div className="glass-card p-6 rounded-3xl border border-white/10 backdrop-blur-xl">
      <h4 className="text-xl font-bold text-white mb-6">
        Order Book - {symbol}
      </h4>

      <div className="space-y-6">
        {/* Sell Orders */}
        <div>
          <h5 className="text-red-400 font-medium mb-3">Sell Orders</h5>
          <div className="space-y-2">
            <div className="grid grid-cols-3 gap-4 text-sm text-white/60 pb-2 border-b border-white/10">
              <span>Price</span>
              <span>Quantity</span>
              <span>Total</span>
            </div>
            {sellOrders.slice(0, 5).map((order, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="grid grid-cols-3 gap-4 text-sm hover:bg-red-500/10 p-2 rounded-lg transition-colors duration-200"
              >
                <span className="text-red-400 font-medium">
                  {formatPrice(order.price)}
                </span>
                <span className="text-white/80">
                  {formatQuantity(order.quantity)}
                </span>
                <span className="text-white/60">
                  {formatPrice(order.total)}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Current Price */}
        <div className="text-center py-4 border-y border-white/10">
          <div className="text-white font-bold text-lg">
            {formatPrice(buyOrders[0]?.price || 0)}
          </div>
          <div className="text-white/60 text-sm">Current Price</div>
        </div>

        {/* Buy Orders */}
        <div>
          <h5 className="text-green-400 font-medium mb-3">Buy Orders</h5>
          <div className="space-y-2">
            <div className="grid grid-cols-3 gap-4 text-sm text-white/60 pb-2 border-b border-white/10">
              <span>Price</span>
              <span>Quantity</span>
              <span>Total</span>
            </div>
            {buyOrders.slice(0, 5).map((order, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="grid grid-cols-3 gap-4 text-sm hover:bg-green-500/10 p-2 rounded-lg transition-colors duration-200"
              >
                <span className="text-green-400 font-medium">
                  {formatPrice(order.price)}
                </span>
                <span className="text-white/80">
                  {formatQuantity(order.quantity)}
                </span>
                <span className="text-white/60">
                  {formatPrice(order.total)}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderBook;
