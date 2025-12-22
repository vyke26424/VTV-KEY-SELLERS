import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { StockStatus } from '@prisma/client';

@Injectable()
export class AdminDashboardService {
  constructor(private prisma: PrismaService) {}

  async getDashboardData() {
    // 1. Thống kê tổng quan (Stats)
    const [totalRevenue, totalOrders, totalUsers, totalProducts] = await Promise.all([
      this.prisma.order.aggregate({ _sum: { totalAmount: true }, where: { status: 'COMPLETED' } }),
      this.prisma.order.count(),
      this.prisma.user.count({ where: { role: 'USER' } }),
      this.prisma.product.count({ where: { isDeleted: false } }),
    ]);

    // 2. Đơn hàng gần đây (5 đơn mới nhất)
    const recentOrders = await this.prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { fullName: true, email: true } } }
    });

    // 3. Biểu đồ doanh thu (7 ngày gần nhất)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const ordersLast7Days = await this.prisma.order.findMany({
      where: {
        createdAt: { gte: sevenDaysAgo },
        status: 'COMPLETED'
      },
      select: { createdAt: true, totalAmount: true }
    });

    // Gom nhóm doanh thu theo ngày
    const chartData = this.groupRevenueByDay(ordersLast7Days);

    // 4. Sản phẩm bán chạy nhất (Top Best Sellers)
    // Logic: Group by Variant -> Sum Quantity -> Lấy thông tin Product
    const topVariants = await this.prisma.orderItem.groupBy({
      by: ['variantId'],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 5,
    });

    // Lấy thông tin chi tiết sản phẩm từ các variant bán chạy
    const bestSellers = await Promise.all(topVariants.map(async (item) => {
        const variant = await this.prisma.productVariant.findUnique({
            where: { id: item.variantId },
            include: { product: true }
        });
        return {
            productId: variant?.product.id,
            name: variant?.product.name, // Hoặc variant?.name nếu muốn chi tiết
            productName: variant?.product.name,
            variantName: variant?.name,
            thumbnail: variant?.product.thumbnail,
            isHot: variant?.product.isHot,
            sold: item._sum.quantity,
            revenue: Number(variant?.price) * (item._sum.quantity || 0)
        };
    }));

    return {
      stats: {
        revenue: totalRevenue._sum.totalAmount || 0,
        orders: totalOrders,
        users: totalUsers,
        products: totalProducts
      },
      recentOrders,
      chartData,
      bestSellers
    };
  }

  // Helper: Gom đơn hàng theo ngày để vẽ biểu đồ
  private groupRevenueByDay(orders: any[]) {
    const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    
    const result: { name: string; fullDate: string; revenue: number }[] = [];
    
    // Tạo mảng 7 ngày gần nhất (ngược về quá khứ)
    for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0]; // YYYY-MM-DD
        const dayLabel = days[d.getDay()]; // T2, T3...

        // Tính tổng tiền của ngày đó
        const total = orders
            .filter(o => o.createdAt.toISOString().startsWith(dateStr))
            .reduce((sum, o) => sum + Number(o.totalAmount), 0);

        result.push({ name: dayLabel, fullDate: dateStr, revenue: total });
    }
    return result;
  }
}