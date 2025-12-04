

import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from "@prisma/client";





@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    
    constructor(private readonly config : ConfigService){
        super()
    }
    async onModuleDestroy() {
        await this.$disconnect();
    }
    async onModuleInit() {
        await this.$connect();
    }

}