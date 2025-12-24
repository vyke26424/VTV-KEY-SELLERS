import { Controller, Get, Param, Query, Patch, Body, ParseIntPipe, UseGuards, DefaultValuePipe } from '@nestjs/common';
import { AdminOrdersService } from '../../services/admin-orders/admin-orders.service';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../../guard/role.guard';
import { Roles } from '../../decorator/role.decorator';
import { Role, OrderStatus } from '@prisma/client';

@Controller('admin/orders')
@UseGuards(JwtAuthGuard, RoleGuard)
@Roles(Role.ADMIN)
export class AdminOrdersController {
  constructor(private readonly ordersService: AdminOrdersService) {}

  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('search') search: string,
    @Query('status') status: OrderStatus
  ) {
    return this.ordersService.findAll({ page, limit, search, status });
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.findOne(id);
  }

  // 1. API DUYỆT ĐƠN (Approve)
  @Patch(':id/approve')
  async approveOrder(@Param('id', ParseIntPipe) id: number) {
    return await this.ordersService.approveOrder(id);
  }

  // 2. API HỦY ĐƠN (Cancel)
  @Patch(':id/cancel')
  async cancelOrder(@Param('id', ParseIntPipe) id: number) {
    return await this.ordersService.cancelOrder(id);
  }
}