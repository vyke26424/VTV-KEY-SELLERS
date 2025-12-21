/* FILE: src/modules/interactions/interactions.service.ts */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service'; 
import { InteractionType } from '@prisma/client';

@Injectable()
export class InteractionsService {
  constructor(private prisma: PrismaService) {}

  // Bảng quy đổi điểm số
  private readonly SCORE_MAP = {
    [InteractionType.VIEW]: 1,
    [InteractionType.LIKE]: 3,
    [InteractionType.ADD_TO_CART]: 5,
    [InteractionType.PURCHASE]: 10,
    [InteractionType.SHARE]: 2,
  };

  async logInteraction(userId: string, productId: number, type: InteractionType, duration: number = 0) {
    const score = this.SCORE_MAP[type] || 1;

    // Lưu vào DB
    return this.prisma.userInteraction.create({
      data: {
        userId,
        productId,
        type,
        score,
        duration, // Ví dụ: user ở lại trang đó bao nhiêu giây
      },
    });
  }

  // Lấy danh sách sản phẩm gợi ý (Top Trending)
  async getTrendingProducts(limit: number = 5) {
    // Logic: Lấy sản phẩm có tổng điểm cao nhất trong 7 ngày qua
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const topInteractions = await this.prisma.userInteraction.groupBy({
      by: ['productId'],
      where: {
        createdAt: {
          gte: sevenDaysAgo,
        },
      },
      _sum: {
        score: true,
      },
      orderBy: {
        _sum: {
          score: 'desc',
        },
      },
      take: limit,
    });

    // Lấy chi tiết thông tin sản phẩm từ list ID trên
    const productIds = topInteractions.map((i) => i.productId);
    
    return this.prisma.product.findMany({
      where: { id: { in: productIds } },
      include: { variants: true }, // Lấy thêm giá
    });
  }
}