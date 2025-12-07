
import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
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
}
