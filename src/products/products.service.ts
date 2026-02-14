// Simple in-memory product service (demo only)
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dtos/creat-products.dto';
import { UpdateProductDto } from './dtos/update-product.dto';
import {  Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './product.entity';
// Product type used in the service
type ProductType = { id: number; title: string; price: number };

@Injectable()
export class ProductsService {

  constructor(@InjectRepository(ProductEntity)
   private readonly productsRepository: Repository<ProductEntity>
  ) {}

  private products: ProductType[] = [
    { id: 1, title: 'book', price: 100 },
    { id: 2, title: 'laptop', price: 150 },
    { id: 3, title: 'phone', price: 200 },
  ];

  // Get all products
  public getAllProducts() {
    return this.productsRepository.find();
  }

  // Create a new product
 public createProduct (dto: CreateProductDto) {
   
    const newProduct = this.productsRepository.create(dto);
    return  this.productsRepository.save(newProduct);
  }

  // Get product by id (throws if not found)
 public async getProductById(id: number) {
    const product=await this.productsRepository.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  // Update a product
  public async updateProduct(id: number, dto: UpdateProductDto) {
   const product=await this.getProductById(id);
   product!.title = dto.title ?? product!.title;
   product!.price = dto.price ?? product!.price ?? 0;
   product!.description = dto.description ?? product!.description ?? '';
   return this.productsRepository.save(product!);
  }

  // Remove a product
  public async deleteProduct(id: number) {
    const product=await this.getProductById(id);
   await this.productsRepository.remove(product!);
   return {message : 'product deleted successfully'}
  }
}
