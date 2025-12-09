import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';

@Injectable()
export class SearchService {
  // Inject ProductsService để truy cập hàm tìm kiếm database
  constructor(private readonly productsService: ProductsService) {}

  /**
   * Phương thức tìm kiếm chung, có thể mở rộng để tìm kiếm nhiều Entity
   */
  async searchAll(query: string) {
    if (!query || query.trim().length < 2) {
      return { products: [] };
    }

    // ⬅️ Gọi phương thức searchProducts đã được định nghĩa trong ProductsService
    const products = await this.productsService.searchProducts(query);
    
    // Trả về kết quả dưới dạng cấu trúc đa Entity (hiện tại chỉ có products)
    return {
      products: products,
      // future: users: await this.userService.searchUsers(query),
    };
  }
}