import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AdminOrdersService } from '../../services/admin-orders/admin-orders.service';
import { CreateAdminOrderDto } from '../../dto/create-admin-order.dto';
import { UpdateAdminOrderDto } from '../../dto/update-admin-order.dto';

@Controller('admin-orders')
export class AdminOrdersController {
  constructor(private readonly adminOrdersService: AdminOrdersService) {}

  @Post()
  create(@Body() createAdminOrderDto: CreateAdminOrderDto) {
    return this.adminOrdersService.create(createAdminOrderDto);
  }

  @Get()
  findAll() {
    return this.adminOrdersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminOrdersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAdminOrderDto: UpdateAdminOrderDto) {
    return this.adminOrdersService.update(+id, updateAdminOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminOrdersService.remove(+id);
  }
}
