import { IsOptional, IsString, IsNumber, IsNotEmpty, Length, Min } from 'class-validator';

export class UpdateProductDto {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @Length(5, 100)
    title?: string;

    @IsOptional()
    @IsString()
    @Length(5, 500)
    description?: string;
    
    @IsOptional()
    @IsNumber()
    @Min(0, { message: 'Price must be greater than 0' })
    price?: number;
}