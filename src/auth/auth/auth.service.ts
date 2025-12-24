import { ConflictException, Injectable, Logger, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as argon2 from "argon2";
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from "uuid";
import ms from "ms";
import { SignupDto } from '../dto/signup.dto';
import { LoginDto } from '../dto/login.dto';
import { Prisma } from '@prisma/client';
import { ChangePasswordDto } from '../dto/change-password.dto';

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name)
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) { }

    // --- ĐĂNG KÝ ---
    async signup(dto: SignupDto) {
        try {
            const passwordHash = await argon2.hash(dto.password);
            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    password: passwordHash,
                    fullName: dto.fullName
                }
            });
            const tokens = await this.issueTokens(user.id, user.role);

            // Trả về Token + User Info (để Frontend hiển thị ngay)
            return {
                ...tokens,
                user: {
                    id: user.id,
                    email: user.email,
                    fullName: user.fullName,
                    role: user.role
                }
            };
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new ConflictException(`Email ${dto.email} đã tồn tại`);
                }
            }
            throw error; // 500
        }
    }

    // --- ĐĂNG NHẬP ---
    async login(dto: LoginDto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
            select: {
                id: true,
                password: true,
                role: true,
                fullName: true, // Quan trọng: Lấy tên
                email: true     // Quan trọng: Lấy email
            }
        });

        if (!user) throw new UnauthorizedException('Sai thông tin đăng nhập');

        const isValid = await argon2.verify(user.password, dto.password);
        if (!isValid) throw new UnauthorizedException('Sai thông tin đăng nhập');

        const tokens = await this.issueTokens(user.id, user.role);

        // Loại bỏ password trước khi trả về
        const { password, ...rest } = user;
        return { ...tokens, user: rest };
    }

    // --- ĐĂNG XUẤT ---
    async logout(refreshToken: string) {
        try {
            const secretRefresh = this.configService.getOrThrow('JWT_REFRESH_SECRET')
            const decoded = this.jwtService.verify(refreshToken, {
                secret: secretRefresh,
                ignoreExpiration: true
            });

            await this.deleteRefreshToken(decoded.jti);
        } catch (error) {
            if (error.name !== "JsonWebTokenError" && error.name !== "TokenExpiredError") {
                this.logger.error(`Logout fail : ${error.message}`, error.stack);
            }
        }
    }

    async deleteRefreshToken(jti: string) {
        await this.prisma.refreshToken.update({
            where: { tokenId: jti },
            data: { revoked: true }
        })
    }

    // --- LÀM MỚI TOKEN ---
    async refreshToken(userId: string, role: string, oldJti: string) {
        try {
            await this.prisma.refreshToken.updateMany({
                where: { tokenId: oldJti },
                data: { revoked: true }
            });
        } catch (error) {
            throw new UnauthorizedException('Access denied');
        }

        return await this.issueTokens(userId, role);
    }

    // --- CẤP TOKEN (Helper) ---
    async issueTokens(userId: string, role: string) {
        const payload = { sub: userId, role }
        const jti = uuidv4();

        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(payload, {
                secret: this.configService.getOrThrow('JWT_ACCESS_SECRET'),
                expiresIn: this.configService.getOrThrow('JWT_ACCESS_EXPIRE')
            }),
            this.jwtService.signAsync({ ...payload, jti: jti }, {
                secret: this.configService.getOrThrow('JWT_REFRESH_SECRET'),
                expiresIn: this.configService.getOrThrow('JWT_REFRESH_EXPIRE')
            })
        ]);

        const hashRefreshToken = await argon2.hash(refreshToken);
        const expireIn = this.configService.getOrThrow('JWT_REFRESH_EXPIRE');
        const expiresAt = new Date(Date.now() + ms(expireIn))

        await this.prisma.refreshToken.create({
            data: {
                userId: userId,
                token: hashRefreshToken,
                tokenId: jti,
                expiresAt,
                revoked: false
            }
        })
        return { accessToken, refreshToken }
    }

    // --- KIỂM TRA REFRESH TOKEN ---
    async checkRefreshTokeisValid(userId: string, rawToken: string): Promise<boolean> {
        const storedToken = await this.prisma.refreshToken.findMany({
            where: {
                userId: userId,
                revoked: false
            }
        });
        if (!storedToken.length) return false;

        for (const t of storedToken) {
            const isValid = await argon2.verify(t.token, rawToken);
            if (isValid) {
                // Kiểm tra hạn sử dụng
                if (new Date() > t.expiresAt) {
                    return false;
                }
                return true;
            }
        }
        return false;
    }

    // --- ĐỔI MẬT KHẨU ---
    async changePassword(userId: string, dto: ChangePasswordDto) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) throw new BadRequestException('Người dùng không tồn tại');

        const isMatch = await argon2.verify(user.password, dto.currentPassword);
        
        if (!isMatch) {
            throw new BadRequestException('Mật khẩu hiện tại không chính xác');
        }

        const newHashedPassword = await argon2.hash(dto.newPassword);

        await this.prisma.user.update({
            where: { id: userId },
            data: {
                password: newHashedPassword,
            },
        });

        return { message: 'Đổi mật khẩu thành công' };
    }
}