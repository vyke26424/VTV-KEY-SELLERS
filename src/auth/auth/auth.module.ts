import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AccessTokenStrategy } from '../strategies/access.strategy';
import { RefreshTokenStrategy } from '../strategies/refresh.strategy';

@Module({
    imports : [JwtModule.register({})],
    providers : [AuthService, PrismaService,
        AccessTokenStrategy, RefreshTokenStrategy
    ],
    controllers : [AuthController]
})
export class AuthModule {}
