import { IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateReviewDto {
  @IsNotEmpty()
  @Transform(({ value }) => parseInt(value))
  productId: number;

  @IsInt()
  @Min(1)
  @Max(5)
  rating: number; // 1 đến 5 sao

  @IsOptional()
  @IsString()
  comment?: string;
}