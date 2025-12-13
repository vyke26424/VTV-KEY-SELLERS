import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { PrismaService } from '../prisma/prisma.service';
import { StockStatus } from '@prisma/client';
import { EncryptionService } from '../admin/utils/encryption/encryption.service'; // Import Service mã hóa

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private encryptionService: EncryptionService // <--- 1. Inject vào đây để dùng
  ) {}

  // --- TẠO ĐƠN HÀNG (Sửa lại logic nối bảng) ---
  async create(createOrderDto: CreateOrderDto) {
    const { userId, items, totalAmount } = createOrderDto;

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
        // --- THAY ĐỔI QUAN TRỌNG: Dùng 'connect' thay vì lưu string 'codes' ---
        orderItemsData.push({
            variantId: item.variantId,
            quantity: item.quantity,
            price: item.price,
            // Logic này bảo Prisma: "Hãy nối OrderItem này với các StockItem có ID trong danh sách này"
            stockItems: {
                connect: stockIds.map(id => ({ id })) 
            }
        });
      }

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