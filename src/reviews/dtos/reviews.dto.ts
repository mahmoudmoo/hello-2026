import { IsNotEmpty, IsString, IsNumber, Min, Max, Length, IsOptional, IsPositive } from 'class-validator';

export class ReviewDto {
  @IsOptional()
  @IsNumber()
  @IsPositive()
  id: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(5)
  hamada: number;

  @IsNotEmpty()
  @IsString()
  @Length(5, 500)
  comment: string;
}
