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

import { ProductDto } from './dtos/products.dto';
import { ProductsService } from './products.service';

@Controller()
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}
    
    // GET /api/products - Get all p roducts
    @Get('/api/products')
    public getAllProducts() {
        return this.productsService.findAll();
    }

    // POST /api/products - Create a new product
    @Post('/api/products')
    public createProduct(@Body() body: ProductDto) {
        return this.productsService.create(body);
    }

    // GET /api/products/:id - Get product by id
    @Get('/api/products/:id')
    public getProductById(@Param('id', ParseIntPipe) id: number) {
        return this.productsService.findById(id);
    }

    // PUT /api/products/:id - Update product by id
    @Put('/api/products/:id')
    public updateProduct(@Param('id') id: string, @Body() body: ProductDto) {
        return this.productsService.update(parseInt(id), body);
    }

    // DELETE /api/products/:id - Delete product by id
    @Delete('/api/products/:id')
    public deleteProduct(@Param('id') id: string) {
        return this.productsService.remove(parseInt(id));
    }
}
