import { Module } from '@nestjs/common';
import { HttpModule } from "@nestjs/axios";

import { AdminProductService } from './services/admin-product/admin-product.service';
import { AdminCategoryService } from './services/admin-category/admin-category.service';
import { AdminCategoryController } from './controller/admin-category/admin-category.controller';
import { AdminProductController } from './controller/admin-product/admin-product.controller';
import { AdminProductVariantsService } from './services/admin-product-variants/admin-product-variants.service';
import { AdminProductVariantsController } from './controller/admin-product-variants/admin-product-variants.controller';
import { AdminStockitemService } from './services/admin-stockitem/admin-stockitem.service';
import { AdminStockitemController } from './controller/admin-stockitem/admin-stockitem.controller';
import { EncryptionService } from './utils/encryption/encryption.service';
import { AdminOrdersController } from './controller/admin-orders/admin-orders.controller';
import { AdminOrdersService } from './services/admin-orders/admin-orders.service';
import { UserController } from './controller/admin-user/admin-user.controller';
import { AdminUserService } from './services/admin-user/admin-user.service';
import { AdminSettingsService } from './services/admin-settings/admin-settings.service';
import { AdminSettingsController } from './controller/admin-settings/admin-settings.controller';
import { ChatService } from './services/chat/chat.service';
import { ChatController } from './controller/chat/chat.controller';

@Module({
    imports: [HttpModule],
    controllers: [
        AdminCategoryController,
        AdminProductController,
        AdminProductVariantsController,
        AdminStockitemController,
        UserController,
        AdminOrdersController,
        AdminSettingsController,
        ChatController
    ],
    providers: [
        AdminProductService,
        AdminCategoryService,
        AdminProductVariantsService,
        AdminStockitemService,
        EncryptionService,
        AdminUserService,
        AdminOrdersService,
        AdminSettingsService,
        ChatService,
    ]
})
export class AdminModule {}
