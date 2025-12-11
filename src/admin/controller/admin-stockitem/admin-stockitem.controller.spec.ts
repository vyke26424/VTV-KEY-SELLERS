import { Test, TestingModule } from '@nestjs/testing';
import { AdminStockitemController } from './admin-stockitem.controller';

describe('AdminStockitemController', () => {
  let controller: AdminStockitemController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminStockitemController],
    }).compile();

    controller = module.get<AdminStockitemController>(AdminStockitemController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
