import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from '../../services/search/search.service';
import { Public } from '../../../auth/decorators/public.decorator'; // Giả sử decorator này tồn tại

@Controller('search') // Base URL là /search
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  // Route: GET /search?q=term
  @Public() // Đặt Public() vì tìm kiếm thường là công khai
  @Get()
  async globalSearch(@Query('q') q: string) {
    // Trả về kết quả tìm kiếm từ SearchService
    return this.searchService.searchAll(q);
  }
}