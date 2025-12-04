// src/auth/guards/jwt-auth.guard.ts
import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    // 1. Kiểm tra xem route này có gắn mác @Public không
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // 2. Nếu là Public -> Cho qua luôn (return true), không cần check token
    if (isPublic) {
      return true;
    }

    // 3. Nếu không phải Public -> Gọi hàm cha (AuthGuard) để check token như bình thường
    return super.canActivate(context);
  }
}