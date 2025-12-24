import { Test, TestingModule } from '@nestjs/testing';
import { AdminProductController } from './admin-product.controller';
import { AdminProductService } from '../../services/admin-product/admin-product.service';
import { CloudinaryService } from '../../services/cloudinary/cloudinary.service';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../../guard/role.guard';

describe('AdminProductController', () => {
  let controller: AdminProductController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminProductController],
      providers: [
        {
          provide: AdminProductService,
          useValue: {
            // Mock các phương thức được sử dụng bởi controller
            create: jest.fn().mockResolvedValue({}),
            findAll: jest.fn().mockResolvedValue([]),
            findOne: jest.fn().mockResolvedValue({}),
            update: jest.fn().mockResolvedValue({}),
            remove: jest.fn().mockResolvedValue({}),
            restore: jest.fn().mockResolvedValue({}),
          },
        },
        {
          provide: CloudinaryService,
          useValue: {
            uploadImage: jest.fn().mockResolvedValue('http://example.com/image.jpg'),
          },
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(RoleGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<AdminProductController>(AdminProductController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
