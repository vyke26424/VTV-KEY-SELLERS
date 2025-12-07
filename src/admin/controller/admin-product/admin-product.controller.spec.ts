import { Test, TestingModule } from '@nestjs/testing';
import { AdminProductController } from './admin-product.controller';

describe('AdminProductController', () => {
  let controller: AdminProductController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminProductController],
    }).compile();

    controller = module.get<AdminProductController>(AdminProductController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
