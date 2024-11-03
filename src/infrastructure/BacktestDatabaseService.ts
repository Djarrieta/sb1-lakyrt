import { Database, open } from 'sqlite';
import sqlite3 from 'sqlite3';
import { Candle } from '../types/Candle';
import { withRetry } from '../utils/withRetry';
import { getDate } from '../utils/getDate';

export class BacktestDatabaseService {
  private db: Database | null = null;

  // ... (existing methods)

  async showSavedInformation(): Promise<void> {
    if (!this.db) throw new Error('Database not connected');

    return withRetry(async () => {
      const items = 5;
      const results = await this.db.all<{
        pair: string;
        count: number;
        startTime: number;
        endTime: number;
      }[]>(`
        SELECT pair, COUNT(*) AS count, MIN(openTime) AS startTime, MAX(openTime) AS endTime 
        FROM candlesticks 
        GROUP BY pair
        ORDER BY count DESC
      `);

      console.log(
        `Pairs in candlesticks table with number of candles and time range:\n${results
          .slice(0, items)
          .map(
            ({ pair, count, startTime, endTime }) =>
              `${pair} - ${count} candles from ${
                getDate(startTime).dateString
              } to ${getDate(endTime).dateString}`
          )
          .join(",\n")}${
          results.length > items
            ? `,\n ...and ${results.length - items} others`
            : ""
        }`
      );
    });
  }
}