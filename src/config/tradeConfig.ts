import { TradeConfig } from '../types/TradeConfig';
import { Interval } from '../types/Interval';

export const tradeConfig: TradeConfig = {
  sl: 1.5,
  tp: 2.0,
  maxTradeLength: 240,
  leverage: 10,
  maxOpenPositions: 3,
  interval: Interval['5m'],
  lookBackLength: 100,
  fee: 0.075,
  riskPt: 1,
  minAmountToTrade: 10,
  apiLimit: 500 
};