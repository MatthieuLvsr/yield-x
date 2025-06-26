// src/hooks/useYieldProgram.ts
import { useMemo } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { AnchorProvider, Program, Idl } from "@coral-xyz/anchor";
import idl from "@/idl/yield_x.json";
import { PublicKey } from "@solana/web3.js";

// Remplace par l'adresse de ton programme déployé sur Solana
const PROGRAM_ID = new PublicKey("TON_PROGRAM_ID_ICI");

export function useYieldXProgram() {
  const { connection } = useConnection();
  const wallet = useWallet();

  const provider = useMemo(() => {
    if (!wallet || !wallet.publicKey || !wallet.signTransaction) return null;
    return new AnchorProvider(connection, wallet as any, {});
  }, [connection, wallet]);

  const program = useMemo(() => {
    if (!provider) return null;
    // Correction : l'API Anchor attend (idl, provider) et non (idl, programId, provider)
    return new Program(idl as unknown as Idl, provider);
  }, [provider]);

  return { program, provider, wallet, connection };
}
