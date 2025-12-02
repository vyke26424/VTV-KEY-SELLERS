import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  // Đã xóa constructor inject Repository

  create(createProductDto: CreateProductDto) {
    return 'This action adds a new product (Cho Prisma Logic)';
  }

  findAll() {
    return 'This action returns all products (Cho Prisma Logic)';
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}