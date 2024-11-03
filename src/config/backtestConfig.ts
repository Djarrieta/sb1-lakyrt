import { BacktestConfig } from '../types/BacktestConfig';
import { Interval } from '../types/Interval';
import { getDate, DateString } from '../utils/getDate';

export const backtestConfig: BacktestConfig = {
  lookBackLength: 200,
  slArray: [ 1],
  tpArray: [1 ],
  maxTradeLengthArray: [100],
  interval: Interval['5m'],
  startTime: getDate("2024 10 11 00:00:00" as DateString).dateMs,
  endTime: getDate("2024 10 12 00:00:00" as DateString).dateMs,
  forwardTestEnd: getDate("2024 10 13 00:00:00" as DateString).dateMs
};