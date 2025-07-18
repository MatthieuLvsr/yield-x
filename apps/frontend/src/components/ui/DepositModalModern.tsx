import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import type { Strategy } from '@/app/page';
import { type TokenInfo, useTokenInfo } from '@/hooks/useStrategies';
import { getStrategyRisk } from '@/hooks/useStrategiesPagination';
import { getTokenBalance } from '@/lib/api.client';
import { useYieldProgram } from '../../hooks/useYieldProgram';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  strategy: Strategy;
}

export const DepositModal = ({
  isOpen,
  onClose,
  strategy,
}: DepositModalProps) => {
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const { publicKey, connected, wallets } = useWallet();
  const { connection } = useConnection();
  const { deposit, isReady } = useYieldProgram();
  const { tokenInfo } = useTokenInfo(strategy);

  const fetchBalance = async (token: TokenInfo) => {
    if (!(publicKey && connected && token)) {
      console.log('Wallet not connected, setting balance to null');
      setBalance(null);
      return;
    }
    setIsLoadingBalance(true);

    try {
      if (token.symbol === 'SOL') {
        const solBalance = await connection.getBalance(publicKey);
        const balanceInSol = solBalance / LAMPORTS_PER_SOL;
        setBalance(balanceInSol);
        setIsLoadingBalance(false);
        return;
      }

      const tokenBalance = await getTokenBalance(
        token.address,
        publicKey.toString()
      );

      if (tokenBalance !== null) {
        setBalance(tokenBalance);
      } else {
        setBalance(0);
      }
    } catch (error) {
      console.error('Error fetching balance:', error);
      setBalance(0);
    }
    setIsLoadingBalance(false);
  };

  useEffect(() => {
    if (isOpen && connected && publicKey && tokenInfo) {
      fetchBalance(tokenInfo);
    }
    setBalance(null);
  }, [isOpen, connected, publicKey, tokenInfo]);

  const handleDeposit = async () => {
    console.log(publicKey);
    console.log(amount);
    console.log(isReady);
    if (!(publicKey && amount && isReady && tokenInfo)) {
      return;
    }

    setIsLoading(true);
    try {
      const result = await deposit(
        strategy,
        tokenInfo,
        Number.parseFloat(amount)
      );

      console.log('Deposit successful:', result);
      alert(
        `Successfully deposited ${amount} -> ${strategy.account.tokenAddress.toString()}!`
      );
      onClose();
      setAmount('');
    } catch (error) {
      console.error('Deposit transaction failed:', error);
      alert(
        `Deposit failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
    setIsLoading(false);
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
          <button
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            type="button"
          />

          <motion.div
            animate={{ scale: 1, opacity: 1 }}
            className="glass-card relative w-full max-w-md rounded-3xl border border-white/20 p-8"
            exit={{ scale: 0.9, opacity: 0 }}
            initial={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', duration: 0.5 }}
          >
            <button
              className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20"
              onClick={onClose}
              type="button"
            >
              <span className="text-white/80 text-xl">×</span>
            </button>

            {/* Header */}
            <div className="mb-6 text-center">
              <h3 className="mb-2 font-bold text-2xl text-white">
                Deposit to {tokenInfo?.name || 'Unknown Token'}
              </h3>
              <p className="text-white/60">
                Earn {strategy.account.rewardApy}% APY with 30 days lock period
              </p>
            </div>

            {/* Strategy Info */}
            <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-white/60">Token:</span>
                <span className="font-medium text-white">
                  {tokenInfo?.name || 'Unknown Token'}
                </span>
              </div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-white/60">APY:</span>
                <span className="font-medium text-green-400">
                  {strategy.account.rewardApy}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/60">Risk Level:</span>
                <span
                  className={`font-medium ${(() => {
                    const risk = getStrategyRisk(strategy);
                    if (risk === 'Low') {
                      return 'text-green-400';
                    }
                    if (risk === 'Medium') {
                      return 'text-yellow-400';
                    }
                    return 'text-red-400';
                  })()}`}
                >
                  {getStrategyRisk(strategy)}
                </span>
              </div>
            </div>

            {connected ? (
              <div>
                {/* Amount Input */}
                <div className="mb-6">
                  <span className="mb-2 block font-medium text-sm text-white/80">
                    Amount to deposit
                  </span>
                  <div className="relative">
                    <input
                      className="w-full rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white placeholder-white/40 transition-colors focus:border-indigo-500 focus:outline-none"
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      type="number"
                      value={amount}
                    />
                    <span className="-translate-y-1/2 absolute top-1/2 right-4 transform text-white/60">
                      {tokenInfo?.symbol}
                    </span>
                  </div>
                </div>

                {/* Balance */}
                <div className="mb-6 text-center">
                  <div className="flex items-center justify-center space-x-2 text-sm text-white/60">
                    {isLoadingBalance && (
                      <>
                        <div className="h-3 w-3 animate-spin rounded-full border border-white/30 border-t-white/60" />
                        <span>Loading balance...</span>
                      </>
                    )}
                    {!isLoadingBalance && balance !== null && (
                      <>
                        <span>
                          {`Balance: ${balance.toFixed(6)} ${tokenInfo?.symbol ?? ''}`}
                        </span>
                        <button
                          className="text-white/40 transition-colors hover:text-white/60"
                          onClick={() => tokenInfo && fetchBalance(tokenInfo)}
                          title="Refresh balance"
                          type="button"
                        >
                          🔄
                        </button>
                      </>
                    )}
                    {!isLoadingBalance && balance === null && (
                      <>
                        <span>{`Balance: -- ${tokenInfo?.symbol ?? ''}`}</span>
                        <button
                          className="text-white/40 transition-colors hover:text-white/60"
                          onClick={() => tokenInfo && fetchBalance(tokenInfo)}
                          title="Refresh balance"
                          type="button"
                        >
                          🔄
                        </button>
                      </>
                    )}
                  </div>

                  {/* Devnet Faucet Links */}
                  {balance !== null &&
                    balance === 0 &&
                    tokenInfo?.symbol !== 'SOL' && (
                      <div className="mt-2 text-xs">
                        <a
                          className="text-indigo-400 transition-colors hover:text-indigo-300"
                          href={
                            tokenInfo?.symbol === 'USDC'
                              ? 'https://spl-token-faucet.com/?token-name=USDC'
                              : 'https://faucet.solana.com/'
                          }
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          Get {tokenInfo?.symbol} from Devnet Faucet
                        </a>
                      </div>
                    )}

                  {balance !== null && balance > 0 && (
                    <button
                      className="mt-1 text-indigo-400 text-xs transition-colors hover:text-indigo-300"
                      onClick={() => setAmount(balance.toString())}
                      type="button"
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
                  type="button"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      <span>Processing...</span>
                    </div>
                  ) : (
                    (() => {
                      if (
                        balance !== null &&
                        Number.parseFloat(amount) > balance
                      ) {
                        return 'Insufficient Balance';
                      }
                      return `Deposit ${amount || '0'} ${tokenInfo?.symbol ?? ''}`;
                    })()
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
