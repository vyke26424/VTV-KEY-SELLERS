import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

// 1. Định nghĩa cấu trúc của 1 món hàng chi tiết
class OrderItemDto {
  @IsNumber()
  variantId: number;

  @IsNumber()
  quantity: number;

  @IsNumber()
  price: number; // Giá tại thời điểm mua (để sau này giá đổi không ảnh hưởng đơn cũ)
}

// 2. Định nghĩa cấu trúc tổng thể đơn hàng
export class CreateOrderDto {
  @IsString()
  userId: string; // ID của người mua

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[]; // Danh sách các món hàng
  
  @IsNumber()
  totalAmount: number; // Tổng tiền thanh toán
}