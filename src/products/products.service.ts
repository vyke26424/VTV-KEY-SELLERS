import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; 
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { StockStatus } from '@prisma/client'; // Import thêm để lọc trạng thái

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  // --- TẠO SẢN PHẨM MỚI ---
  async create(createProductDto: CreateProductDto) {
    return this.prisma.product.create({
      data: {
        name: createProductDto.name,
        slug: createProductDto.slug, 
        categoryId: 1, // Thực tế nên lấy từ DTO
      }
    });
  }

  // --- [ĐÃ SỬA] LẤY TẤT CẢ SẢN PHẨM (Kèm trạng thái kho) ---
  async findAll() {
    const products = await this.prisma.product.findMany({
      include: {
        category: true, 
        variants: {
          include: {
            // Đếm số lượng StockItem có trạng thái AVAILABLE
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

    // Xử lý dữ liệu để Frontend dễ dùng hơn
    return products.map(product => {
      // Tính tổng tồn kho của tất cả các gói (variant) cộng lại
      const totalStock = product.variants.reduce((sum, variant) => {
        return sum + variant._count.stockItems;
      }, 0);

      return {
        ...product,
        totalStock: totalStock, // Số lượng key còn lại
        isOutOfStock: totalStock === 0, // Cờ báo hết hàng
        // Làm sạch dữ liệu variants
        variants: product.variants.map(v => ({
          ...v,
          stock: v._count.stockItems, // Gán số lượng vào biến stock cho từng gói
        }))
      };
    });
  }

  // --- [ĐÃ SỬA] LẤY CHI TIẾT 1 SẢN PHẨM (Kèm trạng thái kho) ---
  async findOne(idOrSlug: number | string) {
    // Logic để hỗ trợ tìm bằng ID hoặc Slug (nếu bạn cần)
    const whereCondition = typeof idOrSlug === 'number' 
        ? { id: idOrSlug } 
        : { slug: idOrSlug as string };

    const product = await this.prisma.product.findFirst({
      where: whereCondition,
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

    // Xử lý dữ liệu tương tự như findAll
    const totalStock = product.variants.reduce((sum, variant) => sum + variant._count.stockItems, 0);

    return {
      ...product,
      totalStock,
      isOutOfStock: totalStock === 0,
      variants: product.variants.map(v => ({
        ...v,
        stock: v._count.stockItems
      }))
    };
  }

  // --- CẬP NHẬT ---
  async update(id: number, updateProductDto: UpdateProductDto) {
    return this.prisma.product.update({
      where: { id },
      data: updateProductDto,
    });
  }

  // --- XÓA ---
  async remove(id: number) {
    return this.prisma.product.delete({
      where: { id },
    });
  }

  // --- HÀM 1: TẠO DANH MỤC MẪU ---
  async seedCategories() {
    const categories = [
      { name: 'Sản phẩm Hot', slug: 'hot' },
      { name: 'Game Steam', slug: 'steam' },
      { name: 'Trí tuệ nhân tạo (AI)', slug: 'ai' },
      { name: 'Giải trí & Phim ảnh', slug: 'entertainment' },
    ];

    for (const cat of categories) {
      await this.prisma.category.upsert({
        where: { slug: cat.slug },
        update: {},
        create: {
          name: cat.name,
          slug: cat.slug,
        },
      });
    }

    return { message: 'Đã tạo xong 4 danh mục mẫu thành công!' };
  }

  // --- HÀM 2: TẠO SẢN PHẨM MẪU ---
  async seedProducts() {
    const products = [
      {
        name: 'Spotify Premium 1 Năm',
        slug: 'spotify-premium-1-year',
        thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg',
        categorySlug: 'entertainment', 
        variants: [
          { name: 'Gói 1 Năm', price: 290000, orginalPrice: 590000 }
        ]
      },
      {
        name: 'Netflix Premium 4K',
        slug: 'netflix-premium',
        thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/7/75/Netflix_icon.svg',
        categorySlug: 'entertainment',
        variants: [
          { name: '1 Tháng', price: 65000, orginalPrice: 260000 }
        ]
      },
      {
        name: 'ChatGPT Plus (OpenAI)',
        slug: 'chatgpt-plus',
        thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg',
        categorySlug: 'ai',
        variants: [
          { name: 'Tài khoản riêng', price: 450000, orginalPrice: 550000 }
        ]
      },
      {
        name: 'Windows 11 Pro Key',
        slug: 'windows-11-pro',
        thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/e/e6/Windows_11_logo.svg',
        categorySlug: 'hot', 
        variants: [
          { name: 'Vĩnh viễn', price: 150000, orginalPrice: 3000000 }
        ]
      },
      {
        name: 'Elden Ring',
        slug: 'elden-ring',
        thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/c/cc/Elden_Ring_logo.svg',
        categorySlug: 'steam',
        variants: [
          { name: 'Standard Edition', price: 890000, orginalPrice: 1200000 }
        ]
      },
      {
        name: 'Midjourney',
        slug: 'midjourney',
        thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/e/ed/Midjourney_Emblem.png',
        categorySlug: 'ai',
        variants: [
            { name: "Pro Plan", price: 200000, orginalPrice: 400000}
        ]
      }
    ];

    let count = 0;

    for (const p of products) {
      const category = await this.prisma.category.findUnique({ where: { slug: p.categorySlug } });
      
      if (category) {
        await this.prisma.product.upsert({
          where: { slug: p.slug },
          update: {},
          create: {
            name: p.name,
            slug: p.slug,
            thumbnail: p.thumbnail,
            categoryId: category.id,
            variants: {
              create: p.variants
            }
          }
        });
        count++;
      }
    }
    return { message: `Đã xử lý xong dữ liệu mẫu! (Đã kiểm tra ${count} sản phẩm)` };
  }
}