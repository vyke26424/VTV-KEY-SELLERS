import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class AdminSettingsService {
  constructor(private prisma: PrismaService) {}

  // Lấy cấu hình (Luôn lấy ID = 1)
  async getConfig() {
    const config = await this.prisma.systemConfig.findUnique({
      where: { id: 1 }
    });
    // Nếu chưa có (trường hợp chưa seed), tạo mới luôn
    if (!config) {
      return await this.prisma.systemConfig.create({
        data: {
            maintenanceMode: false,
            emailNotification: true,
            bankInfo: ''
        }
      });
    }
    return config;
  }

  // Cập nhật cấu hình
  async updateConfig(data: any) {
    return await this.prisma.systemConfig.update({
      where: { id: 1 },
      data: {
        maintenanceMode: data.maintenanceMode,
        emailNotification: data.emailNotification,
        bankInfo: data.bankInfo
      }
    });
  }
}