import { Injectable } from '@nestjs/common';
import { MarketSymbol } from '../binance/model/market-symbol';
import { MarketDataStatsDto } from './dto/market-data-stats.dto';
import { BinanceService } from '../binance/binance.service';
import { MarketData } from '../binance/model/market-data';

@Injectable()
export class MarketDataService {
  constructor(private readonly binanceService: BinanceService) {
    // console.log(
    //   this.serialize([
    //     {
    //       openTime: 1,
    //       openPrice: 6,
    //       highPrice: 3,
    //       lowPrice: 1,
    //       closePrice: 2,
    //     },
    //     {
    //       openTime: 2,
    //       openPrice: 2,
    //       highPrice: 7,
    //       lowPrice: 2,
    //       closePrice: 3,
    //     },
    //   ]),
    // );
  }

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

    return this.serialize(data);
  }

  private serialize(data: MarketData[]): MarketDataStatsDto {
    const openPrice = data.at(0)?.openPrice ?? '0';
    const closePrice = data.at(-1)?.closePrice ?? '0';
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
