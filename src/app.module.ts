import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';
import { ReviewsModule } from './reviews/reviews.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './products/product.entity';

@Module({
  imports:
    [ProductsModule, UsersModule, ReviewsModule,
      TypeOrmModule.forRoot({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: '090362',
        database: 'hello2026',
        synchronize: true, //only in development
        entities: [ProductEntity],
      }), 
    ],
})
export class AppModule { }
