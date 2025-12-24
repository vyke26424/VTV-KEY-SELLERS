import {
    Body, Controller, Get, HttpCode, HttpStatus, Param, Post,
    UseGuards, ParseIntPipe, DefaultValuePipe, Query, Patch, Delete,
    UseInterceptors, UploadedFile
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Roles } from '../../decorator/role.decorator';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../../guard/role.guard';
import { AdminProductService } from '../../services/admin-product/admin-product.service';
import { CreateProduct } from '../../dto/create-product.dto';
import { UpdateProduct } from '../../dto/update-product.dto';
import { CloudinaryService } from '../../services/cloudinary/cloudinary.service';

@Controller('admin/product')
@UseGuards(JwtAuthGuard, RoleGuard)
@Roles(Role.ADMIN)
export class AdminProductController {
    constructor(
        private readonly productService: AdminProductService,
        private readonly cloudinaryService: CloudinaryService
    ) { }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @UseInterceptors(FileInterceptor('thumbnail'))
    async create(
        @Body() productData: CreateProduct, // <--- Dùng lại DTO chuẩn
        @UploadedFile() file: Express.Multer.File
    ) {
        // 1. Upload ảnh (nếu có)
        if (file) {
            const url = await this.cloudinaryService.uploadImage(file);
            productData.thumbnail = url;
        }
        
        // 2. Gọi service (Dữ liệu đã sạch đẹp nhờ DTO Transform)
        return await this.productService.create(productData);
    }

    @Patch(':id')
    @UseInterceptors(FileInterceptor('thumbnail'))
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() updateData: UpdateProduct, // <--- Dùng DTO chuẩn (Nhớ update file UpdateDto tương tự CreateDto)
        @UploadedFile() file: Express.Multer.File
    ) {
        if (file) {
            const url = await this.cloudinaryService.uploadImage(file);
            updateData.thumbnail = url;
        }
        return await this.productService.update(id, updateData);
    }

    // ... Các hàm Get/Delete giữ nguyên
    @Get()
    @HttpCode(HttpStatus.OK)
    async findAll(
        @Query('categoryId', new ParseIntPipe({ optional: true })) categoryId: number,
        @Query('search') search: string,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number
    ) {
        return await this.productService.findAll({ page, limit, search, categoryId });
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {
        return await this.productService.findOne(id);
    }

    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id: number) {
        return await this.productService.remove(id);
    }

    @Patch(":id/restore")
    async restore(@Param('id', ParseIntPipe) id: number) {
        return await this.productService.restore(id);
    }
}