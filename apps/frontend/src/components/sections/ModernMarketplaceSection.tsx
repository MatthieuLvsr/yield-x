'use client';

import {
  ArrowsRightLeftIcon,
  ChartBarIcon,
  ClockIcon,
  MinusIcon,
  PlusIcon,
  ArrowTrendingDownIcon as TrendingDownIcon,
  ArrowTrendingUpIcon as TrendingUpIcon,
} from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import type React from 'react';
import { useState } from 'react';
import OrderBook from '@/components/ui/OrderBook';
import TradingChart from '@/components/ui/TradingChart';

interface MarketData {
  id: string;
  strategy: string;
  tokenSymbol: string;
  currentPrice: number;
  priceChange24h: number;
  volume24h: number;
  totalSupply: number;
  maturityDate: string;
  apy: number;
}

const mockMarketData: MarketData[] = [
  {
    id: '1',
    strategy: 'Stable Yield',
    tokenSymbol: 'YT-USDC',
    currentPrice: 0.95,
    priceChange24h: 2.3,
    volume24h: 145_000,
    totalSupply: 850_000,
    maturityDate: '2025-08-10',
    apy: 8.5,
  },
  {
    id: '2',
    strategy: 'SOL Staking+',
    tokenSymbol: 'YT-SOL',
    currentPrice: 1.12,
    priceChange24h: -1.8,
    volume24h: 98_000,
    totalSupply: 420_000,
    maturityDate: '2025-09-15',
    apy: 15.2,
  },
  {
    id: '3',
    strategy: 'LP Farming',
    tokenSymbol: 'YT-RAY',
    currentPrice: 1.35,
    priceChange24h: 5.7,
    volume24h: 67_000,
    totalSupply: 210_000,
    maturityDate: '2025-07-25',
    apy: 24.8,
  },
];

// Mock data for charts and order book
const mockPriceData = [
  { time: '00:00', price: 0.92, volume: 1200 },
  { time: '04:00', price: 0.94, volume: 1800 },
  { time: '08:00', price: 0.91, volume: 2200 },
  { time: '12:00', price: 0.96, volume: 1600 },
  { time: '16:00', price: 0.95, volume: 1900 },
  { time: '20:00', price: 0.97, volume: 2400 },
  { time: '24:00', price: 0.95, volume: 1500 },
];

const mockBuyOrders = [
  { price: 0.948, quantity: 1250, total: 1185 },
  { price: 0.947, quantity: 2100, total: 1989 },
  { price: 0.946, quantity: 1800, total: 1703 },
  { price: 0.945, quantity: 3200, total: 3024 },
  { price: 0.944, quantity: 1600, total: 1510 },
];

const mockSellOrders = [
  { price: 0.952, quantity: 1100, total: 1047 },
  { price: 0.953, quantity: 1800, total: 1715 },
  { price: 0.954, quantity: 2200, total: 2099 },
  { price: 0.955, quantity: 1500, total: 1433 },
  { price: 0.956, quantity: 2800, total: 2677 },
];

const ModernMarketplaceSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'markets' | 'trading' | 'orders'>(
    'markets'
  );
  const [selectedMarket, setSelectedMarket] = useState<MarketData | null>(null);
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market');
  const [orderSide, setOrderSide] = useState<'buy' | 'sell'>('buy');
  const [orderAmount, setOrderAmount] = useState('');
  const [orderPrice, setOrderPrice] = useState('');

  const formatPrice = (price: number) => `$${price.toFixed(3)}`;
  const formatVolume = (volume: number) => `$${(volume / 1000).toFixed(1)}K`;
  const formatSupply = (supply: number) => `${(supply / 1000).toFixed(1)}K`;

  return (
    <section className="relative overflow-hidden px-6 py-32" id="marketplace">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-blue-500/5 blur-3xl" />
        <div className="absolute right-1/4 bottom-1/4 h-96 w-96 rounded-full bg-purple-500/5 blur-3xl" />
        <div className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 h-[600px] w-[600px] transform rounded-full bg-indigo-500/3 blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto">
        {/* Section Header */}
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 30 }}
          transition={{ duration: 0.8 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <div className="mb-6 flex items-center justify-center space-x-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600">
              <ArrowsRightLeftIcon className="h-6 w-6 text-white" />
            </div>
            <h2 className="yieldx-text-gradient font-bold text-4xl md:text-5xl">
              YT Marketplace
            </h2>
          </div>
          <p className="mx-auto max-w-2xl text-gray-300 text-xl">
            Trade Yield Tokens seamlessly with our advanced marketplace
          </p>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          className="mb-12 flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <div className="yieldx-card-glass rounded-2xl border border-white/10 p-2 backdrop-blur-xl">
            <div className="flex space-x-2">
              {[
                { id: 'markets', label: 'Markets', icon: ChartBarIcon },
                { id: 'trading', label: 'Trading', icon: TrendingUpIcon },
                { id: 'orders', label: 'My Orders', icon: ClockIcon },
              ].map((tab) => (
                <button
                  className={`flex items-center space-x-2 rounded-xl px-6 py-3 transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'border border-blue-500/30 bg-gradient-to-r from-blue-500/20 to-purple-600/20 text-white shadow-lg'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                  key={tab.id}
                  onClick={() =>
                    setActiveTab(tab.id as 'markets' | 'trading' | 'orders')
                  }
                >
                  <tab.icon className="h-5 w-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Markets Tab */}
        {activeTab === 'markets' && (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-3xl border border-white/10 p-8 backdrop-blur-xl"
            initial={{ opacity: 0, y: 20 }}
            key="markets"
            transition={{ duration: 0.6 }}
          >
            <h3 className="mb-6 flex items-center font-bold text-2xl text-white">
              <ChartBarIcon className="mr-3 h-6 w-6 text-blue-400" />
              Active Markets
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-white/10 border-b">
                    <th className="px-4 py-4 text-left font-medium text-white/60">
                      Token
                    </th>
                    <th className="px-4 py-4 text-left font-medium text-white/60">
                      Price
                    </th>
                    <th className="px-4 py-4 text-left font-medium text-white/60">
                      24h Change
                    </th>
                    <th className="px-4 py-4 text-left font-medium text-white/60">
                      Volume
                    </th>
                    <th className="px-4 py-4 text-left font-medium text-white/60">
                      Supply
                    </th>
                    <th className="px-4 py-4 text-left font-medium text-white/60">
                      APY
                    </th>
                    <th className="px-4 py-4 text-left font-medium text-white/60">
                      Maturity
                    </th>
                    <th className="px-4 py-4 text-left font-medium text-white/60">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {mockMarketData.map((market) => (
                    <tr
                      className="border-white/5 border-b transition-colors duration-200 hover:bg-white/5"
                      key={market.id}
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
                            <span className="font-bold text-sm text-white">
                              {market.tokenSymbol.split('-')[1][0]}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-white">
                              {market.tokenSymbol}
                            </div>
                            <div className="text-sm text-white/60">
                              {market.strategy}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-medium text-white">
                          {formatPrice(market.currentPrice)}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div
                          className={`flex items-center space-x-1 ${
                            market.priceChange24h >= 0
                              ? 'text-green-400'
                              : 'text-red-400'
                          }`}
                        >
                          {market.priceChange24h >= 0 ? (
                            <TrendingUpIcon className="h-4 w-4" />
                          ) : (
                            <TrendingDownIcon className="h-4 w-4" />
                          )}
                          <span className="font-medium">
                            {Math.abs(market.priceChange24h).toFixed(1)}%
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-white/80">
                          {formatVolume(market.volume24h)}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-white/80">
                          {formatSupply(market.totalSupply)}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-medium text-green-400">
                          {market.apy}%
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-sm text-white/80">
                          {market.maturityDate}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <button
                          className="glass-button rounded-lg border border-white/10 bg-gradient-to-r from-blue-500/10 to-purple-600/10 px-4 py-2 text-white transition-all duration-300 hover:from-blue-500/20 hover:to-purple-600/20"
                          onClick={() => {
                            setSelectedMarket(market);
                            setActiveTab('trading');
                          }}
                        >
                          Trade
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Trading Tab */}
        {activeTab === 'trading' && (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 gap-8 xl:grid-cols-4"
            initial={{ opacity: 0, y: 20 }}
            key="trading"
            transition={{ duration: 0.6 }}
          >
            {/* Market Selection */}
            <div className="xl:col-span-1">
              <div className="glass-card mb-6 rounded-3xl border border-white/10 p-6 backdrop-blur-xl">
                <h3 className="mb-4 font-bold text-white text-xl">
                  Select Market
                </h3>
                <div className="space-y-3">
                  {mockMarketData.map((market) => (
                    <button
                      className={`w-full rounded-xl border p-4 transition-all duration-300 ${
                        selectedMarket?.id === market.id
                          ? 'border-blue-500 bg-blue-500/10'
                          : 'border-white/10 hover:border-white/20 hover:bg-white/5'
                      }`}
                      key={market.id}
                      onClick={() => setSelectedMarket(market)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
                            <span className="font-bold text-sm text-white">
                              {market.tokenSymbol.split('-')[1][0]}
                            </span>
                          </div>
                          <div className="text-left">
                            <div className="font-medium text-white">
                              {market.tokenSymbol}
                            </div>
                            <div className="text-sm text-white/60">
                              {formatPrice(market.currentPrice)}
                            </div>
                          </div>
                        </div>
                        <div
                          className={`font-medium text-sm ${
                            market.priceChange24h >= 0
                              ? 'text-green-400'
                              : 'text-red-400'
                          }`}
                        >
                          {market.priceChange24h >= 0 ? '+' : ''}
                          {market.priceChange24h.toFixed(1)}%
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Order Book */}
              {selectedMarket && (
                <OrderBook
                  buyOrders={mockBuyOrders}
                  sellOrders={mockSellOrders}
                  symbol={selectedMarket.tokenSymbol}
                />
              )}
            </div>

            {/* Chart and Trading Interface */}
            <div className="xl:col-span-3">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Trading Chart */}
                {selectedMarket && (
                  <div className="lg:col-span-2">
                    <TradingChart
                      currentPrice={selectedMarket.currentPrice}
                      data={mockPriceData}
                      priceChange={selectedMarket.priceChange24h}
                      symbol={selectedMarket.tokenSymbol}
                    />
                  </div>
                )}

                {/* Trading Interface */}
                <div className="lg:col-span-2">
                  <div className="glass-card rounded-3xl border border-white/10 p-6 backdrop-blur-xl">
                    <h3 className="mb-6 font-bold text-white text-xl">
                      {selectedMarket
                        ? `Trade ${selectedMarket.tokenSymbol}`
                        : 'Select a market to trade'}
                    </h3>

                    {selectedMarket && (
                      <div className="space-y-6">
                        {/* Order Type Selection */}
                        <div className="flex space-x-4">
                          <button
                            className={`flex-1 rounded-xl px-6 py-3 font-medium transition-all duration-300 ${
                              orderType === 'market'
                                ? 'border border-blue-500/20 bg-gradient-to-r from-blue-500/15 to-purple-600/15 text-white'
                                : 'bg-white/5 text-white/60 hover:text-white'
                            }`}
                            onClick={() => setOrderType('market')}
                          >
                            Market Order
                          </button>
                          <button
                            className={`flex-1 rounded-xl px-6 py-3 font-medium transition-all duration-300 ${
                              orderType === 'limit'
                                ? 'border border-blue-500/20 bg-gradient-to-r from-blue-500/15 to-purple-600/15 text-white'
                                : 'bg-white/5 text-white/60 hover:text-white'
                            }`}
                            onClick={() => setOrderType('limit')}
                          >
                            Limit Order
                          </button>
                        </div>

                        {/* Buy/Sell Selection */}
                        <div className="flex space-x-4">
                          <button
                            className={`flex-1 rounded-xl px-6 py-3 font-medium transition-all duration-300 ${
                              orderSide === 'buy'
                                ? 'border border-green-500/30 bg-gradient-to-r from-green-500/20 to-green-600/20 text-white'
                                : 'bg-white/5 text-white/60 hover:text-white'
                            }`}
                            onClick={() => setOrderSide('buy')}
                          >
                            <PlusIcon className="mr-2 inline h-5 w-5" />
                            Buy
                          </button>
                          <button
                            className={`flex-1 rounded-xl px-6 py-3 font-medium transition-all duration-300 ${
                              orderSide === 'sell'
                                ? 'border border-red-500/30 bg-gradient-to-r from-red-500/20 to-red-600/20 text-white'
                                : 'bg-white/5 text-white/60 hover:text-white'
                            }`}
                            onClick={() => setOrderSide('sell')}
                          >
                            <MinusIcon className="mr-2 inline h-5 w-5" />
                            Sell
                          </button>
                        </div>

                        {/* Order Form */}
                        <div className="space-y-4">
                          {orderType === 'limit' && (
                            <div>
                              <label className="mb-2 block font-medium text-sm text-white/60">
                                Price (USDC)
                              </label>
                              <input
                                className="w-full rounded-xl border border-white/10 bg-white/5 p-4 text-white placeholder-white/40 transition-colors duration-300 focus:border-blue-500 focus:outline-none"
                                onChange={(e) => setOrderPrice(e.target.value)}
                                placeholder={formatPrice(
                                  selectedMarket.currentPrice
                                )}
                                type="number"
                                value={orderPrice}
                              />
                            </div>
                          )}

                          <div>
                            <label className="mb-2 block font-medium text-sm text-white/60">
                              Amount ({selectedMarket.tokenSymbol})
                            </label>
                            <input
                              className="w-full rounded-xl border border-white/10 bg-white/5 p-4 text-white placeholder-white/40 transition-colors duration-300 focus:border-blue-500 focus:outline-none"
                              onChange={(e) => setOrderAmount(e.target.value)}
                              placeholder="0.00"
                              type="number"
                              value={orderAmount}
                            />
                          </div>
                        </div>

                        {/* Order Summary */}
                        {orderAmount && (
                          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-white/60">Amount:</span>
                                <span className="text-white">
                                  {orderAmount} {selectedMarket.tokenSymbol}
                                </span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-white/60">Price:</span>
                                <span className="text-white">
                                  {orderType === 'market'
                                    ? 'Market'
                                    : formatPrice(Number(orderPrice) || 0)}
                                </span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-white/60">Total:</span>
                                <span className="font-medium text-white">
                                  {formatPrice(
                                    Number(orderAmount) *
                                      (orderType === 'market'
                                        ? selectedMarket.currentPrice
                                        : Number(orderPrice) || 0)
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Submit Button */}
                        <button
                          className={`w-full rounded-xl px-6 py-4 font-medium transition-all duration-300 ${
                            orderSide === 'buy'
                              ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
                              : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700'
                          } text-white shadow-lg hover:shadow-xl`}
                        >
                          {orderSide === 'buy'
                            ? 'Place Buy Order'
                            : 'Place Sell Order'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-3xl border border-white/10 p-8 backdrop-blur-xl"
            initial={{ opacity: 0, y: 20 }}
            key="orders"
            transition={{ duration: 0.6 }}
          >
            <h3 className="mb-6 flex items-center font-bold text-2xl text-white">
              <ClockIcon className="mr-3 h-6 w-6 text-blue-400" />
              Order History
            </h3>

            <div className="py-12 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/5">
                <ClockIcon className="h-8 w-8 text-white/40" />
              </div>
              <h4 className="mb-2 font-semibold text-white text-xl">
                No Orders Yet
              </h4>
              <p className="mb-6 text-white/60">
                Start trading to see your order history here
              </p>
              <button
                className="glass-button rounded-xl border border-white/10 bg-gradient-to-r from-blue-500/10 to-purple-600/10 px-6 py-3 text-white transition-all duration-300 hover:from-blue-500/20 hover:to-purple-600/20"
                onClick={() => setActiveTab('markets')}
              >
                Browse Markets
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default ModernMarketplaceSection;
