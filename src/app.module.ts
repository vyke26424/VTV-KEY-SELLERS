import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

import { AuthModule } from './auth/auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { PrismaModule } from './prisma/prisma.module';
import { StorefrontModule } from './storefront/storefront.module';
import { MaintenanceGuard } from './common/guards/maintenance.guard';
import { AuthController } from './auth/auth/auth.controller';
import { AuthService } from './auth/auth/auth.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    ScheduleModule.forRoot(),
    ThrottlerModule.forRoot([{
      ttl: 60000, // Thời gian sống: 60000ms = 60 giây
      limit: 150, // Giới hạn: Tối đa 100 request mỗi 60 giây cho 1 IP
    }]),
    AuthModule,
    PrismaModule,
    JwtModule,
    AdminModule,
    StorefrontModule,
  ],
  controllers: [
    AuthController,
  ],
  providers: [
    AuthService,
    // Rate limiting guard
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    // Maintenance mode guard
    {
      provide: APP_GUARD,
      useClass: MaintenanceGuard,
    },
  ],
})
export class AppModule { }
