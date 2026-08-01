import { IsNotEmpty, IsString } from 'class-validator';

export class ResolveProductDto {
  @IsString()
  @IsNotEmpty()
  input: string;
}
