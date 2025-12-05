
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


@Module({
  imports: [ConfigModule.forRoot({
    isGlobal : true
  }),
  ScheduleModule.forRoot(),
    AuthModule,
  PrismaModule, JwtModule, UserModule, AdminModule],
  controllers: [AuthController, AdminCategoryController],
  providers: [AuthService, UserService, AdminProductService, AdminCategoryService],
})
export class AppModule {}
