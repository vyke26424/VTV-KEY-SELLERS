/* FILE: src/modules/interactions/interactions.controller.ts */
import { Body, Controller, Post, Get, UseGuards, Req } from '@nestjs/common';
import { InteractionsService } from '../../services/interactions/interactions.service';
import { InteractionType } from '@prisma/client';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard'; 

@Controller('interactions')
export class InteractionsController {
  constructor(private readonly interactionsService: InteractionsService) {}

  // API để Frontend gọi mỗi khi user xem/thêm giỏ
  @Post('log')
  // @UseGuards(JwtAuthGuard) // Có thể mở hoặc đóng tùy logic (cho phép khách vãng lai không?)
  async logAction(@Body() body: { userId?: string; productId: number; type: InteractionType; duration?: number }) {
    // Nếu chưa login, userId có thể null hoặc lấy từ session guest
    if (!body.userId) return { message: 'Guest interaction ignored (or handle differently)' };
    
    return this.interactionsService.logInteraction(body.userId, body.productId, body.type, body.duration);
  }

  // API lấy danh sách gợi ý
  @Get('trending')
  async getTrending() {
    return this.interactionsService.getTrendingProducts(10);
  }
}