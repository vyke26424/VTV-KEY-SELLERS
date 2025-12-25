import { Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateReviewDto } from '../../dto/create-review.dto';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  // --- 1. KIỂM TRA QUYỀN REVIEW ---
  async checkEligibility(userId: string, productId: number) {
    try {
      const pId = Number(productId); 
      console.log(`🔍 Đang check quyền: User [${userId}] - Product [${pId}]`);

      // 👇 Dùng chuỗi cứng 'COMPLETED' thay vì Enum để tránh lỗi import
      const hasPurchased = await this.prisma.order.findFirst({
        where: {
          userId: userId,
          status: { in: ['COMPLETED'] as any }, 
          items: {
            some: {
              variant: {
                productId: pId
              }
            }
          }
        }
      });

      console.log("👉 Kết quả check DB:", hasPurchased ? "✅ Đã mua" : "❌ Chưa mua");
      return !!hasPurchased;

    } catch (error) {
      // 👇 QUAN TRỌNG: In lỗi chi tiết ra Terminal để biết đường sửa
      console.error("LỖI TẠI checkEligibility:", error);
      // Trả về false thay vì để sập server
      return false; 
    }
  }

  // --- 2. TẠO REVIEW MỚI ---
  private readonly BAD_WORDS = ['cứt','dm', 'vl', 'cc', 'ngu', 'lừa đảo', 'scam', 'đm', 'vkl'];

  async create(userId: string, dto: CreateReviewDto) {
    // Check xem có ngôn từ xàm bậy hong
    if (dto.comment) {
        const lowerComment = dto.comment.toLowerCase();
        const hasBadWord = this.BAD_WORDS.some(word => lowerComment.includes(word));
        
        if (hasBadWord) {
            throw new BadRequestException('Đánh giá của bạn chứa ngôn từ không phù hợp. Vui lòng sửa lại.');
        }
    }
    // Bước 1: Check quyền
    const canReview = await this.checkEligibility(userId, dto.productId);
    if (!canReview) {
      throw new ForbiddenException('Bạn phải mua và nhận hàng thành công mới được đánh giá sản phẩm này.');
    }

    // Bước 2: Check xem đã review chưa (Tránh spam 1 người review 10 lần)
    const existingReview = await this.prisma.review.findFirst({
      where: { userId, productId: dto.productId, isDeleted: false }
    });

    if (existingReview) {
      throw new BadRequestException('Bạn đã đánh giá sản phẩm này rồi.');
    }

    // Bước 3: Tạo Review
    const review = await this.prisma.review.create({
      data: {
        userId,
        productId: dto.productId,
        rating: dto.rating,
        comment: dto.comment
      }
    });

    // Bước 4: Tính lại điểm trung bình cho sản phẩm (Background task)
    await this.updateProductAvgRating(dto.productId);

    return review;
  }

  // --- 3. LẤY DANH SÁCH REVIEW (Public) ---
  async findByProduct(productId: number) {
    return this.prisma.review.findMany({
      where: { productId, isDeleted: false },
      include: {
        user: { select: { id: true, fullName: true, email: true } } // Lấy tên người review
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  // --- HELPER: CẬP NHẬT ĐIỂM TRUNG BÌNH ---
  private async updateProductAvgRating(productId: number) {
    const aggregations = await this.prisma.review.aggregate({
      where: { productId, isDeleted: false },
      _avg: { rating: true },
      _count: { rating: true } // Đếm số lượng để sau này hiện "Trên 100 đánh giá"
    });

    const newRating = aggregations._avg.rating || 0;

    // Update ngược lại vào bảng Product
    await this.prisma.product.update({
      where: { id: productId },
      data: { avgRating: newRating }
    });
  }
}