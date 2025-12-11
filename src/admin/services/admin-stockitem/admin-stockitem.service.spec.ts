import { Test, TestingModule } from '@nestjs/testing';
import { AdminStockitemService } from './admin-stockitem.service';

describe('AdminStockitemService', () => {
  let service: AdminStockitemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminStockitemService],
    }).compile();

    service = module.get<AdminStockitemService>(AdminStockitemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
