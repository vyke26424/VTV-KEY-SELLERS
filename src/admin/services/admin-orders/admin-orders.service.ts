import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { OrderStatus, Prisma } from '@prisma/client';

@Injectable()
export class AdminOrdersService {
  constructor(private readonly prisma: PrismaService) {}

  // --- LẤY DANH SÁCH ĐƠN HÀNG (Có phân trang & Tìm kiếm) ---
  async findAll(params: { page?: number; limit?: number; search?: string; status?: OrderStatus }) {
    const { page = 1, limit = 10, search, status } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.OrderWhereInput = {
      // Tìm theo mã đơn hoặc email khách
      OR: search ? [
        { code: { contains: search } },
        { user: { email: { contains: search } } }
      ] : undefined,
      // Lọc theo trạng thái
      status: status,
    };

    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, email: true, fullName: true } }, // Lấy info khách
          _count: { select: { items: true } } // Đếm số món hàng
        }
      }),
      this.prisma.order.count({ where })
    ]);

    return {
      data: orders,
      meta: {
        total,
        page,
        limit,
        totalPage: Math.ceil(total / limit)
      }
    };
  }

  // --- LẤY CHI TIẾT 1 ĐƠN HÀNG (Kèm sản phẩm & Key đã giao) ---
  async findOne(id: number) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, email: true, fullName: true } },
        items: {
          include: {
            variant: { select: { name: true, product: { select: { name: true, thumbnail: true } } } },
            stockItems: { select: { id: true, status: true } } // Chỉ lấy ID và Status, KHÔNG LẤY credential để bảo mật
          }
        }
      }
    });

    if (!order) throw new NotFoundException('Đơn hàng không tồn tại');
    return order;
  }

  // --- CẬP NHẬT TRẠNG THÁI ĐƠN HÀNG ---
  async updateStatus(id: number, status: OrderStatus) {
    return await this.prisma.order.update({
      where: { id },
      data: { status }
    });
  }
}