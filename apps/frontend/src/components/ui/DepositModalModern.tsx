'use client';

import {
  getAccount,
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import {
  LAMPORTS_PER_SOL,
  type PublicKey,
  SystemProgram,
  Transaction,
} from '@solana/web3.js';
import { AnimatePresence, motion } from 'framer-motion';
import type React from 'react';
import { useEffect, useState } from 'react';
import type { FormattedStrategy } from '../../hooks/useStrategies';
import { useYieldProgram } from '../../hooks/useYieldProgram';
import { PROGRAM_ID, TOKEN_MINTS } from '../../lib/constants';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  strategy: FormattedStrategy;
}

const DepositModal: React.FC<DepositModalProps> = ({
  isOpen,
  onClose,
  strategy,
}) => {
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const {
    publicKey,
    sendTransaction,
    connected,
    wallets,
    select,
    signTransaction,
  } = useWallet();
  const { connection } = useConnection();
  const { deposit, isReady } = useYieldProgram();

  // Function to get token mint address
  const getTokenMint = (tokenSymbol: string): PublicKey | null => {
    const tokenMintKey = tokenSymbol as keyof typeof TOKEN_MINTS;
    return TOKEN_MINTS[tokenMintKey] || strategy.tokenMint || null;
  };

  // Function to fetch user balance
  const fetchBalance = async () => {
    if (!(publicKey && connected)) {
      console.log('Wallet not connected, setting balance to null');
      setBalance(null);
      return;
    }

    console.log(
      'Fetching balance for token:',
      strategy.token,
      'wallet:',
      publicKey.toString()
    );
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

        console.log(
          'Associated token address:',
          associatedTokenAddress.toString()
        );

        const tokenAccount = await getAccount(
          connection,
          associatedTokenAddress,
          'confirmed',
          TOKEN_PROGRAM_ID
        );

        // Convert balance based on token decimals (assuming 6 decimals for USDC, 9 for others)
        const decimals = strategy.token === 'USDC' ? 6 : 9;
        const balance = Number(tokenAccount.amount) / 10 ** decimals;
        console.log('SPL token balance fetched:', balance);
        setBalance(balance);
      } catch (error) {
        // If account doesn't exist, balance is 0
        console.log(
          `No token account found for ${strategy.token}, balance is 0`,
          error
        );
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
    console.log('useEffect triggered:', {
      isOpen,
      connected,
      publicKey: publicKey?.toString(),
      token: strategy.token,
    });
    if (isOpen && connected && publicKey) {
      fetchBalance();
    } else if (!connected) {
      setBalance(null);
    }
  }, [isOpen, connected, publicKey, strategy.token, connection]);

  const handleDeposit = async () => {
    if (!(publicKey && amount && isReady)) return;

    setIsLoading(true);
    try {
      console.log('Calling deposit with:', {
        strategyAddress: strategy.publicKey.toString(),
        tokenMint: strategy.tokenMint.toString(),
        amount: Number.parseFloat(amount),
      });

      const result = await deposit(
        strategy.publicKey,
        strategy.tokenMint,
        Number.parseFloat(amount)
      );

      console.log('Deposit successful:', result);

      // Show success message
      alert(`Successfully deposited ${amount} ${strategy.token}!`);
      onClose();
      setAmount('');
    } catch (error) {
      console.error('Deposit transaction failed:', error);
      alert(
        `Deposit failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            animate={{ scale: 1, opacity: 1 }}
            className="glass-card relative w-full max-w-md rounded-3xl border border-white/20 p-8"
            exit={{ scale: 0.9, opacity: 0 }}
            initial={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', duration: 0.5 }}
          >
            {/* Close button */}
            <button
              className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
              onClick={onClose}
            >
              <span className="text-white/80 text-xl">×</span>
            </button>

            {/* Header */}
            <div className="mb-6 text-center">
              <h3 className="mb-2 font-bold text-2xl text-white">
                Deposit to {strategy.name}
              </h3>
              <p className="text-white/60">
                Earn {strategy.apy}% APY with {strategy.lockPeriod} lock period
              </p>
            </div>

            {/* Strategy Info */}
            <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-white/60">Token:</span>
                <span className="font-medium text-white">{strategy.token}</span>
              </div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-white/60">APY:</span>
                <span className="font-medium text-green-400">
                  {strategy.apy}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/60">Risk Level:</span>
                <span
                  className={`font-medium ${
                    strategy.risk === 'Low'
                      ? 'text-green-400'
                      : strategy.risk === 'Medium'
                        ? 'text-yellow-400'
                        : 'text-red-400'
                  }`}
                >
                  {strategy.risk}
                </span>
              </div>
            </div>

            {connected ? (
              <div>
                {/* Amount Input */}
                <div className="mb-6">
                  <label className="mb-2 block font-medium text-sm text-white/80">
                    Amount to deposit
                  </label>
                  <div className="relative">
                    <input
                      className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-white/40 transition-colors focus:border-indigo-500 focus:outline-none"
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      type="number"
                      value={amount}
                    />
                    <span className="-translate-y-1/2 absolute top-1/2 right-4 transform text-white/60">
                      {strategy.token}
                    </span>
                  </div>
                </div>

                {/* Balance */}
                <div className="mb-6 text-center">
                  <div className="flex items-center justify-center space-x-2 text-sm text-white/60">
                    {isLoadingBalance ? (
                      <>
                        <div className="h-3 w-3 animate-spin rounded-full border border-white/30 border-t-white/60" />
                        <span>Loading balance...</span>
                      </>
                    ) : balance !== null ? (
                      <>
                        <span>{`Balance: ${balance.toFixed(6)} ${strategy.token}`}</span>
                        <button
                          className="text-white/40 transition-colors hover:text-white/60"
                          onClick={fetchBalance}
                          title="Refresh balance"
                        >
                          🔄
                        </button>
                      </>
                    ) : (
                      <>
                        <span>{`Balance: -- ${strategy.token}`}</span>
                        <button
                          className="text-white/40 transition-colors hover:text-white/60"
                          onClick={fetchBalance}
                          title="Refresh balance"
                        >
                          🔄
                        </button>
                      </>
                    )}
                  </div>

                  {/* Devnet Faucet Links */}
                  {balance !== null &&
                    balance === 0 &&
                    strategy.token !== 'SOL' && (
                      <div className="mt-2 text-xs">
                        <a
                          className="text-indigo-400 transition-colors hover:text-indigo-300"
                          href={
                            strategy.token === 'USDC'
                              ? 'https://spl-token-faucet.com/?token-name=USDC'
                              : 'https://faucet.solana.com/'
                          }
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          Get {strategy.token} from Devnet Faucet
                        </a>
                      </div>
                    )}

                  {balance !== null && balance > 0 && (
                    <button
                      className="mt-1 text-indigo-400 text-xs transition-colors hover:text-indigo-300"
                      onClick={() => setAmount(balance.toString())}
                    >
                      Use Max
                    </button>
                  )}
                </div>

                {/* Deposit Button */}
                <button
                  className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-3 font-medium text-white transition-all duration-300 hover:from-indigo-600 hover:to-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={
                    !amount ||
                    isLoading ||
                    balance === null ||
                    Number.parseFloat(amount) <= 0 ||
                    Number.parseFloat(amount) > balance
                  }
                  onClick={handleDeposit}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      <span>Processing...</span>
                    </div>
                  ) : balance !== null &&
                    Number.parseFloat(amount) > balance ? (
                    'Insufficient Balance'
                  ) : (
                    `Deposit ${amount || '0'} ${strategy.token}`
                  )}
                </button>

                {/* Error message for insufficient balance */}
                {amount &&
                  balance !== null &&
                  Number.parseFloat(amount) > balance && (
                    <p className="mt-2 text-center text-red-400 text-sm">
                      Amount exceeds available balance
                    </p>
                  )}
              </div>
            ) : (
              <div className="text-center">
                <p className="mb-4 text-white/60">
                  Connect your wallet to deposit
                </p>

                {/* Check if any Solana wallets are available */}
                {wallets.length === 0 ? (
                  <div className="mb-4 rounded-xl border border-yellow-500/20 bg-yellow-500/10 p-4">
                    <h4 className="mb-2 font-medium text-yellow-400">
                      No Solana Wallet Detected
                    </h4>
                    <p className="mb-3 text-sm text-white/70">
                      To use this app, you need a Solana wallet. Metamask is for
                      Ethereum only.
                    </p>
                    <div className="space-y-2">
                      <a
                        className="block w-full rounded-lg bg-purple-600 px-4 py-2 text-sm text-white transition-colors hover:bg-purple-700"
                        href="https://phantom.app/"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        Install Phantom Wallet (Recommended)
                      </a>
                      <a
                        className="block w-full rounded-lg bg-blue-600 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-700"
                        href="https://solflare.com/"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        Install Solflare Wallet
                      </a>
                    </div>
                  </div>
                ) : (
                  <WalletMultiButton className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-3 font-medium text-white transition-all duration-300 hover:from-indigo-600 hover:to-purple-700" />
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
