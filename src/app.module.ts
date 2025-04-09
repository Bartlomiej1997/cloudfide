import { Module } from '@nestjs/common';
import { BinanceModule } from './binance/binance.module';
import { MarketDataModule } from './market-data/market-data.module';

@Module({
  imports: [BinanceModule, MarketDataModule],
})
export class AppModule {}
