import { IsString, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class ProductDto {
    @IsString()
    title: string;

    @IsNumber()
    @Type(() => Number)
    price: number;
}