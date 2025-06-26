"use client";

import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';

const WalletButton: React.FC = () => {
  const { connected, publicKey, disconnect } = useWallet();

  if (connected && publicKey) {
    return (
      <div className="flex items-center space-x-3">
        {/* Connected wallet display */}
        <div className="hidden sm:flex items-center space-x-2 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20">
          <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></div>
          <span className="text-white/90 font-mono text-sm">
            {publicKey.toString().slice(0, 4)}...{publicKey.toString().slice(-4)}
          </span>
        </div>
        
        {/* Disconnect button */}
        <button
          onClick={disconnect}
          className="px-4 py-2 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 transition-all duration-300 font-medium text-sm"
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
