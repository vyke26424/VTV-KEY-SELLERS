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