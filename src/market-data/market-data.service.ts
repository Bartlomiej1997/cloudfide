import { Injectable } from '@nestjs/common';
import { MarketSymbol } from '../binance/model/market-symbol';
import { MarketDataStatsDto } from './dto/market-data-stats.dto';
import { BinanceService } from '../binance/binance.service';

@Injectable()
export class MarketDataService {
  constructor(private readonly binanceService: BinanceService) {}

  public async getStats(
    symbol: MarketSymbol,
    from: Date,
    to: Date,
  ): Promise<MarketDataStatsDto> {
    const data = await this.binanceService.fetchHistoricalMarketData(
      symbol,
      from,
      to,
    );
    console.log({ symbol, from, to });
    console.log({ data });
    return { changeRateInPercent: 123 };
  }
}
