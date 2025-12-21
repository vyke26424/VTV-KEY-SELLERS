import { Controller, Post, Body, Get, UseGuards, Req } from '@nestjs/common';
import { OrdersService } from '../../services/orders/orders.service';
import { CreateOrderDto } from '../../dto/create-order.dto';
import { AuthGuard } from '@nestjs/passport'; // Guard chặn người chưa đăng nhập
import { Request } from 'express'; // Interface Request

// Định nghĩa lại Request để TS hiểu có biến user bên trong (Optional)
interface RequestWithUser extends Request {
  user: { userId: string; role: string };
}

@Controller('orders')
// @UseGuards(AuthGuard('jwt')) // Mẹo: Bạn có thể đặt Guard ở đây để bảo vệ TOÀN BỘ file này
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // --- 1. TẠO ĐƠN HÀNG ---
  @Post()
  @UseGuards(AuthGuard('jwt')) // Bắt buộc đăng nhập mới được mua
  create(@Body() createOrderDto: CreateOrderDto, @Req() req: RequestWithUser) {
    // BẢO MẬT: Lấy userId từ Token gán đè vào DTO
    // Tránh việc User A gửi request nhưng điền userId của User B
    createOrderDto.userId = req.user.userId;
    
    return this.ordersService.create(createOrderDto);
  }

  // --- 2. LẤY LỊCH SỬ ĐƠN HÀNG (CỦA CHÍNH MÌNH) ---
  // Đổi đường dẫn từ 'user/:userId' thành 'my-orders'
  @Get('my-orders')
  @UseGuards(AuthGuard('jwt'))
  findMyOrders(@Req() req: RequestWithUser) {
    // Controller tự móc túi (Token) ra xem ID là gì, rồi gọi Service
    const userId = req.user.userId;
    return this.ordersService.findByUser(userId);
  }
}