import {
    Controller,
    Post,
    Get,
    Body,
    Param,
    Put,
    Delete,
    ParseIntPipe,
} from '@nestjs/common';

import { CreateProductDto } from './dtos/creat-products.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import { ProductsService } from './products.service';

@Controller()
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}
    
    // GET /api/products - Get all p roducts
    @Get('/api/products')
    public getAllProducts() {
        return this.productsService.getAllProducts();
    }

    // POST /api/products - Create a new product
    @Post('/api/products')
    public createProduct(@Body() body: CreateProductDto) {
        return this.productsService.createProduct(body);
    }

    // GET /api/products/:id - Get product by id
    @Get('/api/products/:id')
    public getProductById(@Param('id', ParseIntPipe) id: number) {
        return this.productsService.getProductById(id);
    }

    // PUT /api/products/:id - Update product by id
    @Put('/api/products/:id')
    public updateProduct(@Param('id') id: string, @Body() body: UpdateProductDto) {
        return this.productsService.updateProduct(parseInt(id), body);
    }

    // DELETE /api/products/:id - Delete product by id
    @Delete('/api/products/:id')
    public deleteProduct(@Param('id') id: string) {
        return this.productsService.deleteProduct(parseInt(id));
    }
}
