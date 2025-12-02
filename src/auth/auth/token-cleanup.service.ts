

import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { Cron, CronExpression } from '@nestjs/schedule';
import e from 'express';

@Injectable()
export class TokenCleanupService {
    private readonly logger = new Logger(TokenCleanupService.name);
    constructor(private readonly prisma : PrismaService){}

    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async handleCron() {
        this.logger.log('Đang tiến hành dọn dẹp các token quá hạn');
        const thirtyDayago = new Date();
        thirtyDayago.setDate(thirtyDayago.getDate() -30);
        try {
            const result = await this.prisma.refreshToken.deleteMany({
                where : {
                    expiresAt : {
                        lt : thirtyDayago
                    }
                }
            });
            if(result.count > 0) {
                this.logger.log(`Đã xóa ${result.count} token hết hạn`);
            }
            else {
                this.logger.log('Không có token quá hạn nào để xóa');
            }
        } catch (error) {
            this.logger.log('Có lỗi, không thể tiến hành dọn dẹp refreshToken hết hạn ', error);
        }
    }
}