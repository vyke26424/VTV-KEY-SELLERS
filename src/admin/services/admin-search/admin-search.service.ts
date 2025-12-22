import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class AdminSearchService {
  constructor(private prisma: PrismaService) {}

  async searchGlobal(query: string) {
    if (!query) return { orders: [], products: [], users: [] };

    const keyword = query.trim();

    // Chạy song song 3 câu lệnh tìm kiếm cho nhanh
    const [orders, products, users] = await Promise.all([
      // 1. Tìm đơn hàng (theo Mã code hoặc Email người mua)
      this.prisma.order.findMany({
        where: {
          OR: [
            { code: { contains: keyword } }, // Tìm theo mã đơn
            { user: { email: { contains: keyword } } } // Tìm theo email khách
          ]
        },
        take: 5, // Chỉ lấy 5 kết quả
        orderBy: { createdAt: 'desc' }
      }),

      // 2. Tìm sản phẩm (theo Tên)
      this.prisma.product.findMany({
        where: { name: { contains: keyword } }, // Tìm tương đối (LIKE)
        take: 5,
        select: { id: true, name: true, thumbnail: true }
      }),

      // 3. Tìm khách hàng (theo Email hoặc Tên)
      this.prisma.user.findMany({
        where: {
          OR: [
            { email: { contains: keyword } },
            { fullName: { contains: keyword } }
          ],
          role: 'USER' // Chỉ tìm khách thường
        },
        take: 5,
        select: { id: true, email: true, fullName: true }
      })
    ]);

    return { orders, products, users };
  }
}