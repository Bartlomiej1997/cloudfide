import { IsDateString } from 'class-validator';

export class MarketDataStatsQueryDto {
  @IsDateString()
  public from: string;
  @IsDateString()
  public to: string;
}
