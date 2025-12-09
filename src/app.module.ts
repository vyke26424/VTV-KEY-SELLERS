
import { Module } from '@nestjs/common';

import { AuthService } from './auth/auth/auth.service';
import { AuthController } from './auth/auth/auth.controller';
import { AuthModule } from './auth/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from './prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from './user/user/user.service';
import { UserModule } from './user/user/user.module';
import { AdminModule } from './admin/admin/admin.module';
import { AdminProductService } from './admin/services/admin-product/admin-product.service';
import { AdminCategoryService } from './admin/services/admin-category/admin-category.service';
import { AdminCategoryController } from './admin/controller/admin-category/admin-category.controller';
import { AdminProductController } from './admin/controller/admin-product/admin-product.controller';
import { OrdersModule } from './orders/orders.module';
import { ProductsModule } from './products/products.module';

// newly added
import { SearchModule } from './search/search.module';

import { AdminProductVariantsService } from './admin/services/admin-product-variants/admin-product-variants.service';
import { AdminProductVariantsController } from './admin/controller/admin-product-variants/admin-product-variants.controller';


@Module({
  imports: [ConfigModule.forRoot({
    isGlobal : true
  }),
  ScheduleModule.forRoot(),
    AuthModule,
  PrismaModule, JwtModule, UserModule, AdminModule, OrdersModule, ProductsModule,SearchModule],
  //controllers: [AuthController, AdminCategoryController, AdminProductController],
  //providers: [AuthService, UserService, AdminProductService, AdminCategoryService,

  //PrismaModule, JwtModule, UserModule, AdminModule, OrdersModule, ProductsModule],
  controllers: [AuthController, AdminCategoryController, AdminProductController, AdminProductVariantsController],
  providers: [AuthService, UserService, AdminProductService, AdminCategoryService, AdminProductVariantsService],
})
export class AppModule {}
