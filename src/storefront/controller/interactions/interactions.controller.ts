import { Body, Controller, Post, Get, Req, UseGuards } from '@nestjs/common';
import { InteractionsService } from '../../services/interactions/interactions.service';
import { InteractionType } from '@prisma/client';
// import { JwtAuthGuard } from ...

@Controller('interactions')
export class InteractionsController {
  constructor(private readonly interactionsService: InteractionsService) {}

  @Post('log')
  // @UseGuards(JwtAuthGuard) // Mở nếu muốn bắt buộc login
  async logAction(@Body() body: { userId: string; productId: number; type: InteractionType }) {
    return this.interactionsService.logInteraction(body.userId, body.productId, body.type);
  }

  @Get('recommend')
  async getRecommend(@Req() req) {
    // Lấy userId từ token hoặc query param
    const userId = req.query.userId as string; 
    return this.interactionsService.getRecommendations(userId);
  }
}