import { Interval } from './Interval';

export interface TradeConfig {
  sl: number;
  tp: number;
  maxTradeLength: number;
  leverage: number;
  maxOpenPositions: number;
  interval: Interval;
  lookBackLength: number;
  fee: number;
  riskPt: number;
  minAmountToTrade: number;
  apiLimit: number; 
}