import 'package:dio/dio.dart';
// import 'package:dio/browser.dart'; // Nếu cần config sâu hơn cho web adapter

final dio = Dio(BaseOptions(
  baseUrl: 'http://localhost:3000',
  contentType: Headers.jsonContentType,
));

void configureDio() {
  // QUAN TRỌNG: Dòng này giúp Dio nhận và gửi Cookie trên Web
  // (Tương đương withCredentials = true trong JS)
  // Lưu ý: Trên mobile dòng này không lỗi nhưng không có tác dụng giống web
  // Trên các bản Dio mới, thường nó tự handle, nhưng nếu gặp lỗi CORS, hãy check lại adapter.
  
  // Update: Với Dio bản mới nhất, cấu hình extra:
   dio.options.extra['withCredentials'] = true; 
}

// Khi gọi API refresh
Future<void> refreshToken() async {
  // Bạn chỉ cần gọi POST rỗng, Cookie tự bay theo request
  await dio.post('/auth/refresh'); 
}

jwtFromRequest: ExtractJwt.fromExtractors([
  // Ưu tiên 1: Tìm trong Cookie (Cho Web)
  (req) => {
    if (req && req.cookies && req.cookies.refreshToken) {
      return req.cookies.refreshToken;
    }
    return null;
  },
  // Ưu tiên 2: Tìm trong Body (Cho Mobile hoặc Postman)
  (req) => {
    if (req && req.body && req.body.refreshToken) {
      return req.body.refreshToken;
    }
    return null;
  },
]),

// main.ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:5000', // Đổi thành URL của Flutter Web đang chạy
    credentials: true, // <--- BẮT BUỘC PHẢI CÓ để nhận Cookie
  });
  
  // ...
}

import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

final storage = FlutterSecureStorage();
final dio = Dio(BaseOptions(baseUrl: 'http://localhost:3000'));

Future<void> handleRefreshToken() async {
  // 1. Lấy token từ storage
  String? refreshToken = await storage.read(key: 'refreshToken');
  
  if (refreshToken == null) {
    // Logout user
    return;
  }

  try {
    // 2. Tự tay gửi token đi (qua Body hoặc Header tùy Backend quy định)
    // Ví dụ gửi qua Header:
    final response = await dio.post(
      '/auth/refresh',
      options: Options(
        headers: {
          'Authorization': 'Bearer $accessToken', // Gửi ở đây
        },
      ),
    );

    // 3. Nhận token mới và lưu lại
    final newAccessToken = response.data['accessToken'];
    final newRefreshToken = response.data['refreshToken']; // Nếu có xoay vòng
    
    await storage.write(key: 'accessToken', value: newAccessToken);
    await storage.write(key: 'refreshToken', value: newRefreshToken);

  } catch (e) {
    // Refresh lỗi -> Bắt đăng nhập lại
  }
}

flutter run -d chrome --web-port 5000
hoặc chạy f5
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Flutter Web (Fixed Port)",
            "request": "launch",
            "type": "dart",
            "args": ["--web-port", "5000"] // <--- Thêm dòng này
        }
    ]
}


//// ngày 7 tháng 12 năm 2025 //// 
Con ghệ thử gọi mấy cái api của dashboard category của admin để thêm category, với có thêm create product. Trong lúc con ghệ tạo sản phẩm thì có thể thêm các sản phẩm con của nó luôn, gửi api sẽ có dạng như này : 
**
{
  "name": "OpenAI Plus ",
  "categoryId": 1,
  "description": "Gói AI giúp bạn 10 giải tích, 10 xác suất thống kê.",
  "thumbnail": "https://example.com/images/netflix-thumb.jpg",
  
  // Slug là tùy chọn. Nếu không gửi, server sẽ tự tạo từ name
  // "slug": "tai-khoan-netflix-custom", 

  "variants": [
    {
      "name": "Gói 1 Tháng",
      "price": 69000,
      "orginalPrice": 90000
    },
    {
      "name": "Gói 1 Năm (Tiết kiệm)",
      "price": 600000,
      "orginalPrice": 1080000
    },
    {
        "name": "Gói gia đình",
        "price": 70000,
        "orginalPrice": 110000
    }
  ],

  // Các trường JSON tùy chọn (nếu có)
  "keywords": ["robot", "trí tuệ nhân tạo", "chatchit"],
  "meta": {
    "generatedBy": "GPT-4", // cái meta này để tượng trưng thôi, nữa viết meta gì ok xíu cho thằng python nó nhờ 
    "seoScore": 95
  }
}**