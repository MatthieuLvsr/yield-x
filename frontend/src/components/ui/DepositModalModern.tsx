"use client";

import React, { useState, useEffect } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LAMPORTS_PER_SOL, PublicKey, Transaction, SystemProgram } from '@solana/web3.js';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { getAccount, getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { TOKEN_MINTS, PROGRAM_ID } from '../../lib/constants';
import { FormattedStrategy } from '../../hooks/useStrategies';
import { useYieldProgram } from '../../hooks/useYieldProgram';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  strategy: FormattedStrategy;
}

const DepositModal: React.FC<DepositModalProps> = ({ isOpen, onClose, strategy }) => {
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const { publicKey, sendTransaction, connected, wallets, select, signTransaction } = useWallet();
  const { connection } = useConnection();
  const { deposit, isReady } = useYieldProgram();

  // Function to get token mint address
  const getTokenMint = (tokenSymbol: string): PublicKey | null => {
    const tokenMintKey = tokenSymbol as keyof typeof TOKEN_MINTS;
    return TOKEN_MINTS[tokenMintKey] || strategy.tokenMint || null;
  };

  // Function to fetch user balance
  const fetchBalance = async () => {
    if (!publicKey || !connected) {
      console.log('Wallet not connected, setting balance to null');
      setBalance(null);
      return;
    }

    console.log('Fetching balance for token:', strategy.token, 'wallet:', publicKey.toString());
    setIsLoadingBalance(true);
    
    try {
      const tokenMint = getTokenMint(strategy.token);
      
      if (!tokenMint) {
        console.warn(`Token mint not found for ${strategy.token}`);
        setBalance(0);
        setIsLoadingBalance(false);
        return;
      }

      console.log('Using token mint:', tokenMint.toString());

      // Handle SOL balance
      if (strategy.token === 'SOL') {
        console.log('Fetching SOL balance...');
        const solBalance = await connection.getBalance(publicKey);
        const balanceInSol = solBalance / LAMPORTS_PER_SOL;
        console.log('SOL balance fetched:', balanceInSol);
        setBalance(balanceInSol);
        setIsLoadingBalance(false);
        return;
      }

      // Handle SPL token balance
      try {
        console.log('Fetching SPL token balance...');
        const associatedTokenAddress = await getAssociatedTokenAddress(
          tokenMint,
          publicKey
        );

        console.log('Associated token address:', associatedTokenAddress.toString());

        const tokenAccount = await getAccount(
          connection,
          associatedTokenAddress,
          'confirmed',
          TOKEN_PROGRAM_ID
        );

        // Convert balance based on token decimals (assuming 6 decimals for USDC, 9 for others)
        const decimals = strategy.token === 'USDC' ? 6 : 9;
        const balance = Number(tokenAccount.amount) / Math.pow(10, decimals);
        console.log('SPL token balance fetched:', balance);
        setBalance(balance);
      } catch (error) {
        // If account doesn't exist, balance is 0
        console.log(`No token account found for ${strategy.token}, balance is 0`, error);
        setBalance(0);
      }
    } catch (error) {
      console.error('Error fetching balance:', error);
      setBalance(0);
    } finally {
      setIsLoadingBalance(false);
    }
  };

  // Fetch balance when wallet connects or modal opens
  useEffect(() => {
    console.log('useEffect triggered:', { isOpen, connected, publicKey: publicKey?.toString(), token: strategy.token });
    if (isOpen && connected && publicKey) {
      fetchBalance();
    } else if (!connected) {
      setBalance(null);
    }
  }, [isOpen, connected, publicKey, strategy.token, connection]);

  const handleDeposit = async () => {
    if (!publicKey || !amount || !isReady) return;

    setIsLoading(true);
    try {
      console.log('Calling deposit with:', {
        strategyAddress: strategy.publicKey.toString(),
        tokenMint: strategy.tokenMint.toString(),
        amount: parseFloat(amount)
      });

      const result = await deposit(
        strategy.publicKey,
        strategy.tokenMint,
        parseFloat(amount)
      );
      
      console.log('Deposit successful:', result);
      
      // Show success message
      alert(`Successfully deposited ${amount} ${strategy.token}!`);
      onClose();
      setAmount('');
    } catch (error) {
      console.error('Deposit transaction failed:', error);
      alert(`Deposit failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
                
                {/* Check if any Solana wallets are available */}
                {wallets.length === 0 ? (
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 mb-4">
                    <h4 className="text-yellow-400 font-medium mb-2">No Solana Wallet Detected</h4>
                    <p className="text-white/70 text-sm mb-3">
                      To use this app, you need a Solana wallet. Metamask is for Ethereum only.
                    </p>
                    <div className="space-y-2">
                      <a
                        href="https://phantom.app/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition-colors"
                      >
                        Install Phantom Wallet (Recommended)
                      </a>
                      <a
                        href="https://solflare.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
                      >
                        Install Solflare Wallet
                      </a>
                    </div>
                  </div>
                ) : (
                  <WalletMultiButton className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium hover:from-indigo-600 hover:to-purple-700 transition-all duration-300"/>
                )}
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
                  <div className="text-white/60 text-sm flex items-center justify-center space-x-2">
                    {isLoadingBalance ? (
                      <>
                        <div className="w-3 h-3 border border-white/30 border-t-white/60 rounded-full animate-spin"></div>
                        <span>Loading balance...</span>
                      </>
                    ) : balance !== null ? (
                      <>
                        <span>{`Balance: ${balance.toFixed(6)} ${strategy.token}`}</span>
                        <button
                          onClick={fetchBalance}
                          className="text-white/40 hover:text-white/60 transition-colors"
                          title="Refresh balance"
                        >
                          🔄
                        </button>
                      </>
                    ) : (
                      <>
                        <span>{`Balance: -- ${strategy.token}`}</span>
                        <button
                          onClick={fetchBalance}
                          className="text-white/40 hover:text-white/60 transition-colors"
                          title="Refresh balance"
                        >
                          🔄
                        </button>
                      </>
                    )}
                  </div>
                  
                  {/* Devnet Faucet Links */}
                  {balance !== null && balance === 0 && strategy.token !== 'SOL' && (
                    <div className="mt-2 text-xs">
                      <a
                        href={strategy.token === 'USDC' 
                          ? 'https://spl-token-faucet.com/?token-name=USDC'
                          : 'https://faucet.solana.com/'
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-400 hover:text-indigo-300 transition-colors"
                      >
                        Get {strategy.token} from Devnet Faucet
                      </a>
                    </div>
                  )}

                  {balance !== null && balance > 0 && (
                    <button
                      onClick={() => setAmount(balance.toString())}
                      className="text-indigo-400 text-xs hover:text-indigo-300 transition-colors mt-1"
                    >
                      Use Max
                    </button>
                  )}
                </div>

                {/* Deposit Button */}
                <button
                  onClick={handleDeposit}
                  disabled={
                    !amount || 
                    isLoading || 
                    balance === null || 
                    parseFloat(amount) <= 0 || 
                    parseFloat(amount) > balance
                  }
                  className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium hover:from-indigo-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </div>
                  ) : balance !== null && parseFloat(amount) > balance ? (
                    'Insufficient Balance'
                  ) : (
                    `Deposit ${amount || '0'} ${strategy.token}`
                  )}
                </button>

                {/* Error message for insufficient balance */}
                {amount && balance !== null && parseFloat(amount) > balance && (
                  <p className="text-red-400 text-sm text-center mt-2">
                    Amount exceeds available balance
                  </p>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DepositModal;
