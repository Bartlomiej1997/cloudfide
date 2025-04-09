import { Controller, Get, Logger, Param, Query } from '@nestjs/common';
import { MarketDataService } from './market-data.service';
import { MarketDataStatsDto } from './dto/market-data-stats.dto';
import { MarketDataStatsParamsDto } from './dto/market-data-stats-params.dto';
import { MarketDataStatsQueryDto } from './dto/market-data-stats-query.dto';

@Controller('market-data')
export class MarketDataController {
  private readonly logger = new Logger(MarketDataController.name);
  constructor(private readonly marketDataService: MarketDataService) {}

  @Get('stats/:symbol')
  public async getStats(
    @Param() params: MarketDataStatsParamsDto,
    @Query() query: MarketDataStatsQueryDto,
  ): Promise<MarketDataStatsDto> {
    this.logger.debug(
      `GET market-data/stats/:symbol, ${JSON.stringify({ params, query })}`,
    );
    return this.marketDataService.getStats(
      params.symbol,
      new Date(query.from),
      new Date(query.to),
    );
  }
}
