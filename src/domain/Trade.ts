import { ExchangeService } from '../infrastructure/ExchangeService';
import { DatabaseService } from '../infrastructure/DatabaseService';

export class Trade {
  constructor(
    private readonly symbol: string,
    private readonly quantity: number,
    private readonly exchangeService: ExchangeService,
    private readonly databaseService: DatabaseService
  ) {}

  public async execute(): Promise<void> {
    console.log(`Initiating trade for ${this.quantity} shares of ${this.symbol}`);
    const success = await this.exchangeService.executeTrade(this.symbol, this.quantity);
    
    if (success) {
      console.log(`Trade for ${this.quantity} shares of ${this.symbol} completed successfully`);
      // Assuming the current market price is the execution price
      const currentPrice = await this.exchangeService.getCurrentPrice(this.symbol);
      await this.databaseService.addTrade(this.symbol, this.quantity, currentPrice);
    } else {
      console.log(`Trade for ${this.quantity} shares of ${this.symbol} failed`);
    }
  }
}