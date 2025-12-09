import { Test, TestingModule } from '@nestjs/testing';
import { AdminProductVariantsService } from './admin-product-variants.service';

describe('AdminProductVariantsService', () => {
  let service: AdminProductVariantsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminProductVariantsService],
    }).compile();

    service = module.get<AdminProductVariantsService>(AdminProductVariantsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
