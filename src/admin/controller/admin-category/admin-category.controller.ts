import { Body, Controller, DefaultValuePipe, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CreateCategory } from '../../dto/create_category.dto';
import { AdminCategoryService } from '../../services/admin-category/admin-category.service';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../../guard/role.guard';
import { Role } from '@prisma/client';
import { Roles } from '../../decorator/role.decorator';
import { UpdateCategoryDto } from '../../dto/update_category.dto';

@Controller('admin/categories')
@UseGuards(JwtAuthGuard, RoleGuard)
@Roles(Role.ADMIN)
export class AdminCategoryController {
    constructor(private readonly categoryService: AdminCategoryService) { }
    @Post()
    @HttpCode(HttpStatus.CREATED) //201
    async create(@Body() data: CreateCategory) {
        return await this.categoryService.create(data);
    }

    @Get()
    async findAll(@Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
        @Query('search',) search: string) {
        return await this.categoryService.findAll({ page, limit, search });
    }

    @Get(':id')
    async findOne(
        @Param('id', ParseIntPipe) id: number
    ) {
        return await this.categoryService.findOne(id);
    }

    @Patch(":id")
    async update(
        @Body() data: UpdateCategoryDto,
        @Param('id', ParseIntPipe) id: number
    ) {
        return await this.categoryService.update(id, data);
    }

    @Delete(':id')
    async delete(
        @Param('id', ParseIntPipe) id: number
    ) {
        return await this.categoryService.remove(id);
    }

    @Patch(':id/restore')
    async restore(
        @Param('id', ParseIntPipe) id: number
    ) {
        return await this.categoryService.restore(id);
    }
}
