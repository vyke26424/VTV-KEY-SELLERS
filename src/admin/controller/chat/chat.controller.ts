import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { ChatService } from '../../services/chat/chat.service';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard'; 

@Controller('chat')


export class ChatController {
    constructor(private readonly chatService : ChatService) {}

    // Tạo session mới (khi người dùng bấm reload hoặc lần đầu mở app)
    @Post('session')
    async startSession() {
        return this.chatService.createSession()
    }

    @Get('history/:id')
    async getHistory(
        @Param('id', ParseIntPipe) sessionId : number
    ) {
        return this.chatService.getHistory(sessionId);
    }

    @Post('send')
    async sendMessage(
        @Body() body : {
            sessionId : number,
            content : string
        }
    ){
        return this.chatService.sendMessage(body.sessionId, body.content);
    }
}
