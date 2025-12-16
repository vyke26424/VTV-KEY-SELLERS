import { CanActivate, ExecutionContext, Injectable, ServiceUnavailableException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Reflector } from '@nestjs/core';

@Injectable()
export class MaintenanceGuard implements CanActivate {
  constructor(
    private readonly prisma: PrismaService,
    private readonly reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const path = request.url;

    // 1. LUÔN CHO PHÉP CÁC API ADMIN VÀ AUTH
    // Admin cần vào để tắt chế độ bảo trì chứ! :D
    if (path.startsWith('/admin') || path.startsWith('/auth')) {
      return true;
    }

    // 2. LẤY CẤU HÌNH TỪ DB
    // Lưu ý: Để tối ưu hiệu năng thực tế, nên lưu biến này vào Redis hoặc Memory Cache
    // thay vì query DB mỗi lần. Nhưng với mức độ MVP, query DB vẫn ổn.
    const config = await this.prisma.systemConfig.findUnique({
      where: { id: 1 }
    });

    // Nếu không có config hoặc bảo trì đang TẮT -> Cho qua
    if (!config || !config.maintenanceMode) {
      return true;
    }

    // 3. NẾU ĐANG BẢO TRÌ -> CHẶN
    // (Nâng cao: Nếu user đang login và là ADMIN thì vẫn cho qua)
    // Đoạn này cần logic check token để biết là Admin hay không, 
    // nhưng để an toàn tuyệt đối cho Client, ta cứ chặn hết Guest.
    throw new ServiceUnavailableException({
        message: 'Hệ thống đang bảo trì. Vui lòng quay lại sau!',
        maintenance: true
    });
  }
}