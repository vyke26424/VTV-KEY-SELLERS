
import { Module } from '@nestjs/common';

import { AuthService } from './auth/auth/auth.service';
import { AuthController } from './auth/auth/auth.controller';
import { AuthModule } from './auth/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from './prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';


@Module({
  imports: [ConfigModule.forRoot({
    isGlobal : true
  }),
  ScheduleModule.forRoot(),
    AuthModule,
  PrismaModule, JwtModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AppModule {}
