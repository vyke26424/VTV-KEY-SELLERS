import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductsService } from '../../services/products/products.service';
import { SearchService } from '../../services/search/search.service'; // ĐÃ THÊM

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly searchService: SearchService // ĐÃ THÊM
  ) {}

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
  @Get('search')
  search(@Query('q') q: string) {
    // ĐÃ CẬP NHẬT: Ủy quyền tìm kiếm cho SearchService
    return this.searchService.searchAll(q);
  }

  // --- LẤY TẤT CẢ ---
  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  // --- LẤY CHI TIẾT (Hỗ trợ cả ID và Slug) ---
  @Get(':idOrSlug')
  findOne(@Param('idOrSlug') idOrSlug: string) {
    const isNumeric = /^\d+$/.test(idOrSlug);
    const query = isNumeric ? parseInt(idOrSlug) : idOrSlug;
    
    return this.productsService.findOne(query);
  }
}