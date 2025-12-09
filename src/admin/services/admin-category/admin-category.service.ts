import { ConflictException, Injectable, InternalServerErrorException, NotFoundException, Search } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateCategory } from '../../dto/create_category.dto';
import slugify from 'slugify';
import { constants } from 'buffer';
import { UpdateCategoryDto } from '../../dto/update_category.dto';
import e from 'express';
import { Prisma } from '@prisma/client';


@Injectable()
export class AdminCategoryService {
    constructor(private readonly prismaService : PrismaService){}
    async create(data : CreateCategory) {
        try {
            const slug = data.slug ? slugify(data.slug, {
                strict : true,
                trim : true,
                locale : 'vi',
                lower : true
            }) : slugify(data.name, {
                trim : true,
                strict : true,
                lower : true,
                locale : 'vi'
            });
    
            return await this.prismaService.category.create({
                data : {
                    name : data.name,
                    slug : slug
                }
            });
        } catch (error) {
            if(error instanceof Prisma.PrismaClientKnownRequestError) {
                if(error.code === 'P2002') {
                    throw new ConflictException('Loại category hoặc slug này đã tồn tại');
                }
                
            }else {
                console.log(error)
                throw new InternalServerErrorException();
            }
        }
    }

    async findAll(param? : {page? : number, limit? : number, search? : string}) {
        const page = Number(param?.page) || 1;
        const limit = Number(param?.limit) || 10 ;
        const search = param?.search || '';
        const whereCondition = {
                isDeleted : false,
                ...(search && {
                    OR : [
                        {
                            name : {contains : search, }
                        },
                        {
                            slug : {contains : search, }
                        },
                        {
                            products :  {
                                some : {
                                    OR : [
                                    {name : {contains : search, }},
                                    {slug : {contains : search, } }
                                    ]
                                    
                                }
                            }
                        }
                    ]
                })   
            }

        const [data, total] = await this.prismaService.$transaction([
            this.prismaService.category.findMany({
                skip : (page - 1) * limit,
                take : limit,
                where : whereCondition,
                orderBy : {id : 'desc'},
                include : {
                    _count : {
                        select : {products : true}
                    }
                }
            }),
            this.prismaService.category.count({where : whereCondition})
        ]);

        return {
            data,
            metadata : {
                total,
                page,
                limit,
                totalPage : Math.ceil(total / limit)
            }
        }
    }

    async findOne(id: number) {
        const category = await this.prismaService.category.findFirst({
            where : {
                id, 
                isDeleted : false
            },
            include : {
                _count : {
                    select : {
                        products : true
                    }
                }
            }
        });
        if(!category) {
            throw new NotFoundException(`Category với id ${id} không tồn tại hoặc đã bị xóa`);
        }
        return category ;
    }

    async update(id : number, data : UpdateCategoryDto) {
        const currentCategory = await this.findOne(id);
        let newSlug = currentCategory.slug ;
        if(data.slug && data.slug !== currentCategory.slug) {
            newSlug = this.generateSlug(data.slug);
            await this.checkSlugUnique(newSlug, id);
        }
        else if(!data.slug &&data.name && data.name !== currentCategory.name) {
            newSlug = this.generateSlug(data.name);
            await this.checkSlugUnique(newSlug, id);
        }

        try {
            await this.prismaService.category.update({
                where : {id, isDeleted : false},
                data : {
                    name : data.name,
                    slug : newSlug
                }
            })
        } catch (error) {
            this.handleError(error);
        }

    }

    async remove(id : number) {
        await this.findOne(id);
        return await this.prismaService.category.update({
            where : {id},
            data : {
                isDeleted : true,
                deletedAt : new Date()
            }
        })
    }

    async restore(id : number) {
        const category = await this.prismaService.category.findFirst({
            where : {id}
        });
        if(!category){
            throw new NotFoundException('Không tìm thấy category');
        }
        if(!category.isDeleted){
            throw new ConflictException('Category này chưa bị xóa')
        }
        return await this.prismaService.category.update({
            where : {id},
            data : {
                isDeleted : false,
                deletedAt : null
            }
        });
    }
    private generateSlug(text : string) : string {
        return slugify(text, {
            strict : true,
            lower : true,
            trim : true,
            locale : 'vi'
        });
    }

        private async checkSlugUnique(slug : string, excludeId? : number) {
        const existing = await this.prismaService.category.findFirst({
            where : {
                slug : slug,
                ...(excludeId && {id : {not : excludeId}})
            }
        });
        if(existing) {
            throw new ConflictException('Slug đã tồn tại, vui lòng chọn tên khác');
        }
    }

    private handleError (error : any) : never {
        if(error instanceof Prisma.PrismaClientKnownRequestError) {
            if(error.code === 'P2002') {
                throw new ConflictException('Slug của category này đã tồn tại')
            }
            if(error.code === 'P2025') {
                throw new NotFoundException('Không tìm thấy category này')
            }
           
        }
        throw error ;
    }
}
