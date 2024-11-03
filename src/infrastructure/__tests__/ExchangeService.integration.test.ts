import { ExchangeService } from '../ExchangeService';
import Binance from 'binance-api-node';

jest.mock('binance-api-node');

describe('ExchangeService Integration Tests', () => {
  let exchangeService: ExchangeService;

  beforeEach(() => {
    exchangeService = new ExchangeService('fake-api-key', 'fake-api-secret');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should return a list of valid trading pairs', async () => {
    // Mock the Binance API responses
    const mockFuturesExchangeInfo = {
      symbols: [
        {
          symbol: 'BTCUSDT',
          status: 'TRADING',
          quoteAsset: 'USDT',
          baseAsset: 'BTC',
          contractType: 'PERPETUAL',
          filters: [
            { filterType: 'LOT_SIZE', minQty: '0.001' },
            { filterType: 'MIN_NOTIONAL', notional: '5' },
          ],
        },
        {
          symbol: 'ETHUSDT',
          status: 'TRADING',
          quoteAsset: 'USDT',
          baseAsset: 'ETH',
          contractType: 'PERPETUAL',
          filters: [
            { filterType: 'LOT_SIZE', minQty: '0.01' },
            { filterType: 'MIN_NOTIONAL', notional: '5' },
          ],
        },
        {
          symbol: 'XRPUSDT',
          status: 'TRADING',
          quoteAsset: 'USDT',
          baseAsset: 'XRP',
          contractType: 'PERPETUAL',
          filters: [
            { filterType: 'LOT_SIZE', minQty: '1' },
            { filterType: 'MIN_NOTIONAL', notional: '5' },
          ],
        },
      ],
    };

    const mockFuturesMarkPrice = [
      { symbol: 'BTCUSDT', markPrice: '30000' },
      { symbol: 'ETHUSDT', markPrice: '2000' },
      { symbol: 'XRPUSDT', markPrice: '0.5' },
    ];

    (Binance as jest.MockedFunction<typeof Binance>).mockReturnValue({
      futuresExchangeInfo: jest.fn().mockResolvedValue(mockFuturesExchangeInfo),
      futuresMarkPrice: jest.fn().mockResolvedValue(mockFuturesMarkPrice),
    } as any);

    const result = await exchangeService.getPairList({ minAmountToTradeUSDT: 10 });

    expect(result).toEqual(['BTCUSDT', 'ETHUSDT']);
    expect(result).not.toContain('XRPUSDT'); // XRPUSDT should be filtered out due to minQuantityUSD
  });

  it('should handle API errors gracefully', async () => {
    (Binance as jest.MockedFunction<typeof Binance>).mockReturnValue({
      futuresExchangeInfo: jest.fn().mockRejectedValue(new Error('API Error')),
      futuresMarkPrice: jest.fn().mockRejectedValue(new Error('API Error')),
    } as any);

    const result = await exchangeService.getPairList({ minAmountToTradeUSDT: 10 });

    expect(result).toEqual([]);
  });
});