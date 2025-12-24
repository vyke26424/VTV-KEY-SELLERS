import { Injectable, NotFoundException, BadRequestException} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { OrderStatus, Prisma, StockStatus } from '@prisma/client';

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

  // --- HÀM DUYỆT ĐƠN HÀNG ---
  // --- HÀM DUYỆT ĐƠN (Approve) ---
  async approveOrder(orderId: number) {
    return await this.prisma.$transaction(async (tx) => {
      // 1. Tìm đơn hàng kèm theo OrderItems
      const order = await tx.order.findUnique({
        where: { id: orderId },
        include: { items: true } // Lấy danh sách OrderItem
      });

      if (!order) throw new NotFoundException('Đơn hàng không tồn tại');
      // Schema dùng PENDING (check file schema)
      if (order.status !== OrderStatus.PENDING) throw new BadRequestException('Chỉ duyệt được đơn đang chờ');

      // 2. Chuyển trạng thái các Key liên quan: LOCKED -> SOLD
      // Vì StockItem liên kết với OrderItem, ta phải lấy list OrderItemId ra trước
      const orderItemIds = order.items.map(item => item.id);

      await tx.stockItem.updateMany({
        where: { 
            orderItemId: { in: orderItemIds }, // Tìm key thuộc các OrderItem của đơn này
            status: StockStatus.LOCKED 
        },
        data: { status: StockStatus.SOLD }
      });

      // 3. Cập nhật trạng thái đơn hàng -> COMPLETED (Theo Schema)
      const updatedOrder = await tx.order.update({
        where: { id: orderId },
        data: { status: OrderStatus.COMPLETED } // Schema dùng COMPLETED, không phải SUCCESS
      });

      return updatedOrder;
    });
  }

  // --- HÀM HỦY ĐƠN HÀNG ---
  async cancelOrder(orderId: number) {
    return await this.prisma.$transaction(async (tx) => {
      const order = await tx.order.findUnique({ 
          where: { id: orderId },
          include: { items: true }
      });
      
      if (!order) throw new NotFoundException('Đơn hàng không tồn tại');
      if (order.status !== OrderStatus.PENDING) throw new BadRequestException('Chỉ hủy được đơn đang chờ');

      // 1. Nhả Key ra: LOCKED -> AVAILABLE
      const orderItemIds = order.items.map(item => item.id);

      await tx.stockItem.updateMany({
        where: { 
            orderItemId: { in: orderItemIds },
            status: StockStatus.LOCKED 
        },
        data: { 
            status: StockStatus.AVAILABLE,
            // Quan trọng: Ngắt liên kết với OrderItem để key này tự do trở lại
            orderItemId: null 
        }
      });

      // 2. Cập nhật đơn hàng -> CANCELED (Theo Schema 1 chữ L)
      return await tx.order.update({
        where: { id: orderId },
        data: { status: OrderStatus.CANCELED } 
      });
    });
  }
}