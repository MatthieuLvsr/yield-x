import type { PublicKey } from '@solana/web3.js';
import type { YieldApp } from './yield_app';

// ✅ Helper pour extraire tous les types d'événements
type ExtractEventType<T extends YieldApp['types'][number]['name']> = Extract<
  YieldApp['types'][number],
  { name: T }
>['type'];

// ✅ Helper pour convertir les types IDL en types TypeScript
type ConvertField<T> = T extends 'pubkey'
  ? PublicKey
  : T extends 'u64' | 'i64'
    ? number
    : T extends 'bool'
      ? boolean
      : T extends 'string'
        ? string
        : unknown;

// biome-ignore lint/suspicious/noExplicitAny: because it's ok
type ConvertEventFields<T extends { fields: readonly any[] }> = {
  [K in T['fields'][number] as K['name']]: ConvertField<K['type']>;
};

// ✅ Types d'événements exportés
export type DepositEvent = ConvertEventFields<ExtractEventType<'depositEvent'>>;
export type RedeemEvent = ConvertEventFields<ExtractEventType<'redeemEvent'>>;
export type CreateStrategyEvent = ConvertEventFields<
  ExtractEventType<'createStrategyEvent'>
>;
export type CreateMarketEvent = ConvertEventFields<
  ExtractEventType<'createMarketEvent'>
>;
export type ExecuteTradeEvent = ConvertEventFields<
  ExtractEventType<'executeTradeEvent'>
>;
export type PlaceOrderEvent = ConvertEventFields<
  ExtractEventType<'placeOrderEvent'>
>;
export type CancelOrderEvent = ConvertEventFields<
  ExtractEventType<'cancelOrderEvent'>
>;

// ✅ Union type de tous les événements
export type YieldAppEvent =
  | { type: 'depositEvent'; data: DepositEvent }
  | { type: 'redeemEvent'; data: RedeemEvent }
  | { type: 'createStrategyEvent'; data: CreateStrategyEvent }
  | { type: 'createMarketEvent'; data: CreateMarketEvent }
  | { type: 'executeTradeEvent'; data: ExecuteTradeEvent }
  | { type: 'placeOrderEvent'; data: PlaceOrderEvent }
  | { type: 'cancelOrderEvent'; data: CancelOrderEvent };
