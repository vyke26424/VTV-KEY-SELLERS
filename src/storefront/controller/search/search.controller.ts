import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from '../../services/search/search.service';
import { Public } from '../../../auth/decorators/public.decorator';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Public()
  @Get()
  async globalSearch(
      @Query('q') q: string,
      @Query('sort') sort: string,
      @Query('category') category: string // Nhận thêm param category
  ) {
    return this.searchService.searchAll(q, sort, category ? Number(category) : undefined);
  }

  // API mới để lấy danh sách filter
  @Public()
  @Get('filters')
  async getFilters() {
      return this.searchService.getCategoriesForFilter();
  }
}