

import { ConflictException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as argon2 from "argon2";
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from "uuid";
import  ms from "ms";
import { SignupDto } from '../dto/signup.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { LoginDto } from '../dto/login.dto';
import { use } from 'passport';


@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name)
    constructor(private readonly prisma : PrismaService,
        private readonly jwtService : JwtService,
        private readonly configService : ConfigService,
        
    ){}

    async signup(dto : SignupDto) {
       try {
            const passwordHash = await argon2.hash(dto.password);
            const user =  await this.prisma.user.create({
                data : {
                    email : dto.email,
                    password : passwordHash,
                    fullName : dto.fullName

                }
            });
            return this.issueTokens(user.id, user.role);
       } catch (error) {
            if(error instanceof PrismaClientKnownRequestError 
                && error.code === 'P2002'){
                    throw new ConflictException('Email đã được sử dụng');
                }
                throw error ; // 500 (lỗi mạng , db chết)
       }
        
    }

    async login(dto : LoginDto) {
        const user = await this.prisma.user.findUnique({
            where : {email : dto.email},
            select : {
                id : true,
                password : true,
                role : true
            }
        });
        if(!user) {
            throw new UnauthorizedException('Sai thông tin đăng nhập');
        }
        const isValid = await argon2.verify(user.password, dto.password);
        if(!isValid) {
            throw new UnauthorizedException('Sai thông tin đăng nhập');
        }
        return this.issueTokens(user.id, user.role) ;
    }

    async logout(refreshToken : string) {
        try {
            const secretRefresh = this.configService.getOrThrow('JWT_REFRESH_SECRET')
            const decoded = this.jwtService.verify(refreshToken, {
                secret : secretRefresh,
                ignoreExpiration : true
            });
            
            await this.deleteRefreshToken(decoded.jti);
        } catch (error) {
            if(error.name !== "JsonWebTokenError" && error.name !== "TokenExpiredError") {
                this.logger.error(`Logout fail : ${error.message}`, error.stack);
            }
        }
    }

    async deleteRefreshToken(jti : string) {
        await this.prisma.refreshToken.update({
            where: {
                tokenId: jti,
                //revoked: false
            },
            data : {
                revoked : true
            }
        })
    }

    // cấp token
    async issueTokens (userId : string, role : string) {
        const payload = {sub : userId, role}
        const jti = uuidv4();
        const secretAccess = this.configService.getOrThrow('JWT_ACCESS_SECRET');
        const expireAccess = this.configService.getOrThrow('JWT_ACCESS_EXPIRE');
        const secretRefresh = this.configService.getOrThrow('JWT_REFRESH_SECRET');
        const expireRefresh = this.configService.getOrThrow('JWT_REFRESH_EXPIRE');
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload,
                {
                   secret :  secretAccess,
                   expiresIn : expireAccess
                }
            ),
            this.jwtService.signAsync({
                ...payload,
                jti : jti
            },
            {
                secret : secretRefresh,
                expiresIn : expireRefresh
            }
        )
        ]);

        const hashRefreshToken = await argon2.hash(refreshToken);
        const expireIn = this.configService.getOrThrow('JWT_REFRESH_EXPIRE');
        const expiresAt = new Date(Date.now() + ms(expireIn))
        await this.prisma.refreshToken.create({
            data : {
                userId : userId,
                token : hashRefreshToken,
                tokenId : jti,
                expiresAt ,
                revoked : false
                
            }   
        })
        return {
            accessToken,
            refreshToken
        }
    }

    async checkRefreshTokeisValid (userId : string, rawToken : string) : Promise<boolean> {
        const storedToken = await this.prisma.refreshToken.findMany({
            where : {
                userId : userId,
                revoked : false
            }
        });
        if(!storedToken.length) {
            return false ;
        }
        for (const t of storedToken) {
            const isValid = await argon2.verify(t.token, rawToken);
            if(isValid) {
                if(new Date().getDate() > t.expiresAt.getDate()) {
                    console.log(`${new Date().getDate()} và ${t.expiresAt.getDate()}`);
                    return false;
                }
                return true
            }
        }
        return false ;
    }
}
