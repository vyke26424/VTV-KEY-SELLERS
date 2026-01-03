import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateStockDto, FilterStockDto, UpdateStockDto } from '../../dto/stock.dto';
import { EncryptionService } from '../../utils/encryption/encryption.service';
import { Prisma, StockStatus } from '@prisma/client';

@Injectable()
export class AdminStockitemService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly encrypt: EncryptionService
    ) { }

    async create(data: CreateStockDto) {
        const variant = await this.prismaService.productVariant.findUnique({
            where: { id: data.variantId }
        });
        if (!variant) {
            throw new NotFoundException('Không tìm thấy gói sản phẩm');
        }

        // Mã hóa key trước khi lưu vào DB (Giữ nguyên logic này để bảo mật dữ liệu gốc)
        const dataInsert = data.credentials.map((cred) => {
            const credential = this.encrypt.encryptionCredential(cred);
            return {
                variantId: data.variantId,
                credential: credential,
                metadata: data.metadata,
                status: StockStatus.AVAILABLE
            };
        });

        const result = await this.prismaService.stockItem.createMany({
            data: dataInsert,
            skipDuplicates: true
        });

        return {
            message: `Đã nhập thành công ${result.count} keys vào kho`,
            variant: variant.name
        };
    }

    async findAll(data: FilterStockDto) {
        const page = data.page || 1;
        const limit = data.limit || 20;
        const skip = (page - 1) * limit;
        const whereCondition: Prisma.StockItemWhereInput = {
            variantId: data.variantId ? Number(data.variantId) : undefined,
            status: data.status ?? undefined
        };

        if (data.search) {
            const searchCondition = {
                contains: data.search,
                mode: 'insensitive' as const,
            };
            whereCondition.OR = [
                {
                    variant: {
                        product: { name: searchCondition },
                    },
                },
                {
                    variant: { name: searchCondition },
                },
            ];
        }
        const [stocks, total] = await Promise.all([
            this.prismaService.stockItem.findMany({
                where: whereCondition,
                skip: skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    variant: { select: { name: true, product: { select: { name: true } } } },
                    orderItem: { select: { order: { select: { code: true, userId: true } } } }
                }
            }),
            this.prismaService.stockItem.count({
                where: whereCondition
            })
        ]);

        // --- THAY ĐỔI Ở ĐÂY: MASKING (CHE GIẤU KEY) ---
        const maskedStocks = stocks.map((stock) => {
            return {
                ...stock,
                // Thay vì decrypt, ta trả về chuỗi ẩn. 
                // Admin chỉ cần biết là "Có Key" chứ không cần biết nội dung Key.
                credential: '********************',

                // Giữ lại các thông tin khác để Admin quản lý
                productName: stock.variant?.product?.name,
                variantName: stock.variant?.name,
                orderCode: stock.orderItem?.order?.code || null,
                buyerId: stock.orderItem?.order?.userId || null
            };
        });

        return {
            data: maskedStocks,
            meta: {
                total,
                page,
                limit,
                totalPage: Math.ceil(total / limit)
            }
        };
    }

    async update(id: number, data: UpdateStockDto) {
        const stock = await this.prismaService.stockItem.findUnique({
            where: { id }
        });
        if (!stock) {
            throw new NotFoundException('Key không tồn tại');
        }
        if (stock?.status === StockStatus.SOLD && data.credential) {
            throw new BadRequestException('Key đã được sử dụng, không thể chỉnh sửa nội dung');
        }

        let newCredential: string | undefined = undefined;
        // Nếu Admin nhập key mới để sửa, ta vẫn phải mã hóa nó trước khi lưu
        if (data.credential) {
            newCredential = this.encrypt.encryptionCredential(data.credential);
        }

        return this.prismaService.stockItem.update({
            where: { id },
            data: {
                credential: newCredential, // Lưu key đã mã hóa
                metadata: data.metadata,
                status: data.status,
            }
        });
    }

    async remove(id: number) {
        const stock = await this.prismaService.stockItem.findUnique({
            where: { id }
        });
        if (!stock) {
            throw new NotFoundException('Không tìm thấy sản phẩm');
        }
        if (stock.status === StockStatus.SOLD) {
            throw new BadRequestException('Key đã được bán, không thể xóa');
        }
        if (stock.status === StockStatus.LOCKED) {
            throw new BadRequestException('Sản phẩm đang được người dùng thanh toán');
        }

        return await this.prismaService.stockItem.delete({
            where: { id }
        });
    }

    async getInventoryStats(variantId: number) {
        return await this.prismaService.stockItem.groupBy({
            by: ['status'],
            where: { variantId: variantId },
            _count: {
                status: true
            }
        });
    }

    async findOne(id: number) {
        const storedKey = await this.prismaService.stockItem.findUnique({
            where: { id },
            include: {
                variant: { include: { product: true } },
                orderItem: { include: { order: true } }
            }
        });
        if (!storedKey) {
            throw new NotFoundException('Không có key tồn tại');
        }

        // --- THAY ĐỔI Ở ĐÂY: CŨNG CHE LUÔN TRONG CHI TIẾT ---
        // Không decrypt nữa
        return {
            ...storedKey,
            credential: '********************'
        };
    }
}