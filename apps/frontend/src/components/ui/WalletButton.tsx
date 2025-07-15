'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import type React from 'react';
import { useEffect, useState } from 'react';

const WalletButton: React.FC = () => {
  const { connected, publicKey, disconnect } = useWallet();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by only showing wallet content after client mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Show loading state during hydration
  if (!mounted) {
    return (
      <div className="wallet-button-custom">
        <div className="rounded-xl border-none bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-2.5 font-medium text-white transition-all duration-300">
          Connect Wallet
        </div>
      </div>
    );
  }

  if (connected && publicKey) {
    return (
      <div className="flex items-center space-x-3">
        {/* Connected wallet display */}
        <div className="hidden items-center space-x-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-md sm:flex">
          <div className="h-3 w-3 animate-pulse rounded-full bg-green-400" />
          <span className="font-mono text-sm text-white/90">
            {publicKey.toString().slice(0, 4)}...
            {publicKey.toString().slice(-4)}
          </span>
        </div>

        {/* Disconnect button */}
        <button
          className="rounded-xl border border-red-500/30 bg-red-500/20 px-4 py-2 font-medium text-red-400 text-sm transition-all duration-300 hover:bg-red-500/30"
          onClick={disconnect}
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div className="wallet-button-custom">
      <WalletMultiButton className="!bg-gradient-to-r !from-indigo-500 !to-purple-600 !border-none !rounded-xl !text-white !font-medium !px-6 !py-2.5 !transition-all !duration-300 hover:!from-indigo-600 hover:!to-purple-700 hover:!scale-105 !glow-effect" />
    </div>
  );
};

export default WalletButton;
