import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import * as argon2 from "argon2";
import { Role } from '@prisma/client';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
async function create() {
    const app = await NestFactory.createApplicationContext(AppModule);
    const configService = app.get(ConfigService);
    const prismaService = app.get(PrismaService);

    console.log('Đang tiến hành tạo ')
    try {
        const email = configService.getOrThrow<string>('EMAIL_ADMIN');
        const password = configService.getOrThrow<string>('PASSWORD_ADMIN');
        const passwordHashed = await argon2.hash(password);
        const admin = await prismaService.user.upsert({
            where : {email : email},
            update : {}, // nếu tồn tại rồi thì không làm gì hết
            create : {
                email : email,
                password : passwordHashed,
                fullName : 'Nguyễn Lê Tứ',
                role : Role.ADMIN
            }
        });
        console.log(`Đã tạo admin ${admin.email} thành công`);
        } catch (error) {
            console.log(`Tạo admin thất bại`);
            throw error ;
        }finally {
            await app.close()
        }

}

create().catch((error) => {
   // console.log(error);
    process.exit(1);
})//.finally(async() => {
   // await prisma.$disconnect();
//})