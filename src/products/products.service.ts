import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; 
import { StockStatus } from '@prisma/client'; 

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  // --- LẤY TẤT CẢ SẢN PHẨM (Cho Trang Chủ) ---
  async findAll() {
    const products = await this.prisma.product.findMany({
      where: {
        isActive: true, // Chỉ lấy sản phẩm đang hoạt động
        isDeleted: false // Và chưa bị xóa mềm
      },
      include: {
        category: true, 
        variants: {
          include: {
            _count: {
              select: { 
                stockItems: { 
                  where: { status: StockStatus.AVAILABLE } 
                } 
              }
            }
          }
        },
      },
      orderBy: {
        createdAt: 'desc', 
      }
    });

    return this.transformProducts(products);
  }

  // --- LẤY CHI TIẾT 1 SẢN PHẨM (Cho trang Detail) ---
  async findOne(idOrSlug: number | string) {
    const whereCondition = typeof idOrSlug === 'number' 
        ? { id: idOrSlug } 
        : { slug: idOrSlug as string };

    const product = await this.prisma.product.findFirst({
      where: {
        ...whereCondition,
        isActive: true,
        isDeleted: false
      },
      include: {
        reviews: true,
        category: true,
        variants: {
          include: {
            _count: {
              select: { 
                stockItems: { 
                    where: { status: StockStatus.AVAILABLE } 
                } 
              }
            }
          }
        },
      },
    });

    if (!product) return null;

    // Tái sử dụng logic transform cho 1 sản phẩm
    const [transformed] = this.transformProducts([product]);
    return transformed;
  }
  
  async getRecommendations(userId: string, limit: number = 5) {
    try {
      // Sử dụng Raw SQL để thực hiện logic phức tạp
      // Logic:
      // 1. Tìm các user khác (Peers) có cùng tương tác (mua/xem) các sản phẩm mà User hiện tại đã tương tác.
      // 2. Tìm các sản phẩm mà các Peers này đã mua (nhưng User hiện tại CHƯA mua).
      // 3. Tính tổng score và sắp xếp.

      const recommendedProducts = await this.prisma.$queryRaw`
        SELECT 
            p.id, 
            p.name, 
            p.slug, 
            p.thumbnail, 
            p.avgRating,
            CAST(SUM(ui.score) AS DOUBLE) as relevanceScore
        FROM UserInteraction ui
        JOIN Product p ON p.id = ui.productId
        WHERE ui.userId IN (
            -- Tìm danh sách User có hành vi giống tôi
            SELECT DISTINCT sub_ui.userId 
            FROM UserInteraction sub_ui
            WHERE sub_ui.productId IN (
                -- Danh sách sản phẩm tôi đã tương tác
                SELECT my_ui.productId 
                FROM UserInteraction my_ui 
                WHERE my_ui.userId = ${userId}
            )
            AND sub_ui.userId != ${userId} -- Trừ chính tôi ra
        )
        AND ui.productId NOT IN (
            -- Loại bỏ sản phẩm tôi đã mua rồi (tùy chọn: có thể bỏ dòng này nếu muốn gợi ý mua lại)
            SELECT bought_ui.productId 
            FROM UserInteraction bought_ui 
            WHERE bought_ui.userId = ${userId} AND bought_ui.type = 'PURCHASE'
        )
        AND p.isActive = true
        AND p.isDeleted = false
        GROUP BY p.id
        ORDER BY relevanceScore DESC
        LIMIT ${limit};
      `;

      // Nếu không có đủ gợi ý (ví dụ User mới chưa có lịch sử), 
      // Fallback về lấy sản phẩm "Trending" (Nhiều điểm nhất hệ thống)
      if (!recommendedProducts || (Array.isArray(recommendedProducts) && recommendedProducts.length === 0)) {
         return await this.getTrendingProducts(limit);
      }

      return recommendedProducts;

    } catch (error) {
      console.error("Recommendation Error:", error);
      // Fallback an toàn nếu lỗi
      return await this.getTrendingProducts(limit);
    }
  }

  // Hàm phụ: Lấy sản phẩm nổi bật (Dựa trên tổng score toàn hệ thống)
  async getTrendingProducts(limit: number) {
     return await this.prisma.product.findMany({
        where: { isActive: true, isDeleted: false },
        orderBy: { 
            // Ở đây bạn có thể order theo interaction count nếu muốn, 
            // hoặc đơn giản là isHot / createdAt
            interactions: { _count: 'desc' } 
        },
        take: limit,
        select: {
            id: true, name: true, slug: true, thumbnail: true, avgRating: true
        }
     });
  }
  

  // --- HELPER: XỬ LÝ DỮ LIỆU TRẢ VỀ (Đã chuyển thành public) ---
  public transformProducts(products: any[]) { 
    return products.map(product => {
        const totalStock = product.variants.reduce((sum, variant) => {
          const stock = variant._count?.stockItems ?? 0;
          return sum + stock;
        }, 0);
  
        return {
          ...product,
          totalStock: totalStock,
          isOutOfStock: totalStock === 0,
          variants: product.variants.map(v => ({
            ...v,
            stock: v._count?.stockItems ?? 0,
          }))
        };
      });
  }

  // --- SEED DATA (Giữ lại) ---
  async seedCategories() { /* ... Giữ nguyên code cũ ... */ }
  async seedProducts() { /* ... Giữ nguyên code cũ ... */ }
}