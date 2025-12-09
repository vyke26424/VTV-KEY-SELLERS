import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [],
  controllers: [ProductsController],
  providers: [
    ProductsService, 
    PrismaService 
  ],
// ⬅️ BỔ SUNG: EXPORT ProductsService để module khác dùng
  exports: [ProductsService],  
})
export class ProductsModule {}