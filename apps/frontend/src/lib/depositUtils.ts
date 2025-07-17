import { PublicKey } from '@solana/web3.js';
import type { FormattedStrategy } from '@/hooks/useStrategies';
import type { UserDeposit } from '@/hooks/useUserDeposits';

/**
 * Informations sur les tokens avec leurs décimales
 */
export const TOKEN_DECIMALS_MAP: Record<string, number> = {
  USDC: 6,
  SOL: 9,
  RAY: 6,
  USDT: 6,
  BTC: 8,
  ETH: 18,
  UNKNOWN: 9, // Fallback par défaut
};

/**
 * Symboles des tokens connus
 */
export const TOKEN_SYMBOLS: Record<string, string> = {
  '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU': 'USDC', // USDC devnet
  So11111111111111111111111111111111111111112: 'SOL', // Wrapped SOL
  '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R': 'RAY', // RAY devnet
  EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v: 'USDC', // USDC mainnet
};

/**
 * Trouve la stratégie correspondante à un dépôt utilisateur
 */
export const findStrategyForDeposit = (
  deposit: UserDeposit,
  strategies: FormattedStrategy[]
): FormattedStrategy | null => {
  // Essayer de trouver par strategyAddress d'abord
  const strategyByAddress = strategies.find(
    (strategy) => strategy.publicKey.toString() === deposit.strategyAddress
  );

  if (strategyByAddress) {
    return strategyByAddress;
  }

  // Fallback: essayer de trouver par tokenAddress
  const tokenSymbol = getTokenSymbolFromAddress(deposit.tokenAddress);
  const strategyByToken = strategies.find(
    (strategy) => strategy.token === tokenSymbol
  );

  return strategyByToken || null;
};

/**
 * Obtient le symbole du token à partir de son adresse
 */
export const getTokenSymbolFromAddress = (address: string): string => {
  // Si c'est déjà un symbole (pour les données mock)
  if (address.length <= 4) {
    return address.toUpperCase();
  }

  // Chercher dans la map des adresses connues
  const symbol = TOKEN_SYMBOLS[address];
  if (symbol) {
    return symbol;
  }

  // Fallback pour les adresses inconnues
  console.warn(`Unknown token address: ${address}`);
  return 'UNKNOWN';
};

/**
 * Obtient le nombre de décimales d'un token
 */
export const getTokenDecimals = (tokenSymbol: string): number => {
  return TOKEN_DECIMALS_MAP[tokenSymbol] || TOKEN_DECIMALS_MAP['UNKNOWN'];
};

/**
 * Formate un montant selon les décimales du token
 */
export const formatTokenAmount = (
  amount: string | number,
  tokenSymbol: string,
  showSymbol = true
): string => {
  const numAmount =
    typeof amount === 'string' ? Number.parseFloat(amount) : amount;
  const decimals = getTokenDecimals(tokenSymbol);

  // Ajuster le formatage selon le token et le montant
  let formatted: string;

  if (numAmount === 0) {
    formatted = '0';
  } else if (numAmount < 0.01) {
    // Pour les très petits montants, utiliser plus de décimales
    formatted = numAmount.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: Math.min(decimals, 8),
    });
  } else if (numAmount < 1) {
    // Pour les montants < 1, utiliser 4-6 décimales
    formatted = numAmount.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: Math.min(decimals, 6),
    });
  } else if (numAmount < 1000) {
    // Pour les montants moyens, utiliser 2-4 décimales
    formatted = numAmount.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: Math.min(decimals, 4),
    });
  } else {
    // Pour les gros montants, utiliser 2 décimales maximum
    formatted = numAmount.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: Math.min(decimals, 2),
    });
  }

  return showSymbol ? `${formatted} ${tokenSymbol}` : formatted;
};

/**
 * Convertit un montant en unités de base du token
 */
export const toTokenBaseUnits = (amount: number, decimals: number): bigint => {
  return BigInt(Math.floor(amount * 10 ** decimals));
};

/**
 * Convertit des unités de base du token en montant lisible
 */
export const fromTokenBaseUnits = (
  amount: bigint,
  decimals: number
): number => {
  return Number(amount) / 10 ** decimals;
};

/**
 * Convertit un montant stocké (potentiellement en unités de base) vers un montant d'affichage
 */
export const convertStoredAmountToDisplayAmount = (
  storedAmount: string | number,
  tokenSymbol: string
): number => {
  const numAmount =
    typeof storedAmount === 'string'
      ? Number.parseFloat(storedAmount)
      : storedAmount;
  const decimals = getTokenDecimals(tokenSymbol);

  // Si le montant semble être en unités de base (très grand nombre)
  // on le convertit en unités d'affichage
  if (numAmount > 1_000_000) {
    return fromTokenBaseUnits(BigInt(Math.floor(numAmount)), decimals);
  }

  // Sinon, on assume que c'est déjà en unités d'affichage
  return numAmount;
};

/**
 * Enrichit un dépôt utilisateur avec les informations de la stratégie
 */
export interface EnrichedUserDeposit extends UserDeposit {
  strategy?: FormattedStrategy | null;
  tokenSymbol: string;
  tokenDecimals: number;
  formattedAmount: string;
  formattedYieldAmount: string;
}

/**
 * Enrichit une liste de dépôts avec les informations des stratégies
 */
export const enrichDepositsWithStrategyInfo = (
  deposits: UserDeposit[],
  strategies: FormattedStrategy[]
): EnrichedUserDeposit[] => {
  return deposits.map((deposit) => {
    const strategy = findStrategyForDeposit(deposit, strategies);
    const tokenSymbol =
      strategy?.token || getTokenSymbolFromAddress(deposit.tokenAddress);
    const tokenDecimals = getTokenDecimals(tokenSymbol);

    // Convertir les montants stockés vers les montants d'affichage
    const displayAmount = convertStoredAmountToDisplayAmount(
      deposit.amount,
      tokenSymbol
    );
    const displayYieldAmount = convertStoredAmountToDisplayAmount(
      deposit.yieldAmount,
      tokenSymbol
    );

    return {
      ...deposit,
      strategy,
      tokenSymbol,
      tokenDecimals,
      formattedAmount: formatTokenAmount(displayAmount, tokenSymbol, true),
      formattedYieldAmount: formatTokenAmount(
        displayYieldAmount,
        tokenSymbol,
        true
      ),
    };
  });
};

/**
 * Utilitaire pour créer des stats enrichies
 */
export const calculateEnrichedStats = (
  enrichedDeposits: EnrichedUserDeposit[]
) => {
  const totalsByToken: Record<
    string,
    { amount: number; yieldAmount: number; count: number }
  > = {};

  enrichedDeposits.forEach((deposit) => {
    const { tokenSymbol } = deposit;

    // Utiliser les montants convertis pour les stats
    const displayAmount = convertStoredAmountToDisplayAmount(
      deposit.amount,
      tokenSymbol
    );
    const displayYieldAmount = convertStoredAmountToDisplayAmount(
      deposit.yieldAmount,
      tokenSymbol
    );

    if (!totalsByToken[tokenSymbol]) {
      totalsByToken[tokenSymbol] = { amount: 0, yieldAmount: 0, count: 0 };
    }

    totalsByToken[tokenSymbol].amount += displayAmount;
    totalsByToken[tokenSymbol].yieldAmount += displayYieldAmount;
    totalsByToken[tokenSymbol].count += 1;
  });

  return {
    totalDeposits: enrichedDeposits.length,
    totalsByToken,
    maturedDeposits: enrichedDeposits.filter((d) => d.isMatured).length,
    pendingDeposits: enrichedDeposits.filter((d) => !d.isMatured).length,
  };
};

/**
 * Obtient le montant d'affichage formaté pour un dépôt
 */
export const getDisplayAmount = (deposit: EnrichedUserDeposit): string => {
  if (deposit.formattedAmount) {
    return deposit.formattedAmount;
  }

  const displayAmount = convertStoredAmountToDisplayAmount(
    deposit.amount,
    deposit.tokenSymbol
  );
  return formatTokenAmount(displayAmount, deposit.tokenSymbol, true);
};

/**
 * Obtient le montant de yield d'affichage formaté pour un dépôt
 */
export const getDisplayYieldAmount = (deposit: EnrichedUserDeposit): string => {
  if (deposit.formattedYieldAmount) {
    return deposit.formattedYieldAmount;
  }

  const displayYieldAmount = convertStoredAmountToDisplayAmount(
    deposit.yieldAmount,
    deposit.tokenSymbol
  );
  return formatTokenAmount(displayYieldAmount, deposit.tokenSymbol, true);
};

/**
 * Obtient le montant numérique d'affichage pour un dépôt
 */
export const getDisplayAmountNumeric = (
  deposit: EnrichedUserDeposit
): number => {
  return convertStoredAmountToDisplayAmount(
    deposit.amount,
    deposit.tokenSymbol
  );
};

/**
 * Obtient le montant de yield numérique d'affichage pour un dépôt
 */
export const getDisplayYieldAmountNumeric = (
  deposit: EnrichedUserDeposit
): number => {
  return convertStoredAmountToDisplayAmount(
    deposit.yieldAmount,
    deposit.tokenSymbol
  );
};
