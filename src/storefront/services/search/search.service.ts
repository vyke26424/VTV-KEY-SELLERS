import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { PrismaService } from '../../../prisma/prisma.service'; 
import { StockStatus } from '@prisma/client'; 

@Injectable()
export class SearchService {
  constructor(
    private readonly productsService: ProductsService,
    private prisma: PrismaService
  ) {}

  async searchAll(searchTerm: string) {
    if (!searchTerm || searchTerm.trim().length < 2) {
      return { products: [] };
    }

    const lowerSearchTerm = searchTerm.toLowerCase().trim();

    const products = await this.prisma.product.findMany({
      where: {
        isActive: true,
        isDeleted: false,
        OR: [
            // 1. Tìm kiếm theo Tên, Slug, Mô tả
            { name: { contains: lowerSearchTerm } }, 
            { slug: { contains: lowerSearchTerm } }, 
            { description: { contains: lowerSearchTerm } }, 
            
            // 2. TÌM KIẾM THEO KEYWORDS
            {
                keyword: {
                    some: {
                        name: { 
                            contains: lowerSearchTerm 
                        }
                    }
                }
            },

            // 3. TÌM KIẾM THEO TÊN DANH MỤC (category)
            {
                category: {
                    name: {
                        contains: lowerSearchTerm
                    }
                }
            },

            // 4. TÌM KIẾM TRONG AI METADATA (JSON) - ĐÃ LOẠI BỎ (GÂY LỖI VALIDATION)
            // Cần dùng $queryRaw để tìm kiếm trong JSON trên MySQL, không thể dùng cú pháp contains.
        ]
      },
      include: {
        category: true,
        keyword: true, 
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
      orderBy: {
          name: 'asc' 
      }
    });
    
    const transformedProducts = this.productsService.transformProducts(products);
    
    return {
      products: transformedProducts,
    };
  }
}