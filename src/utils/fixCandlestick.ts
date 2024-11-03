import { Candle } from '../types/Candle';
import { Interval } from '../types/Interval';

export function fixCandlestick({
  candlestick,
  start,
  end,
  interval,
}: {
  candlestick: Candle[];
  start: number;
  end: number;
  interval: Interval;
}): Candle[] {
  const fixedCandlestick: Candle[] = [];
  let time = start;
  let prevCandle: Candle | undefined;
  do {
    const candle = candlestick.find((c) => c.openTime === time);
    if (candle) {
      fixedCandlestick.push(candle);
      prevCandle = candle;
    } else if (prevCandle) {
      fixedCandlestick.push({
        ...prevCandle,
        openTime: time,
      });
    }
    time += interval;
  } while (time <= end);
  return fixedCandlestick;
}