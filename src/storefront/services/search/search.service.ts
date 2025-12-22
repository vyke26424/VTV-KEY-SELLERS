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

  async searchAll(searchTerm: string, sort?: string, categoryId?: number) {
    const whereCondition: any = {
        isActive: true,
        isDeleted: false,
    };

    // 1. Logic tìm kiếm từ khóa
    if (searchTerm && searchTerm.trim().length >= 2) {
        const lower = searchTerm.toLowerCase().trim();
        whereCondition.OR = [
            { name: { contains: lower } },
            { slug: { contains: lower } },
            { description: { contains: lower } },
            { keyword: { some: { name: { contains: lower } } } }
        ];
    }

    // 2. Logic lọc danh mục
    if (categoryId) {
        whereCondition.categoryId = Number(categoryId);
    }

    // 3. Lấy dữ liệu từ DB
    const products = await this.prisma.product.findMany({
      where: whereCondition,
      include: {
        category: true,
        keyword: true,
        variants: {
            // Include variant để tí nữa tính giá
            include: {
                _count: { select: { stockItems: { where: { status: StockStatus.AVAILABLE } } } }
            }
        },
      },
      take: 100, // Lấy 100 kết quả để sort cho chính xác hơn
    });
    
    // 4. Transform dữ liệu & TÍNH GIÁ THẤP NHẤT (QUAN TRỌNG)
    // Chúng ta map qua từng sản phẩm để tìm ra giá rẻ nhất của nó
    let result = products.map(product => {
        // Chuyển đổi dữ liệu cơ bản (nếu productsService có logic riêng thì dùng, ko thì dùng spread)
        // Ở đây mình làm thủ công để đảm bảo có minPrice
        
        // Tìm giá thấp nhất trong các variants
        const prices = product.variants?.map(v => Number(v.price)) || [];
        const minPrice = prices.length > 0 ? Math.min(...prices) : 0;

        return {
            ...product,
            minPrice: minPrice, // Gắn thêm trường minPrice ảo để sort
            // Giữ lại các field cần thiết cho Frontend
            variants: product.variants.map(v => ({
                ...v,
                price: Number(v.price),
                orginalPrice: Number(v.orginalPrice)
            }))
        };
    });

    // 5. Xử lý Sắp xếp (Dựa trên minPrice vừa tính)
    if (sort === 'price-asc') {
        // Giá thấp đến cao
        result.sort((a, b) => a.minPrice - b.minPrice);
    } else if (sort === 'price-desc') {
        // Giá cao đến thấp
        result.sort((a, b) => b.minPrice - a.minPrice);
    } else if (sort === 'newest') {
        // Mới nhất
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return {
      products: result,
    };
  }

  // API lấy danh sách filter 
  async getCategoriesForFilter() {
      return this.prisma.category.findMany({
          select: { id: true, name: true, slug: true }
      });
  }
}