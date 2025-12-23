import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { ProductsService } from '../../services/products/products.service';
import { SearchService } from '../../services/search/search.service';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly searchService: SearchService 
  ) {}

  // --- SEED DATA ---
  @Get('seed-categories')
  seedCategories() {
    return this.productsService.seedCategories();
  }

  @Get('seed-products')
  seedProducts() {
    return this.productsService.seedProducts();
  }

  // --- TÌM KIẾM ---
  @Get('search')
  search(@Query('q') q: string) {
    return this.searchService.searchAll(q);
  }

  // --- LẤY SẢN PHẨM RECOMMENDATION
  @Get('recommendations')
  @UseGuards(JwtAuthGuard) 
  async getRecommendations(@Req() req) {
      const userId = req.user.userId;
      return this.productsService.getRecommendations(userId);
  }

  // --- LẤY TẤT CẢ ---
  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  // --- LẤY CHI TIẾT ---
  @Get(':idOrSlug')
  findOne(@Param('idOrSlug') idOrSlug: string) {
    const isNumeric = /^\d+$/.test(idOrSlug);
    const query = isNumeric ? parseInt(idOrSlug) : idOrSlug;
    
    return this.productsService.findOne(query);
  }
}