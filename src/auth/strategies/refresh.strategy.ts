import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from "express";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, UnauthorizedException,  } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth/auth.service';



type JwtPayload = {
    sub : string,
    email : string,
    role : string,
    jti : string
}
@Injectable()
export class RefreshTokenStrategy extends PassportStrategy (Strategy, 'jwt-refresh') {
   
    constructor(private readonly configService : ConfigService,
        private readonly authService : AuthService
    ) {
        super({
            jwtFromRequest : ExtractJwt.fromExtractors([
                (req : Request) => {
                    if(req && req.cookies && req.cookies.refreshToken) {
                        return req.cookies.refreshToken ;
                    }
                    return null ;
                }
            ]),
            secretOrKey : configService.getOrThrow<string>('JWT_REFRESH_SECRET'),
            // cho phép truyền req vào hàm bên dưới
            passReqToCallback : true
        });
        
    }
    async validate(req : Request, payload : JwtPayload) {
        const refresToken = req.cookies.refreshToken ;
        const userid = payload.sub; 
        const isValid = await this.authService.checkRefreshTokeisValid(userid, refresToken);
        if(!isValid) {
            return new UnauthorizedException('RefreshToken không hợp lệ');
        }
        return {
            userId : payload.sub,
            email : payload.email,
            role : payload.role,
            jti : payload.jti,
            refresToken
        }
    }
}