
import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, UseGuards, ParseIntPipe, DefaultValuePipe, Query } from '@nestjs/common';
import { Roles } from '../../decorator/role.decorator';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../../guard/role.guard';
import { AdminProductService } from '../../services/admin-product/admin-product.service';
import { CreateProuct } from '../../dto/create-product.dto';

@Controller('admin/product')
@UseGuards(JwtAuthGuard, RoleGuard)
@Roles(Role.ADMIN)
export class AdminProductController {
    constructor(private readonly productService : AdminProductService){}
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() data : CreateProuct){
        return await this.productService.create(data);
    }

    @Get()
    @HttpCode(HttpStatus.OK)
    async findAll(@Query('categoryId', new ParseIntPipe({optional : true})) categoryId : number,
                    @Query('search') search : string,
                    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit : number,
                    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page : number)  {
        return await this.productService.findAll({page, limit, search, categoryId});
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id : number) {
        return await this.productService.findOne(id);
    }
}
