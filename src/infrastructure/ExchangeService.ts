import Binance, { CandleChartInterval_LT } from 'binance-api-node';
import { Interval } from '../types/Interval';
import { Candle } from '../types/Candle';

interface Params {
  minAmountToTradeUSDT: number;
}

export class ExchangeService {
  private exchange: ReturnType<typeof Binance>;

  constructor(
    private readonly apiKey?: string,
    private readonly apiSecret?: string,
    exchangeClient: ReturnType<typeof Binance> | null = null
  ) {
    this.exchange = exchangeClient || Binance({
      apiKey: this.apiKey,
      apiSecret: this.apiSecret,
    });
  }

  public async executeTrade(symbol: string, quantity: number): Promise<boolean> {
    console.log(`Executing trade: ${quantity} shares of ${symbol}`);
    
    try {
      // Implement actual trade execution using Binance API
      // This is a placeholder and should be replaced with actual API calls
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Trade executed successfully');
      return true;
    } catch (error) {
      console.error('Trade execution failed:', error);
      return false;
    }
  }

  public async getCurrentPrice(symbol: string): Promise<number> {
    try {
      const ticker = await this.exchange.prices({ symbol });
      if (ticker && typeof ticker[symbol] === 'string') {
        return parseFloat(ticker[symbol]);
      }
      throw new Error(`Unable to get price for symbol: ${symbol}`);
    } catch (error) {
      console.error('Error fetching current price:', error);
      return 0;
    }
  }

  public async getPairList(params: Params): Promise<string[]> {
    const pairList: string[] = [];
    try {
      const { symbols: unformattedList } = await this.exchange.futuresExchangeInfo();
      const prices = await this.exchange.futuresMarkPrice();
      for (const symbol of unformattedList) {
        const {
          symbol: pair,
          status,
          quoteAsset,
          baseAsset,
          contractType,
          filters,
        }: any = symbol;

        const minQty = Number(
          filters.find((f: any) => f.filterType === "LOT_SIZE").minQty
        );
        const minNotional = Number(
          filters.find((f: any) => f.filterType === "MIN_NOTIONAL").notional
        );
        const currentPrice =
          Number(prices.find((p: any) => p.symbol === pair)?.markPrice) || 0;
        const minQuantityUSD = minQty * currentPrice;

        if (
          status !== "TRADING" ||
          quoteAsset !== "USDT" ||
          baseAsset === "USDT" ||
          contractType !== "PERPETUAL" ||
          minQuantityUSD > params.minAmountToTradeUSDT ||
          minNotional > params.minAmountToTradeUSDT
        ) {
          continue;
        }
        pairList.push(pair);
      }
    } catch (error) {
      console.error('Error fetching pair list:', error);
    }
    return pairList;
  }

  async getCandlestick({
    pair,
    start,
    end,
    interval,
    apiLimit,
  }: {
    pair: string;
    interval: Interval;
    start: number;
    end: number;
    apiLimit: number;
  }): Promise<Candle[]> {
    let candlestick: Candle[] = [];

    let startTime = start;
    let endTime = end + interval;

    do {
      let lookBackLength = Math.floor((endTime - startTime) / interval);
      if (lookBackLength > apiLimit) {
        endTime = startTime + (apiLimit - 1) * interval;
        lookBackLength = apiLimit;
      }

      const unformattedCandlestick = await this.exchange.futuresCandles({
        symbol: pair,
        interval: Interval[interval] as CandleChartInterval_LT,
        startTime,
        limit: lookBackLength,
      });

      const formattedCandlestick = unformattedCandlestick.map(
        ({ close, open, high, low, openTime, volume }) => {
          return {
            pair,
            close: Number(close),
            open: Number(open),
            high: Number(high),
            low: Number(low),
            openTime: Number(openTime),
            volume: Number(volume),
          };
        }
      );
      candlestick.push(...formattedCandlestick);

      startTime = endTime + interval;
      endTime = end + interval;
    } while (startTime < end);

    return candlestick;
  }
}