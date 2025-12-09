import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { ProductsModule } from '../products/products.module'; // ⬅️ Import để dùng ProductsService

@Module({
  imports: [ProductsModule], // Cần import ProductsModule
  controllers: [SearchController],
  providers: [SearchService],
  exports: [SearchService] 
})
export class SearchModule {}