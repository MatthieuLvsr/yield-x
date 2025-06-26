"use client";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import "@solana/wallet-adapter-react-ui/styles.css";

export function PhantomConnectButton() {
  return (
    <WalletMultiButton className="rounded-full px-6 py-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg hover:from-indigo-600 hover:to-pink-600 transition-all" />
  );
}
