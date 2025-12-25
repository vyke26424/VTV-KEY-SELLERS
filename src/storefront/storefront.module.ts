import { Module } from '@nestjs/common';
import { UserController } from './controller/user/user.controller';
import { UserService } from './services/user/user.service';
import { OrdersService } from './services/orders/orders.service';
import { OrdersController } from './controller/orders/orders.controller';
import { EncryptionService } from '../admin/utils/encryption/encryption.service';
import { ProductsService } from './services/products/products.service';
import { ProductsController } from './controller/products/products.controller';
import { PrismaService } from '../prisma/prisma.service';
import { SearchService } from './services/search/search.service';
import { SearchController } from './controller/search/search.controller';
import { InteractionsService } from './services/interactions/interactions.service';
import { InteractionsController } from './controller/interactions/interactions.controller';
import { ReviewsService } from './services/reviews/reviews.service';
import { ReviewsController } from './controller/reviews/reviews.controller';

@Module({
  controllers: [
    UserController,
    OrdersController,
    ProductsController,
    SearchController,
    InteractionsController,
    ReviewsController,
  ],
  providers: [
    UserService,
    OrdersService,
    EncryptionService,
    ProductsService,
    PrismaService,
    SearchService,
    InteractionsService,
    ReviewsService,
  ],
  exports: [UserService, ProductsService, SearchService],
})
export class StorefrontModule {}