/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { MarketSymbol } from './model/market-symbol';
import { publicMarketDataUrl } from '../../config';
import { firstValueFrom } from 'rxjs';
import { MarketData } from './model/market-data';

@Injectable()
export class BinanceService {
  private readonly logger = new Logger(BinanceService.name);
  constructor(private readonly httpService: HttpService) {}

  public async fetchHistoricalMarketData(
    symbol: MarketSymbol,
    from: Date,
    to: Date,
  ): Promise<MarketData[]> {
    try {
      const url = `${publicMarketDataUrl}/api/v3/klines`;
      const res$ = this.httpService.get<any[][]>(url, {
        params: {
          symbol,
          interval: '1h', // TODO: adjust interval based on the time range
          startTime: from.getTime(),
          endTime: to.getTime(),
        },
      });
      const res = await firstValueFrom(res$);
      const serialized = this.serialize(res.data);
      return serialized;
    } catch (err) {
      this.logger.error(err.message, err.stack);
      throw new InternalServerErrorException('Error');
    }
  }

  private serialize(data: any[][]): MarketData[] {
    return data.map((obj) => {
      const [openTime, openPrice, highPrice, lowPrice, closePrice] = obj;
      return { openTime, openPrice, highPrice, lowPrice, closePrice };
    });
  }
}
