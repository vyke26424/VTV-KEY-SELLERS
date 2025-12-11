import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { CreateVariantDto, UpdateVariantDto } from '../../dto/variant.dto';
import { AdminProductVariantsService } from '../../services/admin-product-variants/admin-product-variants.service';

@Controller('admin/product-variants')
export class AdminProductVariantsController {
    constructor(private readonly variantService : AdminProductVariantsService){}
    @Post(':productId')
    async create(@Param('productId', ParseIntPipe) productId : number,
            @Body() data  : CreateVariantDto) {
                return await this.variantService.create(productId, data);
    }

    @Patch(':id')
    async update(
        @Param('id', ParseIntPipe) id : number,
        @Body() data : UpdateVariantDto
    ) {
        return await this.variantService.update(id, data);
    }

    @Get(':id')
    async findOne(
        @Param('id', ParseIntPipe) id : number
    ) {
        return await this.variantService.findOne(id);
    }

    @Delete(':id')
    async remove(@Param('id', ParseIntPipe) id : number){
        return await this.variantService.remove(id);
    }

    @Patch(':id/restore')
    async restore(
        @Param('id', ParseIntPipe) id : number
    ) {
        return await this.variantService.restore(id);
    }
    
    
}
