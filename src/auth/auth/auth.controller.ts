
import { Body, Controller, HttpCode, HttpStatus, Post, Req, Res } from '@nestjs/common';
import * as express from "express";
import { SignupDto } from '../dto/signup.dto';
import { AuthService } from './auth.service';
import { LoginDto } from '../dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService : AuthService){}
    // private readonly cookieOptions = {
    //     httpOnly : true,
    //     sameSite : 'lax',
    //     maxAge : 30 * 24 * 60 * 60 * 1000
    // }
    @Post('signup')
    @HttpCode(HttpStatus.CREATED) // 201
    async signup (@Body() dto : SignupDto, 
    @Res({passthrough : true}) res : express.Response) {
        const {accessToken, refreshToken} = await this.authService.signup(dto);
        res.cookie('refreshToken', refreshToken,{
            httpOnly : true, // cấm Js đọc, tránh hacker trộm token bằng mã độc (XSS)
            sameSite : 'lax', // hạn chế gửi chén tránh web lạ gửi lệnh mạo danh
            //secure : true, // chỉ dùng https, tránh mimd
            maxAge : 30 * 24 * 60 * 1000, // tự hủy token
        }) ;
        return {accessToken}
    }

    @Post('login')
    @HttpCode(HttpStatus.OK) //200
    async login (
        @Body() dto : LoginDto,
        @Res({passthrough : true}) res : express.Response
    ) {
        const {accessToken, refreshToken, user} = await this.authService.login(dto);
        res.cookie('refreshToken', refreshToken, {
            httpOnly : true, 
            sameSite : 'lax', 
            maxAge : 30 * 24 * 60 * 1000,
        });
        return {
            accessToken,
            user
        }
    }
    
    @Post('logout')
    @HttpCode(HttpStatus.OK) //204
    async logout(
        @Req() req : express.Request,
        @Res({passthrough : true}) res : express.Response
    ) {
        const token = req.cookies?.refreshToken ;
        if(token) {
            await this.authService.logout(token);
        }
        res.clearCookie('refreshToken', {
            httpOnly : true,
            sameSite : 'lax'
        });

        return {
            message : 'Đăng xuất thành công'
        }
    }

}
