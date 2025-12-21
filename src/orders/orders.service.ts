import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { PrismaService } from '../prisma/prisma.service';
import { StockStatus } from '@prisma/client';
import { EncryptionService } from '../admin/utils/encryption/encryption.service'; 
import { InteractionType } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private encryptionService: EncryptionService // <--- 1. Inject vào đây để dùng
  ) {}

  // --- TẠO ĐƠN HÀNG (Sửa lại logic nối bảng) ---
  async create(createOrderDto: CreateOrderDto) {
    const { userId, items, totalAmount } = createOrderDto;

    try {
    return await this.prisma.$transaction(async (tx) => {
      const orderCode = `#ORD-${Date.now().toString().slice(-6)}`;
      
      // Mảng chứa dữ liệu, không cần định nghĩa type cứng nữa để Prisma tự hiểu
      const orderItemsData: any[] = [];

      for (const item of items) {
        // 1. Tìm key đang rảnh (AVAILABLE)
        const availableStock = await tx.stockItem.findMany({
          where: {
            variantId: item.variantId,
            status: StockStatus.AVAILABLE, 
          },
          take: item.quantity, 
        });

        if (availableStock.length < item.quantity) {
          throw new BadRequestException(`Sản phẩm (Variant ID: ${item.variantId}) hiện không đủ hàng.`);
        }

        // 2. Đánh dấu các key này là ĐÃ BÁN (SOLD)
        const stockIds = availableStock.map(s => s.id);
        await tx.stockItem.updateMany({
          where: { id: { in: stockIds } },
          data: { status: StockStatus.SOLD } 
        });
        
        // 3. Chuẩn bị dữ liệu OrderItem
        // Schema đã sửa (bỏ @unique), ta gộp nhiều StockItem vào 1 OrderItem cho gọn DB
        orderItemsData.push({
            variantId: item.variantId,
            quantity: item.quantity,
            price: item.price,
            stockItems: {
                connect: stockIds.map(id => ({ id })) 
            }
        });
        
      // 4. Tạo đơn hàng (Prisma sẽ tự động tạo OrderItem và nối dây với StockItem)
      const order = await tx.order.create({
        data: {
          code: orderCode,
          totalAmount: totalAmount,
          status: 'COMPLETED',
          userId: userId,
          items: {
            create: orderItemsData 
          },
        },
      });

      return {
        message: 'Thanh toán thành công! Key đã được gửi.',
        orderId: order.id,
        code: orderCode,
      };
    });
    } catch (error) {
        console.error("🔥 Lỗi tạo đơn hàng (OrdersService):", error); // Quan trọng: Xem lỗi chi tiết ở Terminal Backend
        
        // Nếu là lỗi BadRequest (hết hàng) thì ném tiếp, còn lỗi lạ (Prisma) thì gói vào 500 kèm message
        if (error instanceof BadRequestException) throw error;
        throw new InternalServerErrorException(error.message || "Lỗi Database không xác định");
    }
  }

  // --- LẤY LỊCH SỬ ĐƠN HÀNG (Kèm giải mã Key) ---
  async findByUser(userId: string) {
    // 1. Lấy dữ liệu thô từ DB
    const orders = await this.prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            // Lấy kèm thông tin StockItem đã link với OrderItem này
            stockItems: true, 
            variant: {
              include: { product: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // 2. Xử lý giải mã (Decrypt) credential trước khi trả về
    // Vì key trong DB đang dạng mã hóa (vd: "iv:content"), user không đọc được
    return orders.map(order => ({
      ...order,
      items: order.items.map(item => ({
        ...item,
        // Duyệt qua từng key trong kho
        stockItems: item.stockItems.map(stock => {
          try {
            // Giải mã credential
            return {
              ...stock,
              credential: this.encryptionService.decryptCredential(stock.credential)
            };
          } catch (e) {
            // Phòng trường hợp key cũ chưa mã hóa hoặc lỗi, trả về nguyên gốc
            return stock;
          }
        })
      }))
    }));
  }
}