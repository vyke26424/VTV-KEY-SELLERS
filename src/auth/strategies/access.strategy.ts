
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";

type JwtPayload = {
    sub : string ;
    email : string ;
    role : string
}
@Injectable()
export class AccessTokenStrategy extends PassportStrategy (Strategy, 'jwt') {
    constructor(configService : ConfigService){
        super({
            jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey : configService.getOrThrow<string>("JWT_ACCESS_SECRET"),
            ignoreExpiration : false, 
        });
    }
    validate( payload: JwtPayload) {
        return {
            userId : payload.sub,
            email : payload.email,
            role : payload.role
        }
    }
}