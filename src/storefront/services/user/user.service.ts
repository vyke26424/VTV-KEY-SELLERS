import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { UpdateProfileDto } from '../../dto/update-profile.dto';

@Injectable()
export class UserService {
    constructor(private readonly prisma : PrismaService){}

    async getProfile (userId : string) {
        const user = await this.prisma.user.findFirst({
            where : {id : userId},
            select : {
                id : true, email : true, fullName : true, 
                role : true, balance : true, createdAt : true,
            }
        });
        if(!user) throw new NotFoundException('Không tìm thấy user');
        return user;
    }

    async updateProfile(userId: string, data: UpdateProfileDto) {
        return await this.prisma.user.update({
            where: { id: userId },
            data: {
                fullName: data.fullName
            },
            select: {
                id: true,
                fullName: true,
                email: true
            }
        });
    }
}