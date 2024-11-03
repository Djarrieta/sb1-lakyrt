import { Database, open } from 'sqlite';
import sqlite3 from 'sqlite3';

export class DatabaseService {
  private db: Database | null = null;

  async connect(): Promise<void> {
    if (!this.db) {
      this.db = await open({
        filename: './tradingbot.db',
        driver: sqlite3.Database
      });
      await this.initializeTables();
    }
  }

  private async initializeTables(): Promise<void> {
    if (!this.db) throw new Error('Database not connected');

    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS trades (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        symbol TEXT NOT NULL,
        quantity REAL NOT NULL,
        price REAL NOT NULL,
        timestamp INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS backtest_results (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        symbol TEXT NOT NULL,
        start_date INTEGER NOT NULL,
        end_date INTEGER NOT NULL,
        profit_loss REAL NOT NULL,
        total_trades INTEGER NOT NULL
      );
    `);
  }

  async addTrade(symbol: string, quantity: number, price: number): Promise<void> {
    if (!this.db) throw new Error('Database not connected');

    await this.db.run(
      'INSERT INTO trades (symbol, quantity, price, timestamp) VALUES (?, ?, ?, ?)',
      symbol, quantity, price, Date.now()
    );
  }

  async addBacktestResult(symbol: string, startDate: Date, endDate: Date, profitLoss: number, totalTrades: number): Promise<void> {
    if (!this.db) throw new Error('Database not connected');

    await this.db.run(
      'INSERT INTO backtest_results (symbol, start_date, end_date, profit_loss, total_trades) VALUES (?, ?, ?, ?, ?)',
      symbol, startDate.getTime(), endDate.getTime(), profitLoss, totalTrades
    );
  }

  async getTradesForSymbol(symbol: string): Promise<any[]> {
    if (!this.db) throw new Error('Database not connected');

    return this.db.all('SELECT * FROM trades WHERE symbol = ? ORDER BY timestamp DESC', symbol);
  }

  async getBacktestResults(symbol: string): Promise<any[]> {
    if (!this.db) throw new Error('Database not connected');

    return this.db.all('SELECT * FROM backtest_results WHERE symbol = ? ORDER BY start_date DESC', symbol);
  }
}