"use client";

import React, { useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LAMPORTS_PER_SOL, PublicKey, Transaction, SystemProgram } from '@solana/web3.js';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  strategy: {
    id: string;
    name: string;
    token: string;
    apy: number;
    risk: string;
    lockPeriod: string;
  };
}

const DepositModal: React.FC<DepositModalProps> = ({ isOpen, onClose, strategy }) => {
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { publicKey, sendTransaction, connected } = useWallet();
  const { connection } = useConnection();

  const handleDeposit = async () => {
    if (!publicKey || !amount) return;

    setIsLoading(true);
    try {
      // This is a simplified example - in a real app, you'd interact with your Solana program
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey("4vjdLHMEk7ywaHUMoen37337vqN86cKhxoXAFRvAYveA"), // Your program ID
          lamports: parseFloat(amount) * LAMPORTS_PER_SOL,
        })
      );

      const signature = await sendTransaction(transaction, connection);
      console.log('Transaction signature:', signature);
      
      // Show success message
      alert(`Successfully deposited ${amount} ${strategy.token}!`);
      onClose();
      setAmount('');
    } catch (error) {
      console.error('Transaction failed:', error);
      alert('Transaction failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            className="relative glass-card p-8 rounded-3xl border border-white/20 max-w-md w-full"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", duration: 0.5 }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            >
              <span className="text-white/80 text-xl">×</span>
            </button>

            {/* Header */}
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">
                Deposit to {strategy.name}
              </h3>
              <p className="text-white/60">
                Earn {strategy.apy}% APY with {strategy.lockPeriod} lock period
              </p>
            </div>

            {/* Strategy Info */}
            <div className="bg-white/5 rounded-2xl p-4 mb-6 border border-white/10">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white/60">Token:</span>
                <span className="text-white font-medium">{strategy.token}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-white/60">APY:</span>
                <span className="text-green-400 font-medium">{strategy.apy}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/60">Risk Level:</span>
                <span className={`font-medium ${
                  strategy.risk === 'Low' ? 'text-green-400' :
                  strategy.risk === 'Medium' ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {strategy.risk}
                </span>
              </div>
            </div>

            {!connected ? (
              <div className="text-center">
                <p className="text-white/60 mb-4">Connect your wallet to deposit</p>
                <WalletMultiButton className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium hover:from-indigo-600 hover:to-purple-700 transition-all duration-300"/>
              </div>
            ) : (
              <div>
                {/* Amount Input */}
                <div className="mb-6">
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Amount to deposit
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                    <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60">
                      {strategy.token}
                    </span>
                  </div>
                </div>

                {/* Balance */}
                <div className="text-center mb-6">
                  <p className="text-white/60 text-sm">
                    Balance: 100.00 {strategy.token}
                  </p>
                </div>

                {/* Deposit Button */}
                <button
                  onClick={handleDeposit}
                  disabled={!amount || isLoading}
                  className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </div>
                  ) : (
                    `Deposit ${amount || '0'} ${strategy.token}`
                  )}
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DepositModal;
