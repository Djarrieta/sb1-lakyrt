import { fixCandlestick } from '../fixCandlestick';
import { Candle } from '../../types/Candle';
import { Interval } from '../../types/Interval';

describe('fixCandlestick', () => {
  const mockCandles: Candle[] = [
    { pair: 'BTCUSDT', open: 30000, high: 31000, low: 29000, close: 30500, volume: 100, openTime: 1625097600000 },
    { pair: 'BTCUSDT', open: 30500, high: 32000, low: 30000, close: 31500, volume: 150, openTime: 1625097900000 },
    { pair: 'BTCUSDT', open: 31500, high: 32500, low: 31000, close: 32000, volume: 120, openTime: 1625098200000 },
  ];

  it('should fill in missing candles', () => {
    const start = 1625097600000;
    const end = 1625098500000;
    const interval = Interval['5m'];

    const result = fixCandlestick({
      candlestick: mockCandles,
      start,
      end,
      interval,
    });

    expect(result.length).toBe(4);
    expect(result[0].openTime).toBe(1625097600000);
    expect(result[1].openTime).toBe(1625097900000);
    expect(result[2].openTime).toBe(1625098200000);
    expect(result[3].openTime).toBe(1625098500000);
    expect(result[3]).toEqual({ ...mockCandles[2], openTime: 1625098500000 });
  });

  it('should handle empty input', () => {
    const start = 1625097600000;
    const end = 1625098500000;
    const interval = Interval['5m'];

    const result = fixCandlestick({
      candlestick: [],
      start,
      end,
      interval,
    });

    expect(result.length).toBe(0);
  });

  it('should handle input with gaps', () => {
    const gappedCandles: Candle[] = [
      { pair: 'BTCUSDT', open: 30000, high: 31000, low: 29000, close: 30500, volume: 100, openTime: 1625097600000 },
      { pair: 'BTCUSDT', open: 31500, high: 32500, low: 31000, close: 32000, volume: 120, openTime: 1625098200000 },
    ];

    const start = 1625097600000;
    const end = 1625098500000;
    const interval = Interval['5m'];

    const result = fixCandlestick({
      candlestick: gappedCandles,
      start,
      end,
      interval,
    });

    expect(result.length).toBe(4);
    expect(result[0].openTime).toBe(1625097600000);
    expect(result[1].openTime).toBe(1625097900000);
    expect(result[1]).toEqual({ ...gappedCandles[0], openTime: 1625097900000 });
    expect(result[2].openTime).toBe(1625098200000);
    expect(result[3].openTime).toBe(1625098500000);
  });
});