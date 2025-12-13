import { Module, forwardRef } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PrismaService } from '../prisma/prisma.service';
import { SearchModule } from '../search/search.module'; 

@Module({
  // FIX: Wrap SearchModule with forwardRef to break the circular dependency
  imports: [forwardRef(() => SearchModule)], 
  controllers: [ProductsController],
  providers: [
    ProductsService, 
    PrismaService 
  ],
// ⬅️ BỔ SUNG: EXPORT ProductsService để module khác dùng
  exports: [ProductsService],  
})
export class ProductsModule {}