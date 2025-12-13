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
    // (Bọc vào mảng rồi lấy phần tử đầu tiên)
    const [transformed] = this.transformProducts([product]);
    return transformed;
  }

  // --- TÌM KIẾM SẢN PHẨM ---
  async searchProducts(searchTerm: string) {
    if (!searchTerm || searchTerm.trim().length < 2) {
      return [];
    }

    const lowerSearchTerm = searchTerm.toLowerCase().trim();

    const products = await this.prisma.product.findMany({
      where: {
        isActive: true,
        isDeleted: false,
        OR: [
            { name: { contains: lowerSearchTerm } }, 
            { slug: { contains: lowerSearchTerm } },
            { description: { contains: lowerSearchTerm } },
        ]
      },
      include: {
        category: true,
        variants: {
            include: {
                _count: {
                    select: { 
                        stockItems: { where: { status: StockStatus.AVAILABLE } } 
                    }
                }
            }
        },
      },
      take: 20,
    });

    return this.transformProducts(products);
  }

  // --- HELPER: XỬ LÝ DỮ LIỆU TRẢ VỀ (DRY - Don't Repeat Yourself) ---
  // Gom logic tính toán stock vào 1 chỗ cho gọn
  private transformProducts(products: any[]) {
    return products.map(product => {
        const totalStock = product.variants.reduce((sum, variant) => {
          return sum + variant._count.stockItems;
        }, 0);
  
        return {
          ...product,
          totalStock: totalStock,
          isOutOfStock: totalStock === 0,
          variants: product.variants.map(v => ({
            ...v,
            stock: v._count.stockItems,
          }))
        };
      });
  }

  // --- SEED DATA (Tạm thời giữ lại để nạp dữ liệu, sau này xóa) ---
  async seedCategories() { /* ... Giữ nguyên code cũ ... */ }
  async seedProducts() { /* ... Giữ nguyên code cũ ... */ }
}