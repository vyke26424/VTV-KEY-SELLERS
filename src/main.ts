import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// --- Dùng '* as' để tránh lỗi undefined nếu có tạm thời hong có thì thôi ---
// import * as cookieParser from 'cookie-parser';
import cookieParser from 'cookie-parser'; 

import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // 1. Bảo mật Header (Che thông tin server, chống XSS)
  app.use(helmet());

  // 2. Đọc Cookie từ request (Quan trọng cho Auth)
  app.use(cookieParser());

  // 3. Cấu hình CORS (Cho phép Frontend gọi API và gửi Cookie)
  app.enableCors({
    origin : ['http://localhost:5000', 'http://localhost:5173'], 
    credentials : true
  });

  // 4. Validate dữ liệu đầu vào (DTO)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist : true, // Tự động bỏ các trường thừa không có trong DTO
      forbidNonWhitelisted : true , // Báo lỗi nếu gửi trường lạ lên
      transform : true, // Tự động convert kiểu (vd: string '1' -> number 1)
    })
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();