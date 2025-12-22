import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { InteractionType } from '@prisma/client';

@Injectable()
export class InteractionsService {
  constructor(private prisma: PrismaService) {}

  // BẢNG QUY ĐỔI ĐIỂM SỐ (Trọng số)
  private readonly SCORE_MAP = {
    [InteractionType.VIEW]: 1,          // Xem lướt qua: 1 điểm
    [InteractionType.READ_MORE]: 2,     // Đọc kỹ mô tả: 2 điểm
    [InteractionType.ADD_TO_CART]: 5,   // Thêm giỏ hàng: 5 điểm
    [InteractionType.PURCHASE]: 10,     // Mua hàng: 10 điểm
  };

  // Hàm ghi nhận tương tác
  async logInteraction(userId: string, productId: number, type: InteractionType) {
    const score = this.SCORE_MAP[type] || 1;

    return this.prisma.userInteraction.create({
      data: {
        userId,
        productId,
        type,
        score, // Lưu điểm số vào luôn để Python đỡ phải map lại
      },
    });
  }

  // Hàm lấy danh sách gợi ý (Dùng cho bước cuối)
  async getRecommendations(userId: string) {
    return this.prisma.userRecommendation.findMany({
      where: { userId },
      orderBy: { score: 'desc' }, // Lấy điểm cao nhất
      take: 8,
      include: {
        product: {
          include: {
            variants: { take: 1, select: { price: true, orginalPrice: true } }
          }
        }
      }
    });
  }
}