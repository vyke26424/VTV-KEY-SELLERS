import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service'; 
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

  async getRecommendations(userId: string) {
    if (!userId) return [];
    // 1. Lấy danh sách ID sản phẩm được gợi ý trong bảng UserRecommendation
    const recommendations = await this.prisma.userRecommendation.findMany({
        where: { userId: userId },
        orderBy: { score: 'desc' }, // Lấy điểm cao nhất (gợi ý chuẩn nhất)
        take: 8, // Lấy 8 sản phẩm thôi
        include: {
            product: { // Join sang bảng Product để lấy thông tin hiển thị
                include: {
                    category: true,
                    variants: { // Lấy giá rẻ nhất để hiển thị "Từ..."
                        orderBy: { price: 'asc' },
                        take: 1
                    }
                }
            }
        }
    });
    // 2. Chuyển đổi dữ liệu để trả về cho Frontend
    return recommendations.map(rec => {
        const p = rec.product;
        // Logic tính giá min (nếu có variant)
        const minPrice = p.variants.length > 0 ? Number(p.variants[0].price) : 0;
        const originalPrice = p.variants.length > 0 ? Number(p.variants[0].orginalPrice) : 0;

        return {
            id: p.id,
            name: p.name,
            slug: p.slug,
            thumbnail: p.thumbnail,
            isHot: p.isHot,
            category: p.category,
            price: minPrice, // Trả về giá rẻ nhất để Frontend hiển thị
            originalPrice: originalPrice,
            variants: p.variants // Hoặc trả về mảng variant nếu Frontend cần map
        };
    });
  }
  // --- SEED DATA (Giữ lại) ---
  async seedCategories() { /* ... Giữ nguyên code cũ ... */ }
  async seedProducts() { /* ... Giữ nguyên code cũ ... */ }
}