import { IsString, IsNumber, IsNotEmpty, Length, Min, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    @Length(5, 100)
    title: string;

    @IsOptional()
    @IsString()
    @Length(5, 500)
    description: string;

    @IsNumber()
    @Type(() => Number)
    @Min(0, { message: 'Price must be greater than 0' })
    price: number;
}