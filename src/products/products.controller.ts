import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // --- SEED DATA (Giữ lại để nạp dữ liệu) ---
  @Get('seed-categories')
  seedCategories() {
    return this.productsService.seedCategories();
  }

  @Get('seed-products')
  seedProducts() {
    return this.productsService.seedProducts();
  }

  // --- TÌM KIẾM SẢN PHẨM ---
  // Lưu ý: Phải đặt route này TRƯỚC route ':idOrSlug' 
  // Nếu không chữ "search" sẽ bị hiểu nhầm là slug của sản phẩm
  @Get('search')
  search(@Query('q') q: string) {
    return this.productsService.searchProducts(q);
  }

  // --- LẤY TẤT CẢ ---
  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  // --- LẤY CHI TIẾT (Hỗ trợ cả ID và Slug) ---
  // Ví dụ: GET /products/1  hoặc  GET /products/netflix-premium
  @Get(':idOrSlug')
  findOne(@Param('idOrSlug') idOrSlug: string) {
    // Kiểm tra xem input là chuỗi số hay chữ
    const isNumeric = /^\d+$/.test(idOrSlug);
    
    // Nếu là số -> chuyển thành Number, nếu là chữ -> giữ nguyên String
    const query = isNumeric ? parseInt(idOrSlug) : idOrSlug;
    
    return this.productsService.findOne(query);
  }
}