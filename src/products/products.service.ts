// Simple in-memory product service (demo only)
import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductDto } from './dtos/products.dto';

// Product type used in the service
type ProductType = { id: number; title: string; price: number };

@Injectable()
export class ProductsService {
  /**
   * In-memory products list used for demo/testing purposes.
   * In a real app this would be replaced by a repository/ORM.
   */
  private products: ProductType[] = [
    { id: 1, title: 'book', price: 100 },
    { id: 2, title: 'laptop', price: 150 },
    { id: 3, title: 'phone', price: 200 },
  ];

  // Get all products
  findAll(): ProductType[] {
    return this.products;
  }

  // Create a new product
  create(dto: ProductDto): ProductType {
    const newProduct: ProductType = {
      id: this.products.length + 1,
      title: dto.title,
      price: dto.price,
    };
    this.products.push(newProduct);
    return newProduct;
  }

  // Get product by id (throws if not found)
  findById(id: number): ProductType {
    const product = this.products.find(p => p.id === id);
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  // Update a product
  update(id: number, dto: ProductDto) {
    const product = this.products.find(p => p.id === id);
    if (!product) throw new NotFoundException('Product not found');
    product.title = dto.title;
    product.price = dto.price;
    return { message: 'Product updated successfully with id ' + id };
  }

  // Remove a product
  remove(id: number) {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) throw new NotFoundException('Product not found');
    this.products.splice(index, 1);
    return { message: 'Product deleted successfully' };
  }
}
