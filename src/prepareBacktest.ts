import { Backtest } from './domain/Backtest';
import { ExchangeService } from './infrastructure/ExchangeService';
import { DatabaseService } from './infrastructure/DatabaseService';
import { BacktestDatabaseService } from './infrastructure/BacktestDatabaseService';

const exchangeService = new ExchangeService();
const databaseService = new DatabaseService();
const backtestDatabaseService = new BacktestDatabaseService();

async function prepareBacktest() {
  const backtest = new Backtest(exchangeService, databaseService, backtestDatabaseService);

  try {
    await backtest.prepare();
    console.log('Backtest preparation completed successfully.');
  } catch (error) {
    console.error('Error during backtest preparation:', error);
  }
}

prepareBacktest().catch(console.error);