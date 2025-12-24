import { BadRequestException, ConflictException, Injectable, NotFoundException, Param, UseGuards } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateProduct } from '../../dto/create-product.dto';
import { Prisma } from '@prisma/client';
import slugify from 'slugify';
import { FindAllProductDto } from '../../dto/findAll-product.dto';
import { UpdateProduct } from '../../dto/update-product.dto';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { RoleGuard } from '../../guard/role.guard';
import { StockStatus } from '@prisma/client';



@Injectable()
export class AdminProductService {
    constructor(private readonly prismaSerivce: PrismaService) { }

    async create(data: CreateProduct) {
        const tagOrCreate = data.keywords?.map((key) => ({
            where: { name: key },
            create: { name: key }
        }));
        const categoryExists = await this.prismaSerivce.category.findUnique({
            where: { id: data.categoryId }
        });
        if (!categoryExists) {
            throw new NotFoundException('Category không tồn tại');
        }

        let slug = data.slug ? slugify(data.slug, {
            locale: 'vi',
            lower: true,
            trim: true,
            strict: true
        }) : slugify(data.name, {
            locale: 'vi',
            lower: true,
            strict: true,
            trim: true
        });

        slug = await this.checkUniqueSlug(slug)

        try {
            const product = await this.prismaSerivce.product.create({
                data: {
                    name: data.name,
                    slug: slug,
                    description: data.description,
                    thumbnail: data.thumbnail,
                    //keywords : data.keywords ?? Prisma.JsonNull ,
                    keyword: {
                        connectOrCreate: tagOrCreate //Mảng
                    },
                    aiMetadata: data.meta ?? Prisma.JsonNull, //Object
                    categoryId: data.categoryId,
                    variants: data.variants && data.variants.length > 0 ? {
                        create: data.variants.map((v) => ({
                            name: v.name,
                            price: v.price,
                            orginalPrice: v.price
                        }))
                    } : undefined
                }
            });
            return product;
        } catch (error) {
            this.handleError(error);
        }
    }

    async findAll(query?: FindAllProductDto) {
        const { page = 1, limit = 10, search, categoryId, viewDeleted = false } = query || {};
        const skip = (page - 1) * limit;

        const whereCondition: Prisma.ProductWhereInput = {
            isDeleted: viewDeleted ? true : false,
            categoryId: categoryId ? Number(categoryId) : undefined
        }

        if (search) {
            // ... logic search giữ nguyên ...
            whereCondition.OR = [
                { name: { contains: search } },
                { slug: { contains: search } },
                { description: { contains: search } },
                {
                    keyword: { some: { name: { contains: search } } }
                }


            ]
        }

        const [productsRaw, total] = await Promise.all([
            this.prismaSerivce.product.findMany({
                where: whereCondition,
                take: limit,
                skip: skip,
                orderBy: { createdAt: 'desc' }, // Nên sắp xếp mới nhất lên đầu
                include: {
                    category: {
                        select: { name: true, slug: true }
                    },
                    // --- NÂNG CẤP: INCLUDE BIẾN THỂ & ĐẾM STOCK ---
                    variants: {
                        where: { isDeleted: false },
                        include: {
                            _count: {
                                select: {
                                    stockItems: { where: { status: StockStatus.AVAILABLE } }
                                }
                            }
                        }
                    }
                },
            }),
            this.prismaSerivce.product.count({
                where: whereCondition
            })
        ]);

        // --- XỬ LÝ DỮ LIỆU ĐỂ TRẢ VỀ FORMAT ĐẸP CHO FRONTEND ---
        const products = productsRaw.map(p => {
            // Tính tổng tồn kho
            const totalStock = p.variants.reduce((sum, v) => sum + v._count.stockItems, 0);

            return {
                ...p,
                totalStock,
                variants: p.variants.map(v => ({
                    ...v,
                    stock: v._count.stockItems
                }))
            };
        });

        return {
            product: products, // Trả về key 'product'
            meta: {
                page,
                limit,
                totalPage: Math.ceil((total) / limit),
                total // Thêm total để biết tổng số lượng
            }
        }
    }

    async findOne(id: number) {
        const product = await this.prismaSerivce.product.findUnique({
            where: { id, isDeleted: false, isActive: true },
            include: {
                variants: true,
                keyword: true,
                //reviews : {take : 5, orderBy : {createdAt : 'desc'}  } lấy luôn cmt nhưng mà chờ chắc còn xa : ) 
            }
        });
        if (!product) {
            throw new NotFoundException('Sản phẩm không tìm thấy');
        }
        return product;
    }



    async update(id: number, data: UpdateProduct) {
        const product = await this.prismaSerivce.product.findUnique({
            where: { id, isDeleted: false, }
        });
        if (!product) {
            throw new NotFoundException('Không tìm thấy sản phẩm');
        }
        let newSlug: string | undefined = undefined;
        if (data.slug && data.slug !== product.slug) {
            newSlug = await this.checkUniqueSlug(slugify(data.slug, {
                strict: true,
                trim: true,
                locale: 'vi',
                lower: true
            }));
        }
        if (data.name && data.name !== product.name && !data.slug) {
            newSlug = await this.checkUniqueSlug(slugify(data.name, {
                strict: true,
                trim: true,
                locale: 'vi',
                lower: true
            }));
        }
        let keywordUpdate: any;
        if (data.keywords) {
            keywordUpdate = {
                set: [],
                connectOrCreate: data.keywords.map((k) => ({
                    where: { name: k },
                    create: { name: k }
                }))
            }
        }

        return await this.prismaSerivce.product.update({
            where: { id, isActive: true, },
            data: {
                name: data.name,
                slug: newSlug,
                description: data.description,
                thumbnail: data.thumbnail,
                aiMetadata: data.meta ?? undefined,
                categoryId: data.categoryId,
                keyword: keywordUpdate
            },
            include: {
                keyword: true
            }
        })

    }

    async remove(productId: number) {
        return await this.prismaSerivce.$transaction([
            this.prismaSerivce.productVariant.updateMany({
                where: { productId: productId, isDeleted: false },
                data: { isDeleted: true, deletedAt: new Date() }
            }),
            this.prismaSerivce.product.update({
                where: { id: productId },
                data: { isDeleted: true, deletedAt: new Date() }
            })
        ]);
    }

    async restore(id: number) {
        const product = await this.prismaSerivce.product.findUnique({
            where: { id }
        });
        if (!product) {
            throw new NotFoundException('Không tìm thấy sản phẩm');
        }
        if (!product.isDeleted) {
            return {
                message: "Sản phẩm vẫn đang hoạt động"
            }
        }
        if (product.isDeleted) {
            return await this.prismaSerivce.$transaction([
                this.prismaSerivce.productVariant.updateMany({
                    where: { productId: id, isDeleted: true, },
                    data: {
                        isDeleted: false, deletedAt: null
                    }
                }),
                this.prismaSerivce.product.update({
                    where: { id },
                    data: {
                        isDeleted: false, deletedAt: null
                    }
                })
            ])
        }
    }
    private async checkUniqueSlug(slugCheck: string): Promise<string> {
        let count = 1;
        let slug = slugCheck;
        while (true) {
            const exists = await this.prismaSerivce.product.findUnique({
                where: { slug: slug },
                select: { id: true }
            });
            if (!exists) break;
            slug = `${slugCheck}-${count}`
            count++;
        }
        return slug;
    }

    private handleError(error: any): never {
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                throw new ConflictException('Slug hoặc tên đã tồn tại');
            }
        }
        console.log(error);
        throw new BadRequestException('Không thể tạo product');
    }
}
