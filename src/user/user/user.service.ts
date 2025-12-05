import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { NotFoundError } from 'rxjs';

@Injectable()
export class UserService {
    constructor(private readonly prisma : PrismaService){}
    async getProfile (userId : string) {
        const user = await this.prisma.user.findFirst({
            where : {id : userId},
            select : {
                id : true,
                email : true,
                fullName : true,
                role : true,
                balance : true,
                createdAt : true,
            }
        });
        if(!user) {
            throw new NotFoundException('Không tìm thấy thông tin người dùng');
        }
        return user;
    }
}
