import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateProuct } from '../../dto/create-product.dto';
import { Prisma } from '@prisma/client';
import slugify from 'slugify';
import e from 'express';


@Injectable()
export class AdminProductService {
    constructor(private readonly prismaSerivce : PrismaService){}

    async create(data : CreateProuct) {
        const categoryExists = await this.prismaSerivce.category.findUnique({
            where : {id : data.categoryId}
        });
        if(!categoryExists) {
            throw new NotFoundException('Category không tồn tại');
        }

        let slug = data.slug ? slugify(data.slug,{
            locale : 'vi',
            lower : true,
            trim: true,
            strict : true
        }) : slugify(data.name, {
            locale : 'vi',
            lower : true,
            strict : true,
            trim : true
        });

        slug = await this.checkUniqueSlug(slug)

        try {
            const product = await this.prismaSerivce.product.create({
            data : {
                name : data.name,
                slug : slug,
                description : data.description,
                thumbnail : data.thumbnail,
                keywords : data.keywords ?? Prisma.JsonNull ,
                aiMetadata : data.meta ?? Prisma.JsonNull,
                categoryId : data.categoryId,
                variants : data.variants && data.variants.length > 0 ? {
                    create : data.variants.map((v) => ({
                        name : v.name ,
                        price : v.price,
                        orginalPrice : v.price
                    }))
                } : undefined 
            }
        });
        return product ;
        } catch (error) {
            this.handleError(error);
        }
    }

    private async checkUniqueSlug(slugCheck : string) : Promise<string> {
        let count = 1 ;
        let slug = slugCheck ;
        while(true) {
            const exists = await this.prismaSerivce.product.findUnique({
                where : {slug : slug},
                select : {id : true}
            });
            if(!exists) break ;
            slug = `${slugCheck}-${count}`
            count++ ;
            }
            return slug ;
    }

    private handleError(error : any) : never {
        if( error instanceof Prisma.PrismaClientKnownRequestError){
            if(error.code === 'P2002') {
                throw new ConflictException('Slug hoặc tên đã tồn tại');
            }
        }
        console.log(error);
        throw new BadRequestException('Không thể tạo product');
    }
}
