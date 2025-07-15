"use client";

import OrderBook from "@/components/ui/OrderBook";
import TradingChart from "@/components/ui/TradingChart";
import {
  ArrowsRightLeftIcon,
  ChartBarIcon,
  ClockIcon,
  MinusIcon,
  PlusIcon,
  ArrowTrendingDownIcon as TrendingDownIcon,
  ArrowTrendingUpIcon as TrendingUpIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import React, { useState } from "react";

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
    id: "1",
    strategy: "Stable Yield",
    tokenSymbol: "YT-USDC",
    currentPrice: 0.95,
    priceChange24h: 2.3,
    volume24h: 145000,
    totalSupply: 850000,
    maturityDate: "2025-08-10",
    apy: 8.5,
  },
  {
    id: "2",
    strategy: "SOL Staking+",
    tokenSymbol: "YT-SOL",
    currentPrice: 1.12,
    priceChange24h: -1.8,
    volume24h: 98000,
    totalSupply: 420000,
    maturityDate: "2025-09-15",
    apy: 15.2,
  },
  {
    id: "3",
    strategy: "LP Farming",
    tokenSymbol: "YT-RAY",
    currentPrice: 1.35,
    priceChange24h: 5.7,
    volume24h: 67000,
    totalSupply: 210000,
    maturityDate: "2025-07-25",
    apy: 24.8,
  },
];

// Mock data for charts and order book
const mockPriceData = [
  { time: "00:00", price: 0.92, volume: 1200 },
  { time: "04:00", price: 0.94, volume: 1800 },
  { time: "08:00", price: 0.91, volume: 2200 },
  { time: "12:00", price: 0.96, volume: 1600 },
  { time: "16:00", price: 0.95, volume: 1900 },
  { time: "20:00", price: 0.97, volume: 2400 },
  { time: "24:00", price: 0.95, volume: 1500 },
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
  const [activeTab, setActiveTab] = useState<"markets" | "trading" | "orders">(
    "markets"
  );
  const [selectedMarket, setSelectedMarket] = useState<MarketData | null>(null);
  const [orderType, setOrderType] = useState<"market" | "limit">("market");
  const [orderSide, setOrderSide] = useState<"buy" | "sell">("buy");
  const [orderAmount, setOrderAmount] = useState("");
  const [orderPrice, setOrderPrice] = useState("");

  const formatPrice = (price: number) => `$${price.toFixed(3)}`;
  const formatVolume = (volume: number) => `$${(volume / 1000).toFixed(1)}K`;
  const formatSupply = (supply: number) => `${(supply / 1000).toFixed(1)}K`;

  return (
    <section className="relative py-32 px-6 overflow-hidden" id="marketplace">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/3 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <ArrowsRightLeftIcon className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold yieldx-text-gradient">
              YT Marketplace
            </h2>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Trade Yield Tokens seamlessly with our advanced marketplace
          </p>
        </motion.div>

        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-center mb-12"
        >
          <div className="yieldx-card-glass p-2 rounded-2xl border border-white/10 backdrop-blur-xl">
            <div className="flex space-x-2">
              {[
                { id: "markets", label: "Markets", icon: ChartBarIcon },
                { id: "trading", label: "Trading", icon: TrendingUpIcon },
                { id: "orders", label: "My Orders", icon: ClockIcon },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() =>
                    setActiveTab(tab.id as "markets" | "trading" | "orders")
                  }
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-300 ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-blue-500/20 to-purple-600/20 text-white shadow-lg border border-blue-500/30"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Markets Tab */}
        {activeTab === "markets" && (
          <motion.div
            key="markets"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="glass-card p-8 rounded-3xl border border-white/10 backdrop-blur-xl"
          >
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
              <ChartBarIcon className="w-6 h-6 mr-3 text-blue-400" />
              Active Markets
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-4 px-4 text-white/60 font-medium">
                      Token
                    </th>
                    <th className="text-left py-4 px-4 text-white/60 font-medium">
                      Price
                    </th>
                    <th className="text-left py-4 px-4 text-white/60 font-medium">
                      24h Change
                    </th>
                    <th className="text-left py-4 px-4 text-white/60 font-medium">
                      Volume
                    </th>
                    <th className="text-left py-4 px-4 text-white/60 font-medium">
                      Supply
                    </th>
                    <th className="text-left py-4 px-4 text-white/60 font-medium">
                      APY
                    </th>
                    <th className="text-left py-4 px-4 text-white/60 font-medium">
                      Maturity
                    </th>
                    <th className="text-left py-4 px-4 text-white/60 font-medium">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {mockMarketData.map((market) => (
                    <tr
                      key={market.id}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors duration-200"
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                            <span className="text-white text-sm font-bold">
                              {market.tokenSymbol.split("-")[1][0]}
                            </span>
                          </div>
                          <div>
                            <div className="text-white font-medium">
                              {market.tokenSymbol}
                            </div>
                            <div className="text-white/60 text-sm">
                              {market.strategy}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-white font-medium">
                          {formatPrice(market.currentPrice)}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div
                          className={`flex items-center space-x-1 ${
                            market.priceChange24h >= 0
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                        >
                          {market.priceChange24h >= 0 ? (
                            <TrendingUpIcon className="w-4 h-4" />
                          ) : (
                            <TrendingDownIcon className="w-4 h-4" />
                          )}
                          <span className="font-medium">
                            {Math.abs(market.priceChange24h).toFixed(1)}%
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-white/80">
                          {formatVolume(market.volume24h)}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-white/80">
                          {formatSupply(market.totalSupply)}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-green-400 font-medium">
                          {market.apy}%
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="text-white/80 text-sm">
                          {market.maturityDate}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <button
                          onClick={() => {
                            setSelectedMarket(market);
                            setActiveTab("trading");
                          }}
                          className="glass-button px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500/10 to-purple-600/10 border border-white/10 text-white hover:from-blue-500/20 hover:to-purple-600/20 transition-all duration-300"
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
        {activeTab === "trading" && (
          <motion.div
            key="trading"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 xl:grid-cols-4 gap-8"
          >
            {/* Market Selection */}
            <div className="xl:col-span-1">
              <div className="glass-card p-6 rounded-3xl border border-white/10 backdrop-blur-xl mb-6">
                <h3 className="text-xl font-bold text-white mb-4">
                  Select Market
                </h3>
                <div className="space-y-3">
                  {mockMarketData.map((market) => (
                    <button
                      key={market.id}
                      onClick={() => setSelectedMarket(market)}
                      className={`w-full p-4 rounded-xl border transition-all duration-300 ${
                        selectedMarket?.id === market.id
                          ? "border-blue-500 bg-blue-500/10"
                          : "border-white/10 hover:border-white/20 hover:bg-white/5"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                            <span className="text-white text-sm font-bold">
                              {market.tokenSymbol.split("-")[1][0]}
                            </span>
                          </div>
                          <div className="text-left">
                            <div className="text-white font-medium">
                              {market.tokenSymbol}
                            </div>
                            <div className="text-white/60 text-sm">
                              {formatPrice(market.currentPrice)}
                            </div>
                          </div>
                        </div>
                        <div
                          className={`text-sm font-medium ${
                            market.priceChange24h >= 0
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                        >
                          {market.priceChange24h >= 0 ? "+" : ""}
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
                  symbol={selectedMarket.tokenSymbol}
                  buyOrders={mockBuyOrders}
                  sellOrders={mockSellOrders}
                />
              )}
            </div>

            {/* Chart and Trading Interface */}
            <div className="xl:col-span-3">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Trading Chart */}
                {selectedMarket && (
                  <div className="lg:col-span-2">
                    <TradingChart
                      symbol={selectedMarket.tokenSymbol}
                      data={mockPriceData}
                      currentPrice={selectedMarket.currentPrice}
                      priceChange={selectedMarket.priceChange24h}
                    />
                  </div>
                )}

                {/* Trading Interface */}
                <div className="lg:col-span-2">
                  <div className="glass-card p-6 rounded-3xl border border-white/10 backdrop-blur-xl">
                    <h3 className="text-xl font-bold text-white mb-6">
                      {selectedMarket
                        ? `Trade ${selectedMarket.tokenSymbol}`
                        : "Select a market to trade"}
                    </h3>

                    {selectedMarket && (
                      <div className="space-y-6">
                        {/* Order Type Selection */}
                        <div className="flex space-x-4">
                          <button
                            onClick={() => setOrderType("market")}
                            className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all duration-300 ${
                              orderType === "market"
                                ? "bg-gradient-to-r from-blue-500/15 to-purple-600/15 text-white border border-blue-500/20"
                                : "bg-white/5 text-white/60 hover:text-white"
                            }`}
                          >
                            Market Order
                          </button>
                          <button
                            onClick={() => setOrderType("limit")}
                            className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all duration-300 ${
                              orderType === "limit"
                                ? "bg-gradient-to-r from-blue-500/15 to-purple-600/15 text-white border border-blue-500/20"
                                : "bg-white/5 text-white/60 hover:text-white"
                            }`}
                          >
                            Limit Order
                          </button>
                        </div>

                        {/* Buy/Sell Selection */}
                        <div className="flex space-x-4">
                          <button
                            onClick={() => setOrderSide("buy")}
                            className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all duration-300 ${
                              orderSide === "buy"
                                ? "bg-gradient-to-r from-green-500/20 to-green-600/20 text-white border border-green-500/30"
                                : "bg-white/5 text-white/60 hover:text-white"
                            }`}
                          >
                            <PlusIcon className="w-5 h-5 inline mr-2" />
                            Buy
                          </button>
                          <button
                            onClick={() => setOrderSide("sell")}
                            className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all duration-300 ${
                              orderSide === "sell"
                                ? "bg-gradient-to-r from-red-500/20 to-red-600/20 text-white border border-red-500/30"
                                : "bg-white/5 text-white/60 hover:text-white"
                            }`}
                          >
                            <MinusIcon className="w-5 h-5 inline mr-2" />
                            Sell
                          </button>
                        </div>

                        {/* Order Form */}
                        <div className="space-y-4">
                          {orderType === "limit" && (
                            <div>
                              <label className="block text-white/60 text-sm font-medium mb-2">
                                Price (USDC)
                              </label>
                              <input
                                type="number"
                                value={orderPrice}
                                onChange={(e) => setOrderPrice(e.target.value)}
                                placeholder={formatPrice(
                                  selectedMarket.currentPrice
                                )}
                                className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:border-blue-500 focus:outline-none transition-colors duration-300"
                              />
                            </div>
                          )}

                          <div>
                            <label className="block text-white/60 text-sm font-medium mb-2">
                              Amount ({selectedMarket.tokenSymbol})
                            </label>
                            <input
                              type="number"
                              value={orderAmount}
                              onChange={(e) => setOrderAmount(e.target.value)}
                              placeholder="0.00"
                              className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/40 focus:border-blue-500 focus:outline-none transition-colors duration-300"
                            />
                          </div>
                        </div>

                        {/* Order Summary */}
                        {orderAmount && (
                          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
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
                                  {orderType === "market"
                                    ? "Market"
                                    : formatPrice(Number(orderPrice) || 0)}
                                </span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-white/60">Total:</span>
                                <span className="text-white font-medium">
                                  {formatPrice(
                                    Number(orderAmount) *
                                      (orderType === "market"
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
                          className={`w-full py-4 px-6 rounded-xl font-medium transition-all duration-300 ${
                            orderSide === "buy"
                              ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                              : "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                          } text-white shadow-lg hover:shadow-xl`}
                        >
                          {orderSide === "buy"
                            ? "Place Buy Order"
                            : "Place Sell Order"}
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
        {activeTab === "orders" && (
          <motion.div
            key="orders"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="glass-card p-8 rounded-3xl border border-white/10 backdrop-blur-xl"
          >
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
              <ClockIcon className="w-6 h-6 mr-3 text-blue-400" />
              Order History
            </h3>

            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                <ClockIcon className="w-8 h-8 text-white/40" />
              </div>
              <h4 className="text-xl font-semibold text-white mb-2">
                No Orders Yet
              </h4>
              <p className="text-white/60 mb-6">
                Start trading to see your order history here
              </p>
              <button
                onClick={() => setActiveTab("markets")}
                className="glass-button px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-600/10 border border-white/10 text-white hover:from-blue-500/20 hover:to-purple-600/20 transition-all duration-300"
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
