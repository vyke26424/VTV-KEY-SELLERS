import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { EncryptionService } from '../admin/utils/encryption/encryption.service';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService, EncryptionService],
})
export class OrdersModule {}
