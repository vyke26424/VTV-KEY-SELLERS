import { Injectable } from '@nestjs/common';
import { CreateAdminOrderDto } from '../../dto/create-admin-order.dto';
import { UpdateAdminOrderDto } from '../../dto/update-admin-order.dto';

@Injectable()
export class AdminOrdersService {
  create(createAdminOrderDto: CreateAdminOrderDto) {
    return 'This action adds a new adminOrder';
  }

  findAll() {
    return `This action returns all adminOrders`;
  }

  findOne(id: number) {
    return `This action returns a #${id} adminOrder`;
  }

  update(id: number, updateAdminOrderDto: UpdateAdminOrderDto) {
    return `This action updates a #${id} adminOrder`;
  }

  remove(id: number) {
    return `This action removes a #${id} adminOrder`;
  }
}
