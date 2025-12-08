import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { PrismaService } from '../prisma/prisma.service'; // Đảm bảo đường dẫn import đúng

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(createOrderDto: CreateOrderDto) {
    const { userId, items, totalAmount } = createOrderDto;

    // Tạo mã đơn hàng ngẫu nhiên (VD: #ORD-837492)
    const orderCode = `#ORD-${Date.now().toString().slice(-6)}`;

    // Sử dụng Nested Write của Prisma để lưu 1 lần ăn ngay
    const order = await this.prisma.order.create({
      data: {
        code: orderCode,
        totalAmount: totalAmount,
        status: 'PENDING', // Mặc định là Chờ xử lý
        userId: userId,
        
        // Tạo luôn các dòng chi tiết (Order Items)
        items: {
          create: items.map((item) => ({
            variantId: item.variantId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: true, // Trả về luôn chi tiết để Frontend hiển thị nếu cần
      },
    });

    return {
      message: 'Đặt hàng thành công!',
      orderId: order.id,
      code: orderCode,
    };
  }

  // API phụ: Lấy lịch sử mua hàng của user
  async findByUser(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: true // <--- QUAN TRỌNG: Lấy thông tin Product gốc (để lấy ảnh, tên)
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }
}