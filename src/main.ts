import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import  cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({
    origin : ['http://localhost:5000', 'http://localhost:5173'], // true
    credentials : true
    
  })
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist : true,// tự động loại bỏ các file, trường không khai báo trong dto
      forbidNonWhitelisted : true , // báo lỗi nếu gửi file lạ lên
      transform : true, // tự động convert kiểu dữ liệu
    })
  )
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
