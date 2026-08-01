import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';

export enum DealSortOption {
  DISCOUNT = 'discount',
  PRICE_ASC = 'price_asc',
  PRICE_DESC = 'price_desc',
  POPULARITY = 'popularity',
  NEWEST = 'newest',
}

export class QueryDealsDto {
  @IsString()
  @IsOptional()
  store?: string;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  @IsOptional()
  minDiscount?: number;

  @IsString()
  @IsOptional()
  category?: string;

  @IsEnum(DealSortOption)
  @IsOptional()
  sort?: DealSortOption = DealSortOption.POPULARITY;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  limit?: number = 12;
}
