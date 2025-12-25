import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class AdminReviewsService {
  constructor(private prisma: PrismaService) {}

  // Lấy tất cả review (có phân trang)
  async findAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { email: true, fullName: true } },
          product: { select: { name: true } }
        }
      }),
      this.prisma.review.count()
    ]);

    return {
      data: reviews,
      meta: { total, page, limit, totalPage: Math.ceil(total / limit) }
    };
  }

  // Ẩn/Xóa review (Soft Delete)
  async delete(id: number) {
    const review = await this.prisma.review.findUnique({ where: { id } });
    if (!review) throw new NotFoundException('Review không tồn tại');

    // Soft delete: Đổi isDeleted = true (vẫn lưu trong DB nhưng không hiện ra web nữa)
    // Đồng thời có thể update lại avgRating của Product nếu muốn xịn (tùy chọn)
    return await this.prisma.review.update({
      where: { id },
      data: { isDeleted: true }
    });
  }
}