import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';

@Module({
    imports : [JwtModule.register({})],
    providers : [AuthService, PrismaService,
        
    ],
    controllers : [AuthController]
})
export class AuthModule {}
