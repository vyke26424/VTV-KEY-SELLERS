// prisma/seed-data/part7.ts

export const productsPart7 = [
  // ================= CATEGORY: SECURITY (DIỆT VIRUS & BẢO MẬT) =================
  {
    name: 'Kaspersky Total Security', 
    slug: 'kaspersky-ts', 
    categorySlug: 'security',
    description: 'Giải pháp bảo mật cao cấp nhất từ Kaspersky giúp bảo vệ toàn diện máy tính của bạn trước mọi mối đe dọa. Phần mềm tích hợp các tính năng diệt virus thời gian thực, bảo vệ giao dịch ngân hàng trực tuyến, chống theo dõi webcam và đặc biệt là lá chắn chống Ransomware mạnh mẽ giúp dữ liệu của bạn luôn an toàn.',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Kaspersky_logo.svg/1200px-Kaspersky_logo.svg.png',
    isHot: true, 
    avgRating: 4.9, 
    keywordNames: ["kaspersky", "dietvirus", "security"],
    aiMetadata: {
      keywords: ["diệt virus", "bảo mật", "chống hacker"],
      features: ["Chống Ransomware", "Bảo vệ thanh toán Online", "Nhẹ máy"],
      suitable_for: ["Máy tính cá nhân", "Kế toán", "Văn phòng"]
    },
    variants: [{ name: '1 Năm / 1 Thiết bị', price: 160000, orginalPrice: 300000 }]
  },
  {
    name: 'Bitdefender Total Security', 
    slug: 'bitdefender-ts-premium', 
    categorySlug: 'security',
    description: 'Phần mềm bảo vệ đa thiết bị (Windows, macOS, Android, iOS) với hiệu năng cực nhẹ. Bitdefender sử dụng trí tuệ nhân tạo để phát hiện sớm các mã độc chưa từng xuất hiện, ngăn chặn các cuộc tấn công lừa đảo và bảo vệ quyền riêng tư cá nhân khi bạn truy cập Internet tại những nơi công cộng.',
    thumbnail: 'https://res.cloudinary.com/diap7lvcv/image/upload/v1766675822/bitfender_jczrzw.png',
    isHot: false, 
    avgRating: 4.8, 
    keywordNames: ["bitdefender", "dietvirus", "security"],
    aiMetadata: {
      keywords: ["diệt virus nhẹ máy", "bảo mật toàn diện", "chống hacker"],
      features: ["Bảo vệ đa thiết bị (Win/Mac/Mobile)", "Chống theo dõi webcam", "Tối ưu hóa một chạm"],
      suitable_for: ["Gia đình", "Doanh nghiệp", "Người dùng ngân hàng số"]
    },
    variants: [{ name: '1 Năm / 5 Thiết bị', price: 250000, orginalPrice: 800000 }]
  },
  {
    name: 'Malwarebytes Premium', 
    slug: 'malwarebytes-key', 
    categorySlug: 'security',
    description: 'Lớp bảo vệ tăng cường chuyên trị các loại mã độc "lỳ lợm" mà phần mềm diệt virus thông thường có thể bỏ sót. Malwarebytes Premium giúp ngăn chặn mã độc tống tiền, lọc các trang web lừa đảo và làm sạch hệ thống bị nhiễm virus một cách triệt để mà không gây xung đột với các phần mềm bảo mật khác.',
    thumbnail: 'https://res.cloudinary.com/diap7lvcv/image/upload/v1766675184/maleware_tqcex3.png',
    isHot: false, 
    avgRating: 4.7, 
    keywordNames: ["malwarebytes", "dietvirus"],
    aiMetadata: {
      keywords: ["diệt malware", "bảo mật máy tính", "chống ransomware"],
      features: ["Quét mã độc chuyên sâu", "Bảo vệ thời gian thực", "Chặn web độc hại"],
      suitable_for: ["Người dùng cá nhân", "Văn phòng cần bảo mật"]
    },
    variants: [{ name: 'Key Vĩnh Viễn', price: 150000, orginalPrice: 1000000 }]
  },
  {
    name: 'Norton 360 Deluxe', 
    slug: 'norton-360-deluxe', 
    categorySlug: 'security',
    description: 'Giải pháp bảo mật đa lớp tích hợp sẵn dịch vụ VPN bảo mật và 50GB lưu trữ đám mây để sao lưu các tệp tin quan trọng. Norton 360 mang lại sự an tâm tuyệt đối với trình quản lý mật khẩu an toàn và tính năng SafeCam thông báo cho bạn ngay lập tức nếu có ai đó cố gắng truy cập webcam của bạn.',
    thumbnail: 'https://res.cloudinary.com/diap7lvcv/image/upload/v1766676217/norton_zygrc1.jpg',
    isHot: false, 
    avgRating: 4.8, 
    keywordNames: ["norton", "security"],
    aiMetadata: {
      keywords: ["diệt virus norton", "bảo mật webcam", "sao lưu dữ liệu", "vpn tích hợp"],
      features: ["Bảo vệ tối đa 3 thiết bị", "50GB Cloud Backup", "Trình quản lý mật khẩu an toàn"],
      suitable_for: ["Người dùng có nhiều thiết bị", "Gia đình cần bảo mật cao"]
    },
    variants: [{ name: '1 Năm / 3 Thiết bị', price: 290000, orginalPrice: 1200000 }]
  },
  {
    name: 'AdGuard License (Vĩnh Viễn)', 
    slug: 'adguard-lifetime-pro', 
    categorySlug: 'security',
    description: 'Công cụ chặn quảng cáo và bảo vệ quyền riêng tư mạnh mẽ nhất hiện nay. AdGuard giúp bạn loại bỏ hoàn toàn các banner khó chịu, quảng cáo video trên YouTube và các trình theo dõi ẩn trên website. Sử dụng AdGuard không chỉ giúp trang web tải nhanh hơn mà còn bảo vệ bạn khỏi các trang web độc hại và lừa đảo.',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/AdGuard_Logo.png/1200px-AdGuard_Logo.png',
    isHot: true, 
    avgRating: 4.9, 
    keywordNames: ["security"],
    aiMetadata: {
      keywords: ["chặn quảng cáo", "lọc web", "quyền riêng tư"],
      features: ["Chặn quảng cáo Youtube/Web", "Chặn theo dõi", "Tiết kiệm data"],
      suitable_for: ["Mọi người dùng Internet"]
    },
    variants: [{ name: 'Vĩnh Viễn / 1 PC', price: 250000, orginalPrice: 800000 }]
  },
  {
    name: 'ESET NOD32 Antivirus', 
    slug: 'eset-nod32-key', 
    categorySlug: 'security',
    description: 'Được mệnh danh là phần mềm diệt virus nhẹ nhất thế giới, ESET NOD32 là lựa chọn hàng đầu cho các game thủ. Phần mềm cung cấp khả năng bảo vệ tối ưu mà không gây ảnh hưởng đến hiệu suất chơi game hay làm việc nặng, đồng thời sở hữu công nghệ quét tiên tiến giúp phát hiện mã độc cực nhanh.',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/ESET_logo.svg/2560px-ESET_logo.svg.png',
    isHot: false, 
    avgRating: 4.8, 
    keywordNames: ["eset", "dietvirus"],
    aiMetadata: {
      keywords: ["diệt virus nhẹ", "eset bản quyền", "game mode"],
      features: ["Chiếm cực ít tài nguyên", "Chế độ dành cho game thủ", "Quét mã độc tốc độ cao"],
      suitable_for: ["Game thủ", "Máy tính cấu hình yếu"]
    },
    variants: [{ name: 'Key 1 Năm', price: 140000, orginalPrice: 400000 }]
  },
  {
    name: 'BKAV Pro Internet Security', 
    slug: 'bkav-pro-key', 
    categorySlug: 'security',
    description: 'Phần mềm diệt virus hàng đầu Việt Nam với công nghệ điện toán đám mây. BKAV Pro giúp bảo vệ máy tính của bạn trước các loại virus lây lan qua USB, email và các trang web độc hại. Sản phẩm được hỗ trợ kỹ thuật trực tiếp từ các chuyên gia bảo mật tại Việt Nam, giúp giải quyết các sự cố mã độc một cách nhanh chóng.',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/vi/e/e8/Logo_Bkav.png',
    isHot: false, 
    avgRating: 4.5, 
    keywordNames: ["bkav", "dietvirus"],
    aiMetadata: {
      keywords: ["diệt virus việt nam", "bkav pro", "bảo vệ usb"],
      features: ["Hỗ trợ kỹ thuật tại Việt Nam", "Công nghệ điện toán đám mây", "Diệt virus siêu đa tầng"],
      suitable_for: ["Người dùng cá nhân Việt Nam", "Văn phòng"]
    },
    variants: [{ name: 'Thẻ 1 Năm', price: 220000, orginalPrice: 299000 }]
  }
];