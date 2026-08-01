import { IsEnum, IsOptional, IsString } from 'class-validator';

export enum TimeRange {
  SEVEN_DAYS = '7d',
  ONE_MONTH = '1m',
  THREE_MONTHS = '3m',
  SIX_MONTHS = '6m',
  ALL = 'all',
}

export class PriceHistoryQueryDto {
  @IsEnum(TimeRange)
  @IsOptional()
  range?: TimeRange = TimeRange.ALL;

  @IsString()
  @IsOptional()
  store?: string;
}
