import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
export declare class ProductsService {
    private productRepository;
    constructor(productRepository: Repository<Product>);
    create(createProductDto: CreateProductDto): string;
    findAll(): Promise<Product[]>;
    findOne(id: number): string;
    update(id: number, updateProductDto: UpdateProductDto): string;
    remove(id: number): string;
    seedData(): Promise<{
        message: string;
    }>;
}
