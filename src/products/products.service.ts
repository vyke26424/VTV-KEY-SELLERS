import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'; // <--- MỚI: Để dùng TypeORM
import { Repository } from 'typeorm';               // <--- MỚI: Để định nghĩa kiểu Repository
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity'; // <--- MỚI: Import Entity sản phẩm

@Injectable()
export class ProductsService {
  // 1. Bơm Repository vào để sử dụng
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  create(createProductDto: CreateProductDto) {
    return 'This action adds a new product';
  }

  // 2. Sửa hàm này: Lấy dữ liệu thật từ DB
  findAll() {
    return this.productRepository.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }

  // 3. THÊM HÀM MỚI: Tạo dữ liệu mẫu
  async seedData() {
    // Kiểm tra xem đã có dữ liệu chưa
    const count = await this.productRepository.count();
    
    if (count > 0) {
      return { message: 'Dữ liệu đã có sẵn, không cần tạo thêm!' };
    }

    // Dữ liệu mẫu
    const mockData = [
      { name: 'Spotify Premium 1 Năm', price: 290000, oldPrice: 590000, category: 'ent', image: '🎵', description: 'Nghe nhạc bản quyền' },
      { name: 'ChatGPT Plus', price: 450000, oldPrice: 550000, category: 'ai', image: '🤖', description: 'AI thông minh nhất' },
      { name: 'Elden Ring', price: 890000, oldPrice: 1200000, category: 'steam', image: '⚔️', description: 'Game hay nhất năm' },
      { name: 'Windows 11 Pro', price: 150000, oldPrice: 3500000, category: 'hot', image: '🪟', description: 'Bản quyền vĩnh viễn' },
      { name: 'Netflix 4K', price: 65000, oldPrice: 260000, category: 'ent', image: '🎬', description: 'Xem phim 4K' },
    ];

    // Lưu từng món vào DB
    for (const item of mockData) {
      const product = this.productRepository.create(item);
      await this.productRepository.save(product);
    }
    
    return { message: 'Đã tạo dữ liệu mẫu thành công!' };
  }
}