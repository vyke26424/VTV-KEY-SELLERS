import { Module, forwardRef } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { ProductsModule } from '../products/products.module'; // ⬅️ Import để dùng ProductsService

@Module({
  // FIX: Wrap ProductsModule with forwardRef to break the circular dependency
  imports: [forwardRef(() => ProductsModule)], 
  controllers: [SearchController],
  providers: [SearchService],
  exports: [SearchService] 
})
export class SearchModule {}