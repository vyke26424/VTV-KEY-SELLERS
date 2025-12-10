

import { Body, Controller, HttpCode, HttpStatus, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import * as express from "express";
import { SignupDto } from '../dto/signup.dto';
import { AuthService } from './auth.service';
import { LoginDto } from '../dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { Throttle } from '@nestjs/throttler';

import type { RequestWithUser } from '../interfaces/request_user.interface';


@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    // private readonly cookieOptions = {
    //     httpOnly: true, 
    //     sameSite: 'lax' as const, // 'lax' là giá trị chuẩn cho sameSite
    //     // maxAge: 30 ngày (tính bằng mili-giây)
    //     maxAge: 30 * 24 * 60 * 60 * 1000 
    // };

    @Post('signup')
    @Throttle({ default: { limit: 3, ttl: 60000 } }) // Giới hạn 3 request mỗi 60 giây
    @HttpCode(HttpStatus.CREATED) // 201
    async signup(@Body() dto: SignupDto,
        @Res({ passthrough: true }) res: express.Response) {

        const data = await this.authService.signup(dto);

        res.cookie('refreshToken', data.refreshToken, {
            httpOnly: true, // cấm Js đọc, tránh hacker trộm token bằng mã độc (XSS)
            sameSite: 'lax', // hạn chế gửi chén tránh web lạ gửi lệnh mạo danh
            //secure : true, // chỉ dùng https, tránh mimd
            maxAge: 30 * 24 * 60 * 1000, // tự hủy token
        });
        return {
            accessToken: data.accessToken,
            user: data['user'] // Trick để lấy user nếu có
        }
    }

    @Post('login')
    @Throttle({ default: { limit: 5, ttl: 60000 } }) // Giới hạn 5 request mỗi 60 giây
    @HttpCode(HttpStatus.OK) //200
    async login(
        @Body() dto: LoginDto,
        @Res({ passthrough: true }) res: express.Response
    ) {

        const { accessToken, refreshToken, user } = await this.authService.login(dto);
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            sameSite: 'lax',
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });
        return {
            accessToken,
            user
        }
    }

    @Post('logout')
    @HttpCode(HttpStatus.OK) //200
    async logout(
        @Req() req: express.Request,
        @Res({ passthrough: true }) res: express.Response
    ) {
        const token = req.cookies?.refreshToken;
        if (token) {
            await this.authService.logout(token);
        }
        // Xóa Cookie
        res.clearCookie('refreshToken', {
            httpOnly: true,
            sameSite: 'lax'
        });

        return {
            message: 'Đăng xuất thành công'
        }
    }

    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    @UseGuards(AuthGuard('jwt-refresh'))
    async refresh(@Req() req: RequestWithUser, @Res({ passthrough: true }) res: express.Response) {
        const userId = req.user?.userId;
        const role = req.user?.role;
        const oldJti = req.user?.jti;
        if (!oldJti) {
            throw new UnauthorizedException('Access Denied (Missing JTI)');
        }
        const { accessToken, refreshToken } = await this.authService.refreshToken(userId, role, oldJti);
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            sameSite: 'lax',
            //secure : true,
            maxAge: 30 * 24 * 60 * 60 * 1000
        });
        return { accessToken };

    }

}
