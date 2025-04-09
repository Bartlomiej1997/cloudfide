import { IsEnum } from 'class-validator';
import { MarketSymbol } from '../../binance/model/market-symbol';

export class MarketDataStatsParamsDto {
  @IsEnum(MarketSymbol)
  public symbol: MarketSymbol;
}
