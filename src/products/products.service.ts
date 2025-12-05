import { Injectable } from '@nestjs/common';
// LƯU Ý: Hãy kiểm tra lại đường dẫn import PrismaService cho đúng với cấu trúc thư mục của bạn
// Nếu file prisma.service.ts nằm ở thư mục src gốc thì dùng: '../prisma.service'
import { PrismaService } from '../prisma/prisma.service'; 
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  // 1. Inject PrismaService vào để dùng
  constructor(private prisma: PrismaService) {}

  // --- TẠO SẢN PHẨM MỚI ---
  async create(createProductDto: CreateProductDto) {
    // Lưu ý: Đây là ví dụ cơ bản. Thực tế cần validate categoryId có tồn tại không
    return this.prisma.product.create({
      data: {
        name: createProductDto.name,
        slug: createProductDto.slug, 
        // Trong thực tế bạn nên nhận categoryId từ DTO
        categoryId: 1, 
      }
    });
  }

  // --- LẤY TẤT CẢ SẢN PHẨM (Cho Trang Chủ) ---
  async findAll() {
    return this.prisma.product.findMany({
      include: {
        variants: true, // <--- QUAN TRỌNG: Lấy kèm bảng giá (variants)
        category: true, // Lấy kèm tên danh mục để lọc ở Frontend
      },
      orderBy: {
        createdAt: 'desc', // Sản phẩm mới nhất lên đầu
      }
    });
  }

  // --- LẤY CHI TIẾT 1 SẢN PHẨM (Cho trang Detail) ---
  async findOne(id: number) {
    return this.prisma.product.findUnique({
      where: { id },
      include: {
        variants: true, // Lấy các gói (1 tháng, 1 năm...)
        reviews: true,  // Lấy đánh giá
        category: true,
      },
    });
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

  // --- HÀM 2: TẠO SẢN PHẨM MẪU (BẠN ĐANG THIẾU CÁI NÀY) ---
  async seedProducts() {
    // Dữ liệu mẫu khớp với giao diện Frontend
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
        categorySlug: 'hot', // Giả sử bạn xếp nó vào Hot hoặc tạo thêm category Software
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
      // 1. Tìm category id dựa trên slug (Vì trong bảng Product lưu categoryId chứ không lưu slug)
      const category = await this.prisma.category.findUnique({ where: { slug: p.categorySlug } });
      
      // Chỉ tạo sản phẩm nếu tìm thấy danh mục
      if (category) {
        await this.prisma.product.upsert({
          where: { slug: p.slug }, // Nếu slug sản phẩm đã có thì thôi
          update: {},
          create: {
            name: p.name,
            slug: p.slug,
            thumbnail: p.thumbnail,
            categoryId: category.id, // Liên kết khóa ngoại
            variants: {
              create: p.variants // Tạo luôn bảng giá con (Nested write)
            }
          }
        });
        count++;
      }
    }
    return { message: `Đã xử lý xong dữ liệu mẫu! (Đã kiểm tra ${count} sản phẩm)` };
  }
}