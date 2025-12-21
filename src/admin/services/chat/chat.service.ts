import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from "@nestjs/axios";
import { PrismaService } from '../../../prisma/prisma.service';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class ChatService {
    constructor(
        private prisma : PrismaService,
        private httpService : HttpService
    ) {}

    async createSession () {
        const session = await this.prisma.chatSession.create({
            data : {
                title : `Hội thoại ${new Date().toLocaleString('vi-VN')}`
            }
        });
        return {
            sessionId : session.id
        }
    }

    async getHistory (sessionId : number) {
        const session = await this.prisma.chatSession.findUnique({where : {id : sessionId} });
        if(!session) {
            throw new HttpException('Session không tồn tại', HttpStatus.NOT_FOUND)
        }

        return this.prisma.chatMessage.findMany({
            where : {sessionId},
            orderBy : {createdAt : 'asc'}
        });
    }

    async sendMessage( sessionId : number, userContent : string) {
        const previousMessage = await this.prisma.chatMessage.findMany({
            where : {sessionId},
            take : 5,
            orderBy : {createdAt : 'desc'},
            select : {role : true, content : true}
        });

        const historyForAI = previousMessage.reverse();

        await this.prisma.chatMessage.create({
            data : {sessionId,
                role : "user",
                content : userContent
            }
        });

        let bot_intent ;
        let botAnswer = "Xin lỗi, hiện vituvu đang bảo trì một chút";
        let recommendedProducts : any[] = [];
        try {
            const pythonUrl = 'http://localhost:8000/api/v1/ask';
            const response = await lastValueFrom(
                this.httpService.post(pythonUrl, {
                    question : userContent,
                    history : historyForAI
                })
            )

            const data = response.data ;

            bot_intent = data.intent ;
            botAnswer = data.answer ;

            const productIds = data.product_ids || [] ;

            if(Array.isArray(productIds) && productIds.length > 0) {
                recommendedProducts = await this.prisma.product.findMany({
                    where : {
                        id : {in : productIds},
                        isDeleted : false,
                        isActive : true
                    },
                    select : {
                        id : true,
                        name : true,
                        slug : true,
                        thumbnail : true,
                        variants : {
                            take : 1,
                            select : {
                                price : true
                            }
                        }
                    }
                })
            }
            
        } 
        catch (error) {
            console.log("Lỗi gọi python", error.response?.data || error.message);
        }

        const botMessage = await this.prisma.chatMessage.create({
            data : {sessionId,
                role : 'model',
                content : botAnswer
            }
        });

        return {
            intent : bot_intent,
            message : botMessage,
            products : recommendedProducts
        }
    }
}
