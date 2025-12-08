import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { PrismaService } from '../prisma/prisma.service';
import { StockStatus } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(createOrderDto: CreateOrderDto) {
    const { userId, items, totalAmount } = createOrderDto;

    // BẮT ĐẦU GIAO DỊCH (Transaction)
    return await this.prisma.$transaction(async (tx) => {
      
      // 1. Tạo mã đơn hàng
      const orderCode = `#ORD-${Date.now().toString().slice(-6)}`;
      
      // --- SỬA Ở ĐÂY: Khai báo mảng với kiểu dữ liệu rõ ràng NGAY TỪ ĐẦU ---
      // Biến này nằm ngoài vòng lặp để tích lũy dữ liệu
      const orderItemsData: { variantId: number; quantity: number; price: number; codes: string }[] = [];

      // 2. Duyệt qua từng món hàng khách chọn để kiểm tra kho
      for (const item of items) {
        // Tìm các key đang rảnh (AVAILABLE) của gói này
        const availableStock = await tx.stockItem.findMany({
          where: {
            variantId: item.variantId,
            status: StockStatus.AVAILABLE, // Chỉ lấy cái nào chưa bán
          },
          take: item.quantity, // Lấy đúng số lượng khách mua
        });

        // Nếu không đủ hàng -> Báo lỗi ngay và Hủy toàn bộ giao dịch
        if (availableStock.length < item.quantity) {
          throw new BadRequestException(`Sản phẩm (Variant ID: ${item.variantId}) hiện không đủ hàng trong kho.`);
        }

        // Lấy danh sách mã key (credentials) để chuẩn bị lưu
        const credentials = availableStock.map(s => s.credential);

        // 3. Đánh dấu các key này là ĐÃ BÁN (SOLD)
        const stockIds = availableStock.map(s => s.id);
        await tx.stockItem.updateMany({
          where: { id: { in: stockIds } },
          data: { 
            status: StockStatus.SOLD,
          } 
        });
        
        // --- SỬA Ở ĐÂY: Không khai báo lại biến nữa, chỉ push vào biến bên ngoài ---
        orderItemsData.push({
            variantId: item.variantId,
            quantity: item.quantity,
            price: item.price,
            codes: credentials.join('\n') // Lưu key, ngăn cách bằng xuống dòng
        });
      }

      // Kiểm tra nhanh log để xem dữ liệu có chưa (bạn có thể xóa dòng này sau)
      console.log('Dữ liệu sắp lưu vào DB:', JSON.stringify(orderItemsData, null, 2));

      // 4. Tạo đơn hàng (Lúc này mảng orderItemsData đã có đầy đủ dữ liệu)
      const order = await tx.order.create({
        data: {
          code: orderCode,
          totalAmount: totalAmount,
          status: 'COMPLETED',
          userId: userId,
          items: {
            create: orderItemsData // <--- Lưu mảng đã chuẩn bị
          },
        },
      });

      // 5. Trả kết quả về cho Controller
      return {
        message: 'Thanh toán thành công! Key đã được gửi.',
        orderId: order.id,
        code: orderCode,
      };
    });
  }

  // Hàm findByUser cũ của bạn (không đổi)
  async findByUser(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            variant: {
              include: {
                product: true 
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
  }
}