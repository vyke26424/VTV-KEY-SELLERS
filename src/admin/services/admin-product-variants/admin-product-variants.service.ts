import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateVariantDto, UpdateVariantDto } from '../../dto/variant.dto';
import { NotFoundError } from 'rxjs';

@Injectable()
export class AdminProductVariantsService {
    constructor(private readonly prismaService : PrismaService){}

    async create(productId : number, data : CreateVariantDto) {
        const product = await this.prismaService.product.findUnique({
            where :  {id : productId}
        });
        if(!product) {
            throw new NotFoundException('Không tim thấy sản phẩm để tạo variant');
        }
        return await this.prismaService.productVariant.create({
            data : {
                productId,
                name : data.name,
                price : data.price,
                orginalPrice : data.orginalPrice
            }
        });
    }

    async update(id : number, data : UpdateVariantDto) {
        const variant = await this.prismaService.productVariant.findUnique({
            where : {id, isDeleted : false}
        });
        if(!variant) {
            throw new NotFoundException('Không tìm thấy variant');
        }
        return await this.prismaService.productVariant.update({
            where : {id},
            data : {
                name : data.name,
                price : data.price,
                orginalPrice : data.orginalPrice
            }
        })
    }

    async findOne (id : number) {
        const variant = await this.prismaService.productVariant.findUnique({
            where : {id, isDeleted : false},
            include : {
                _count : {
                    select : {
                        stockItems : {where : {status : 'AVAILABLE'}}
                    }
                }
            }
        });
        if(!variant) {
            throw new NotFoundException('Variant không tồn tại');
        }
        return variant ;

    }

    async remove (id : number) {
        const stockItem = await this.prismaService.stockItem.count({
            where : {variantId : id, status : 'AVAILABLE'}
        });
        if(stockItem > 0) {
            throw new BadRequestException('Còn hàng trong kho, không thể xóa');
        }
        return await this.prismaService.productVariant.update({
            where : {id},
            data : {
                isDeleted : true, 
                deletedAt : new Date()
            }
        });
    }

    async restore(id : number) {
        const variant = await this.prismaService.productVariant.findUnique({
            where : {id},
            include : {product : true}
        });
        if(!variant) {
            throw new NotFoundException ('Variant không tồn tại');
        }
        if(variant.product.isDeleted) {
            throw new BadRequestException("Product của gói này đang bị xóa, vui lòng khôi phục");
        }
        return await this.prismaService.productVariant.update({
            where : {id, isDeleted : true},
            data : {
                isDeleted : true,
                deletedAt : null 
            }
        })
    }
}
