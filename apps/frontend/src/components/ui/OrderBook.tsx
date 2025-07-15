'use client';

import { motion } from 'framer-motion';
import type React from 'react';

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
    <div className="glass-card rounded-3xl border border-white/10 p-6 backdrop-blur-xl">
      <h4 className="mb-6 font-bold text-white text-xl">
        Order Book - {symbol}
      </h4>

      <div className="space-y-6">
        {/* Sell Orders */}
        <div>
          <h5 className="mb-3 font-medium text-red-400">Sell Orders</h5>
          <div className="space-y-2">
            <div className="grid grid-cols-3 gap-4 border-white/10 border-b pb-2 text-sm text-white/60">
              <span>Price</span>
              <span>Quantity</span>
              <span>Total</span>
            </div>
            {sellOrders.slice(0, 5).map((order, index) => (
              <motion.div
                animate={{ opacity: 1, x: 0 }}
                className="grid grid-cols-3 gap-4 rounded-lg p-2 text-sm transition-colors duration-200 hover:bg-red-500/10"
                initial={{ opacity: 0, x: -20 }}
                key={index}
                transition={{ delay: index * 0.1 }}
              >
                <span className="font-medium text-red-400">
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
        <div className="border-white/10 border-y py-4 text-center">
          <div className="font-bold text-lg text-white">
            {formatPrice(buyOrders[0]?.price || 0)}
          </div>
          <div className="text-sm text-white/60">Current Price</div>
        </div>

        {/* Buy Orders */}
        <div>
          <h5 className="mb-3 font-medium text-green-400">Buy Orders</h5>
          <div className="space-y-2">
            <div className="grid grid-cols-3 gap-4 border-white/10 border-b pb-2 text-sm text-white/60">
              <span>Price</span>
              <span>Quantity</span>
              <span>Total</span>
            </div>
            {buyOrders.slice(0, 5).map((order, index) => (
              <motion.div
                animate={{ opacity: 1, x: 0 }}
                className="grid grid-cols-3 gap-4 rounded-lg p-2 text-sm transition-colors duration-200 hover:bg-green-500/10"
                initial={{ opacity: 0, x: -20 }}
                key={index}
                transition={{ delay: index * 0.1 }}
              >
                <span className="font-medium text-green-400">
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
