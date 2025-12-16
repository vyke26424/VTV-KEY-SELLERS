import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Prisma, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminUserService {
  constructor(private readonly prisma: PrismaService) {}

  // --- 1. LẤY DANH SÁCH USER ---
  async findAll(params: { page?: number; limit?: number; search?: string; role?: Role[] }) {
    const { page = 1, limit = 10, search, role } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = {
      role: role && role.length > 0 ? { in: role } : undefined,
      
      OR: search ? [
        { email: { contains: search } },
        { fullName: { contains: search } }
      ] : undefined,
    };

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: { // Chỉ lấy các trường cần thiết, BỎ PASSWORD
          id: true,
          email: true,
          fullName: true,
          role: true,
          balance: true,
          createdAt: true,
          _count: {
            select: { orders: true } // Đếm số đơn hàng
          }
        }
      }),
      this.prisma.user.count({ where })
    ]);

    return {
      data: users,
      meta: {
        total,
        page,
        limit,
        totalPage: Math.ceil(total / limit)
      }
    };
  }

  // --- 2. LẤY CHI TIẾT 1 USER (KÈM LỊCH SỬ GIAO DỊCH) ---
  async findOne(id: string) { // Lưu ý: ID User là String (CUID)
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        orders: {
          take: 5, // Lấy 5 đơn gần nhất
          orderBy: { createdAt: 'desc' },
          include: {
             _count: { select: { items: true } }
          }
        },
        _count: {
            select: { orders: true, reviews: true }
        }
      }
    });

    if (!user) throw new NotFoundException('Người dùng không tồn tại');
    
    // Loại bỏ password trước khi trả về
    const { password, ...result } = user; 
    return result;
  }
  // --- 3. CẬP NHẬT THÔNG TIN USER ---
  async update(id: string, data: any) {
    const updateData: any = {
        fullName: data.fullName,
        // ... các trường khác nếu cần
    };

    // Nếu có gửi password lên thì mới hash và cập nhật
    if (data.password && data.password.trim() !== '') {
        const salt = await bcrypt.genSalt(10);
        updateData.password = await bcrypt.hash(data.password, salt);
    }

    return await this.prisma.user.update({
        where: { id },
        data: updateData
    });
  }
}