import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; // Thêm dòng này
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from './entities/product.entity'; // Import Entity Product

@Module({
  imports: [TypeOrmModule.forFeature([Product])], // Đăng ký Product với TypeORM
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}