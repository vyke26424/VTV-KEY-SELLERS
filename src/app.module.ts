import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { JwtModule } from '@nestjs/jwt';


import { AuthModule } from './auth/auth/auth.module';
import { UserModule } from './user/user/user.module';
import { AdminModule } from './admin/admin/admin.module';
import { OrdersModule } from './orders/orders.module';
import { ProductsModule } from './products/products.module';
import { SearchModule } from './search/search.module';
import { PrismaModule } from './prisma/prisma.module';


import { AuthService } from './auth/auth/auth.service';
import { AuthController } from './auth/auth/auth.controller';
import { UserService } from './user/user/user.service';
import { AdminProductService } from './admin/services/admin-product/admin-product.service';
import { AdminCategoryService } from './admin/services/admin-category/admin-category.service';
import { AdminCategoryController } from './admin/controller/admin-category/admin-category.controller';
import { AdminProductController } from './admin/controller/admin-product/admin-product.controller';
import { AdminProductVariantsService } from './admin/services/admin-product-variants/admin-product-variants.service';
import { AdminProductVariantsController } from './admin/controller/admin-product-variants/admin-product-variants.controller';
import { AdminStockitemService } from './admin/services/admin-stockitem/admin-stockitem.service';
import { AdminStockitemController } from './admin/controller/admin-stockitem/admin-stockitem.controller';
import { EncryptionService } from './admin/utils/encryption/encryption.service';
import { AdminOrdersController } from './admin/controller/admin-orders/admin-orders.controller';
import { AdminOrdersService } from './admin/services/admin-orders/admin-orders.service';


import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { UserController } from './admin/controller/admin-user/admin-user.controller';
import { AdminUserService } from './admin/services/admin-user/admin-user.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    ScheduleModule.forRoot(),
    ThrottlerModule.forRoot([{
      ttl: 60000, // Thời gian sống: 60000ms = 60 giây
      limit: 100, // Giới hạn: Tối đa 100 request mỗi 60 giây cho 1 IP
    }]),
    AuthModule,
    PrismaModule,
    JwtModule,
    UserModule,
    AdminModule,
    OrdersModule,
    ProductsModule,
    SearchModule],
  

  controllers: [
    AuthController,
    AdminCategoryController,
    AdminProductController,
    AdminProductVariantsController,
    AdminStockitemController,
    UserController,
    AdminOrdersController
  ],
  providers: [
    AuthService,
    UserService,
    AdminProductService,
    AdminCategoryService,
    AdminProductVariantsService,
    AdminStockitemService,
    EncryptionService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    AdminUserService,
    AdminOrdersService,
  ],



})
export class AppModule { }
