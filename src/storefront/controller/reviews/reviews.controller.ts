import { Controller, Get, Post, Body, Param, UseGuards, ParseIntPipe, Query } from '@nestjs/common';
import { ReviewsService } from '../../services/reviews/reviews.service';
import { CreateReviewDto } from '../../dto/create-review.dto';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { GetUser } from '../../../auth/decorators/get_user.decorator';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get(':productId')
  async getReviews(@Param('productId', ParseIntPipe) productId: number) {
    return this.reviewsService.findByProduct(productId);
  }

  // Viết review (Cần Login)
  @Post()
  @UseGuards(JwtAuthGuard)
  async createReview(
    @GetUser('userId') userId: string,
    @Body() dto: CreateReviewDto
  ) {
    return this.reviewsService.create(userId, dto);
  }

  // API để Frontend check xem user này có được quyền review không?
  // Frontend sẽ gọi cái này: Nếu trả về true -> Hiện form review. Nếu false -> Ẩn.
  @Get('check-eligibility/:productId')
  @UseGuards(JwtAuthGuard)
  async checkEligibility(
    @GetUser('userId') userId: string,
    @Param('productId', ParseIntPipe) productId: number
  ) {
    const isEligible = await this.reviewsService.checkEligibility(userId, productId);
    return { canReview: isEligible };
  }
}