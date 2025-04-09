import { Controller, Get, Param, Query } from '@nestjs/common';
import { MarketDataService } from './market-data.service';
import { MarketDataStatsDto } from './dto/market-data-stats.dto';

@Controller('market-data')
export class MarketDataController {
  constructor(private readonly marketDataService: MarketDataService) {}

  @Get('stats/:symbol')
  public async getStats(
    @Param() params: any,
    @Query() query: any,
  ): Promise<MarketDataStatsDto> {
    console.log(params, query);
    const { from, to } = query;
    return this.marketDataService.getStats(
      params.symbol,
      new Date(from),
      new Date(to),
    );
  }
}
