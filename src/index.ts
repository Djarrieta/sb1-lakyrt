import { Trade } from './domain/Trade';
import { ExchangeService } from './infrastructure/ExchangeService';
import { DatabaseService } from './infrastructure/DatabaseService';

const apiKey = 'your-api-key-here';
const apiSecret = 'your-api-secret-here';
const exchangeService = new ExchangeService(apiKey, apiSecret);
const databaseService = new DatabaseService();

async function run() {
  await databaseService.connect();
  const trade = new Trade('BTCUSDT', 0.001, exchangeService, databaseService);

  await trade.execute();

  const pairList = await exchangeService.getPairList({ minAmountToTradeUSDT: 10 });
  console.log('Available trading pairs:', pairList);

  const trades = await databaseService.getTradesForSymbol('BTCUSDT');
  console.log('Recent trades:', trades);

  console.log(`Hello from TypeScript! Node.js version: ${process.versions.node}`);
}

run().catch(console.error);