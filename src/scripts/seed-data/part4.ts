// prisma/seed-data/part4.ts

export const productsPart4 = [
  // ================= CATEGORY: AI =================
  {
    name: 'Claude 3.5 Sonnet (Pro)', slug: 'claude-3-5-sonnet', categorySlug: 'ai',
    description: 'Trải nghiệm trí tuệ nhân tạo thế hệ mới từ Anthropic với mô hình Claude 3.5 Sonnet đỉnh cao. Đây là giải pháp AI vượt trội trong việc hiểu ngữ cảnh phức tạp, khả năng lập trình (coding) chính xác và phong cách viết lách tự nhiên như người thật. Khi nâng cấp gói Pro, người dùng sẽ có giới hạn tin nhắn cao gấp 5 lần, quyền truy cập ưu tiên trong giờ cao điểm và trải nghiệm tính năng Artifacts giúp xem trước kết quả code, website trực quan ngay trong khung chat.',
    thumbnail: 'https://res.cloudinary.com/diap7lvcv/image/upload/v1766675181/What-is-Claude-Sonnet-3.5-1747766292_wgzosm.png',
    isHot: true, avgRating: 4.9, keywordNames: ["claude", "ai", "bot"],
    aiMetadata: {
      keywords: ["claude pro", "anthropic", "lập trình ai", "viết lách"],
      features: ["Mô hình Claude 3.5 Sonnet", "Truy cập ưu tiên", "Tính năng Artifacts", "Giới hạn tin nhắn lớn"],
      suitable_for: ["Lập trình viên", "Writer", "Nhà nghiên cứu"]
    },
    variants: [{ name: '1 Tháng (Chính chủ)', price: 480000, orginalPrice: 550000 }]
  },
  {
    name: 'Perplexity Pro', slug: 'perplexity-pro', categorySlug: 'ai',
    description: 'Công cụ tìm kiếm thông minh dựa trên AI giúp thay thế hoàn toàn cách tra cứu truyền thống. Perplexity Pro không chỉ đưa ra câu trả lời mà còn dẫn nguồn trích dẫn minh bạch từ các bài báo, nghiên cứu khoa học uy tín. Người dùng có thể lựa chọn giữa các mô hình mạnh mẽ như GPT-4o hoặc Claude 3 Opus để xử lý câu hỏi, đồng thời hỗ trợ tải lên các tệp tài liệu không giới hạn để phân tích dữ liệu chuyên sâu và trực quan hóa thông tin.',
    thumbnail: 'https://res.cloudinary.com/diap7lvcv/image/upload/v1766675179/Perplexity-Pro-Annual-Offer-2014106965_h2wcxb.webp',
    isHot: true, avgRating: 4.9, keywordNames: ["perplexity", "ai", "google"],
    aiMetadata: {
      keywords: ["tìm kiếm ai", "tra cứu thông tin", "phân tích dữ liệu"],
      features: ["Tùy chọn GPT-4o/Claude 3", "Dẫn nguồn chính xác", "Upload file không giới hạn"],
      suitable_for: ["Sinh viên", "Nhà báo", "Người nghiên cứu thị trường"]
    },
    variants: [{ name: '1 Năm', price: 990000, orginalPrice: 2400000 }]
  },

  // ================= CATEGORY: EDUCATION & VPN =================
  {
    name: 'ELSA Speak Pro (Vĩnh Viễn)', slug: 'elsa-pro-lifetime', categorySlug: 'education',
    description: 'Giải pháp luyện phát âm tiếng Anh toàn diện nhất thế giới sử dụng công nghệ nhận diện giọng nói bằng trí tuệ nhân tạo độc quyền. ELSA giúp bạn phát hiện lỗi sai đến từng âm tiết, từ trọng âm, ngữ điệu cho đến độ lưu loát khi giao tiếp. Với gói trọn đời, bạn sẽ được tiếp cận với hơn 7.000 bài học đa dạng chủ đề, lộ trình học cá nhân hóa được cập nhật liên tục, giúp bạn tự tin nói tiếng Anh như người bản xứ chỉ sau một thời gian ngắn luyện tập.',
    thumbnail: 'https://res.cloudinary.com/diap7lvcv/image/upload/v1766675163/img-elsapro-lifetime-4096741723_mk9fee.jpg',
    isHot: true, avgRating: 4.8, keywordNames: ["elsa", "study"],
    aiMetadata: {
      keywords: ["học tiếng anh", "phát âm chuẩn", "giao tiếp ai"],
      features: ["Công nghệ nhận diện giọng nói AI", "Phân tích lỗi sai chi tiết", "Học trọn đời không giới hạn"],
      suitable_for: ["Người mất gốc tiếng Anh", "Người chuẩn bị thi IELTS", "Người đi làm"]
    },
    variants: [{ name: 'Tài khoản Trọn Đời', price: 890000, orginalPrice: 2500000 }]
  },

  // ================= CATEGORY: ENTERTAINMENT =================
  {
    name: 'Disney+ (Disney Plus)', slug: 'disney-plus-premium', categorySlug: 'entertainment',
    description: 'Thế giới giải trí không giới hạn từ Disney, Pixar, Marvel, Star Wars và National Geographic. Disney+ Premium mang đến trải nghiệm xem phim chất lượng 4K UHD cùng âm thanh vòm sống động ngay tại nhà. Bạn có thể theo dõi những bộ phim bom tấn mới nhất của Marvel hay các series độc quyền như The Mandalorian với tính năng tải xuống xem ngoại tuyến và hỗ trợ xem đồng thời trên nhiều thiết bị mà không bị làm phiền bởi quảng cáo.',
    thumbnail: 'https://res.cloudinary.com/diap7lvcv/image/upload/v1766675190/disney-1-1965833994_r90sfr.jpg',
    isHot: false, avgRating: 4.7, keywordNames: ["disney", "phim", "4k"],
    aiMetadata: {
      keywords: ["xem phim marvel", "disney plus", "phim hoạt hình"],
      features: ["Chất lượng 4K IMAX", "Không quảng cáo", "Tải phim offline"],
      suitable_for: ["Trẻ em", "Fan Marvel/Star Wars", "Gia đình"]
    },
    variants: [{ name: '1 Năm', price: 350000, orginalPrice: 1500000 }]
  },

  // ================= CATEGORY: SOFTWARE =================
  {
    name: 'JetBrains All Products Pack', slug: 'jetbrains-all-apps', categorySlug: 'software',
    description: 'Bộ công cụ quyền năng nhất dành cho các nhà phát triển phần mềm chuyên nghiệp. Gói All Products bao gồm hơn 15 công cụ lập trình hàng đầu như IntelliJ IDEA cho Java, PyCharm cho Python, WebStorm cho JavaScript và nhiều IDE khác. Đây là sự lựa chọn tối ưu để tăng năng suất code nhờ khả năng gợi ý thông minh, kiểm tra lỗi thời gian thực và tích hợp sẵn các công cụ quản lý dự án, giúp quy trình phát triển phần mềm trở nên trơn tru và hiệu quả hơn.',
    thumbnail: 'https://res.cloudinary.com/diap7lvcv/image/upload/v1766675187/jet_cdaphk.jpg',
    isHot: false, avgRating: 4.9, keywordNames: ["jetbrains", "software"],
    aiMetadata: {
      keywords: ["công cụ lập trình", "intellij", "pycharm", "webstorm"],
      features: ["Full bộ 15+ IDE", "Gợi ý code thông minh", "Update phiên bản mới nhất"],
      suitable_for: ["Lập trình viên chuyên nghiệp", "Công ty công nghệ", "Sinh viên IT"]
    },
    variants: [{ name: '1 Năm (Cá nhân)', price: 950000, orginalPrice: 6000000 }]
  },

  // ================= CATEGORY: SECURITY =================
  {
    name: 'Malwarebytes Premium', slug: 'malwarebytes-key', categorySlug: 'security',
    description: 'Lớp bảo vệ tăng cường giúp tiêu diệt các loại mã độc, ransomware và phần mềm độc hại mà các ứng dụng diệt virus truyền thống thường bỏ sót. Malwarebytes Premium sử dụng trí tuệ nhân tạo để ngăn chặn các cuộc tấn công lừa đảo trực tuyến, bảo vệ danh tính cá nhân và quét sạch các tệp tin nguy hiểm trong thời gian thực. Phần mềm hoạt động cực kỳ nhẹ nhàng, không gây chậm máy, là lựa chọn tin cậy để bảo vệ dữ liệu quan trọng của bạn[cite: 74].',
    thumbnail: 'https://res.cloudinary.com/diap7lvcv/image/upload/v1766675184/maleware_tqcex3.png',
    isHot: false, avgRating: 4.7, keywordNames: ["malwarebytes", "dietvirus"],
    aiMetadata: {
      keywords: ["diệt malware", "bảo mật máy tính", "chống ransomware"],
      features: ["Quét mã độc chuyên sâu", "Bảo vệ thời gian thực", "Chặn web độc hại"],
      suitable_for: ["Người dùng cá nhân", "Văn phòng cần bảo mật"]
    },
    variants: [{ name: 'Key Vĩnh Viễn', price: 150000, orginalPrice: 1000000 }]
  }
];