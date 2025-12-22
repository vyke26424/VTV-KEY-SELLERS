import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateOrderDto } from '../../dto/create-order.dto';
import { PrismaService } from '../../../prisma/prisma.service'; 
import { StockStatus } from '@prisma/client';
import { EncryptionService } from '../../../admin/utils/encryption/encryption.service';
import { InteractionType } from '@prisma/client';
import { InteractionsService } from '../interactions/interactions.service'; 

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private encryptionService: EncryptionService,
    // 2. INJECT INTERACTIONS SERVICE VÀO ĐÂY
    private interactionsService: InteractionsService 
  ) {}

  // --- TẠO ĐƠN HÀNG ---
  async create(createOrderDto: CreateOrderDto) {
    const { userId, items, totalAmount } = createOrderDto;

    try {
      // Bắt đầu Transaction tạo đơn
      const result = await this.prisma.$transaction(async (tx) => {
        const orderCode = `#ORD-${Date.now().toString().slice(-6)}`;
        
        const orderItemsData: any[] = [];

        for (const item of items) {
          // Check kho (Logic cũ giữ nguyên)
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

          // Update kho (Logic cũ giữ nguyên)
          const stockIds = availableStock.map(s => s.id);
          await tx.stockItem.updateMany({
            where: { id: { in: stockIds } },
            data: { status: StockStatus.SOLD } 
          });
          
          // Push data (Logic cũ giữ nguyên)
          orderItemsData.push({
              variantId: item.variantId,
              quantity: item.quantity,
              price: item.price,
              stockItems: {
                  connect: stockIds.map(id => ({ id })) 
              }
          });
        }
          
        // Tạo đơn (Logic cũ giữ nguyên)
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

      // --- 3. LOGIC MỚI: CỘNG ĐIỂM PURCHASE CHO AI (Chạy sau khi Transaction thành công) ---
      // Lưu ý: Dùng try-catch riêng để nếu lỗi log điểm cũng không làm lỗi đơn hàng của khách
      this.logPurchaseScore(userId, items).catch(err => 
          console.error("⚠️ Lỗi background log điểm Purchase:", err)
      );

      return result;

    } catch (error) {
        console.error("🔥 Lỗi tạo đơn hàng (OrdersService):", error);
        
        if (error instanceof BadRequestException) throw error;
        throw new InternalServerErrorException(error.message || "Lỗi Database không xác định");
    }
  }

  // --- HÀM PHỤ TRỢ: Tách ra cho gọn code ---
  private async logPurchaseScore(userId: string, items: any[]) {
      // Chạy song song (Parallel) để tối ưu hiệu năng
      const promises = items.map(async (item) => {
          // Vì item chỉ có variantId, ta cần tìm ra productId gốc
          const variant = await this.prisma.productVariant.findUnique({
              where: { id: item.variantId },
              select: { productId: true }
          });

          if (variant) {
              return this.interactionsService.logInteraction(
                  userId, 
                  variant.productId, 
                  InteractionType.PURCHASE // 10 điểm
              );
          }
      });

      await Promise.all(promises);
      console.log(`✅ AI System: Đã cộng điểm PURCHASE cho User ${userId}`);
  }

  // --- LẤY LỊCH SỬ ĐƠN HÀNG (Giữ nguyên code cũ của bạn) ---
  async findByUser(userId: string) {
    // ... (Code cũ giữ nguyên không đổi)
    const orders = await this.prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            stockItems: true, 
            variant: {
              include: { product: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return orders.map(order => ({
      ...order,
      items: order.items.map(item => ({
        ...item,
        stockItems: item.stockItems.map(stock => {
          try {
            return {
              ...stock,
              credential: this.encryptionService.decryptCredential(stock.credential)
            };
          } catch (e) {
            return stock;
          }
        })
      }))
    }));
  }
}