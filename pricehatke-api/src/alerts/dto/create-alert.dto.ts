import { IsNumber, IsOptional, IsPositive, IsString, IsUUID } from 'class-validator';

export class CreateAlertDto {
  @IsUUID()
  @IsString()
  productId: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  targetPrice?: number;
}
