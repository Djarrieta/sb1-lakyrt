import { Interval } from './Interval';

export interface BacktestConfig {
  lookBackLength: number;
  slArray: number[];
  tpArray: number[];
  maxTradeLengthArray: number[];
  startTime: number;
  endTime: number;
  forwardTestEnd: number;
  interval: Interval;
}