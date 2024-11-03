import { ExchangeService } from '../infrastructure/ExchangeService';
import { DatabaseService } from '../infrastructure/DatabaseService';
import { BacktestDatabaseService } from '../infrastructure/BacktestDatabaseService';
import { backtestConfig } from '../config/backtestConfig';
import { validateTimeRanges } from '../utils/validateTimeRanges';
import { tradeConfig } from '../config/tradeConfig';
import { Candle } from '../types/Candle';
import { fixCandlestick } from '../utils/fixCandlestick';

export class Backtest {
  private backtestStartTime: number;
  private backtestEndTime: number;
  private forwardTestEndTime: number;

  constructor(
    private readonly exchangeService: ExchangeService,
    private readonly databaseService: DatabaseService,
    private readonly backtestDatabaseService: BacktestDatabaseService
  ) {
    this.backtestStartTime = backtestConfig.startTime;
    this.backtestEndTime = backtestConfig.endTime;
    this.forwardTestEndTime = backtestConfig.forwardTestEnd;
  }

  public async prepare(): Promise<void> {
    console.log(`Preparing backtest`);
    
    await this.databaseService.connect();
    await this.backtestDatabaseService.connect();

    console.log('Validating time ranges...');
    validateTimeRanges(this.backtestStartTime, this.backtestEndTime, this.forwardTestEndTime);

    // Fetch available trading pairs
    const pairList = await this.exchangeService.getPairList({ minAmountToTradeUSDT: tradeConfig.minAmountToTrade });
    console.log('Available trading pairs:', pairList);

    // For each pair, download the candlestick data, fix it, and save it
    for (const pair of pairList) {
      console.log(`Downloading and processing candlestick data for ${pair}`);
      
      const rawCandlesticks = await this.exchangeService.getCandlestick({
        pair,
        start: this.backtestStartTime,
        end: this.forwardTestEndTime,
        interval: backtestConfig.interval,
        apiLimit: tradeConfig.apiLimit 
      });

      const fixedCandlesticks = fixCandlestick({
        candlestick: rawCandlesticks,
        start: this.backtestStartTime,
        end: this.forwardTestEndTime,
        interval: tradeConfig.interval
      });

      await this.backtestDatabaseService.saveCandlestick(fixedCandlesticks);
      console.log(`Saved candlestick data for ${pair}`);
    }

    console.log('Backtest data preparation completed.');

    // Show saved information
    await this.backtestDatabaseService.showSavedInformation();
  }

  public async execute(): Promise<void> {
    console.log(`Running backtest `);
    // Backtest logic will be implemented here
  }

  public async forwardTest(): Promise<void> {
    console.log(`Running forward test `);
    // Forward testing logic will be implemented here
  }
}