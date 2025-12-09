import { Test, TestingModule } from '@nestjs/testing';
import { AdminProductVariantsController } from './admin-product-variants.controller';

describe('AdminProductVariantsController', () => {
  let controller: AdminProductVariantsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminProductVariantsController],
    }).compile();

    controller = module.get<AdminProductVariantsController>(AdminProductVariantsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
