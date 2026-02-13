import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';
import { ReviewsModule } from './reviews/reviews.module';
import { AppController } from './app.controller';

@Module({
  imports: [ProductsModule, UsersModule, ReviewsModule],
  controllers: [AppController],
})
export class AppModule {}
//HELLO FROM LEANER

