import { Backtest } from './domain/Backtest';
import { ExchangeService } from './infrastructure/ExchangeService';
import { DatabaseService } from './infrastructure/DatabaseService';

const apiKey = 'your-api-key-here';
const apiSecret = 'your-api-secret-here';
const exchangeService = new ExchangeService(apiKey, apiSecret);
const databaseService = new DatabaseService();

async function runBacktest() {
  await databaseService.connect();
  const backtest = new Backtest('BTCUSDT', exchangeService, databaseService);

  console.log('Starting backtest process...');
  await backtest.execute();
  console.log('Backtest process completed.');

  const backtestResults = await databaseService.getBacktestResults('BTCUSDT');
  console.log('Recent backtest results:', backtestResults);
}

runBacktest().catch(console.error);