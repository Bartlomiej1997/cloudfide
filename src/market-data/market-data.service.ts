import { Injectable, NotFoundException } from '@nestjs/common';
import { MarketSymbol } from '../binance/model/market-symbol';
import { MarketDataStatsDto } from './dto/market-data-stats.dto';
import { BinanceService } from '../binance/binance.service';
import { MarketData } from '../binance/model/market-data';

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
    if (!data.length) throw new NotFoundException('No data found');
    return this.serialize(data);
  }

  private serialize(data: MarketData[]): MarketDataStatsDto {
    const openPrice = data.at(0)!.openPrice;
    const closePrice = data.at(-1)!.closePrice;
    const initialValue = {
      changeRateInPercent: this.calculateChangeRateInPercent(
        Number(closePrice),
        Number(openPrice),
      ),
      openPrice,
      highPrice: '0',
      lowPrice: `${Number.MAX_SAFE_INTEGER}`,
      closePrice,
    };

    return data.reduce((acc, candlestick) => {
      if (Number(candlestick.highPrice) > Number(acc.highPrice)) {
        acc.highPrice = candlestick.highPrice;
      }
      if (Number(candlestick.lowPrice) < Number(acc.lowPrice)) {
        acc.lowPrice = candlestick.lowPrice;
      }
      return acc;
    }, initialValue);
  }

  private calculateChangeRateInPercent(closePrice: number, openPrice: number) {
    return ((closePrice - openPrice) / openPrice) * 100;
  }
}
