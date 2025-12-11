import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CreateStockDto, FilterStockDto, UpdateStockDto } from '../../dto/stock.dto';
import { AdminStockitemService } from '../../services/admin-stockitem/admin-stockitem.service';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../../guard/role.guard';
import { Roles } from '../../decorator/role.decorator';
import { Role } from '@prisma/client';

@Controller('admin/stocks')
@UseGuards(JwtAuthGuard, RoleGuard)
@Roles(Role.ADMIN)
export class AdminStockitemController {
    constructor(private readonly stockService : AdminStockitemService){}
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() data : CreateStockDto) {
        return await this.stockService.create(data);
    }

    @Get()
    // API: GET /admin/stocks?page={1}&limit={20}Ư&variantId=5&status={AVAILABLE}
    async findAll(@Query() query : FilterStockDto) {
        return this.stockService.findAll(query);
    }


    @Get('stats/:variantId')
    async getStats(
        @Param('variantId', ParseIntPipe) variantId : number
    ) {
        return await this.stockService.getInventoryStats(variantId);
    }

    @Get(':id')
    async findOne(
        @Param('id', ParseIntPipe) id : number
    ) {
        return await this.stockService.findOne(id);
    }

    @Patch(':id')
    async update(
        @Param('id', ParseIntPipe) id : number,
        @Body() data : UpdateStockDto
    ) {
        return await this.stockService.update(id, data)
    }

    @Delete(':id')
    async remove(
        @Param('id', ParseIntPipe) id : number
    ) {
        return await this.stockService.remove(id);
    }

}
