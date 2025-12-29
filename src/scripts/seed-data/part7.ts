// prisma/seed-data/part7.ts

export const productsPart7 = [
  // ================= CATEGORY: SECURITY (DIỆT VIRUS & BẢO MẬT) =================
  {
    name: 'Kaspersky Total Security', 
    slug: 'kaspersky-ts', 
    categorySlug: 'security',
    description: 'Kaspersky Total Security là giải pháp bảo mật cao cấp và toàn diện nhất từ Kaspersky Lab, được thiết kế để bảo vệ tối đa máy tính và dữ liệu cá nhân của bạn trước mọi mối đe dọa kỹ thuật số hiện đại. Phần mềm tích hợp công nghệ diệt virus thời gian thực thế hệ mới, lá chắn chống Ransomware mạnh mẽ giúp ngăn chặn hành vi mã hóa dữ liệu trái phép. Đặc biệt, chương trình còn cung cấp trình duyệt an toàn cho các giao dịch ngân hàng trực tuyến, tính năng chống theo dõi webcam và quản lý quyền riêng tư của trẻ em, giúp gia đình bạn luôn an tâm khi tham gia môi trường Internet đầy rủi ro.',
    thumbnail: 'https://res.cloudinary.com/diap7lvcv/image/upload/v1766674118/kaspety_p5iu1x.jpg',
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
    description: 'Bitdefender Total Security là phần mềm bảo mật đa thiết bị hàng đầu, tương thích hoàn hảo với Windows, macOS, Android và iOS mà vẫn duy trì hiệu suất hệ thống cực nhẹ. Nhờ ứng dụng trí tuệ nhân tạo (AI) và mạng lưới bảo mật đám mây khổng lồ, Bitdefender có khả năng phát hiện và tiêu diệt sớm các loại mã độc mới "Zero-day" ngay khi chúng vừa xuất hiện. Phần mềm còn tích hợp sẵn công cụ tối ưu hóa hệ thống một chạm, tường lửa hai chiều mạnh mẽ và các tính năng bảo vệ quyền riêng tư cá nhân khi bạn truy cập các mạng Wi-Fi công cộng không an toàn.',
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
    description: 'Malwarebytes Premium được coi là lớp bảo vệ tăng cường chuyên trị các loại phần mềm độc hại, mã độc quảng cáo và Trojan lỳ lợm mà các phần mềm diệt virus truyền thống thường bỏ sót. Với công nghệ phát hiện dựa trên hành vi, Malwarebytes chủ động ngăn chặn các cuộc tấn công mã độc tống tiền (Ransomware) trước khi chúng kịp tấn công vào dữ liệu của bạn. Phần mềm hoạt động cực kỳ nhẹ nhàng, không gây xung đột hệ thống, cho phép bạn quét và làm sạch máy tính bị nhiễm một cách triệt để, mang lại một môi trường làm việc sạch sẽ và an toàn tuyệt đối.',
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
    description: 'Norton 360 Deluxe mang đến giải pháp bảo vệ đa lớp hiện đại, kết hợp giữa khả năng diệt virus mạnh mẽ và các công cụ bảo mật trực tuyến thiết yếu. Gói sản phẩm tích hợp sẵn dịch vụ Secure VPN giúp bạn duyệt web ẩn danh và an toàn, cùng 50GB lưu trữ đám mây để sao lưu tự động các tệp tin quan trọng nhất. Norton mang lại sự an tâm tuyệt đối với trình quản lý mật khẩu thông minh và tính năng SafeCam độc quyền – công cụ sẽ thông báo ngay lập tức nếu có ứng dụng lạ cố gắng truy cập webcam của bạn trái phép, giúp bảo vệ tối đa danh tính và sự riêng tư trong thế giới số.',
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
    description: 'AdGuard License Premium là công cụ chặn quảng cáo và bảo vệ quyền riêng tư toàn diện nhất hiện nay, hoạt động trên mọi trình duyệt và ứng dụng. Không chỉ đơn thuần là xóa bỏ các banner gây nhiễu, AdGuard còn lọc sạch các quảng cáo video gây khó chịu trên YouTube, Facebook và ngăn chặn các trình theo dõi ẩn đang cố gắng thu thập dữ liệu cá nhân của bạn. Việc sử dụng AdGuard không chỉ giúp tăng tốc độ tải trang web đáng kể, tiết kiệm băng thông di động mà còn là lá chắn hữu hiệu giúp bảo vệ gia đình bạn khỏi các trang web lừa đảo và nội dung độc hại trên Internet.',
    thumbnail: 'https://res.cloudinary.com/diap7lvcv/image/upload/v1766674117/Adguard-Premium_ommqzv.jpg',
    isHot: true, 
    avgRating: 4.9, 
    keywordNames: ["security,dietvirus,adguard"],
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
    description: 'ESET NOD32 Antivirus từ lâu đã khẳng định vị thế là phần mềm diệt virus nhẹ nhất thế giới, là lựa chọn ưu tiên hàng đầu của các game thủ chuyên nghiệp và người dùng máy tính cần hiệu năng cao. Nhờ thuật toán quét thông minh chiếm cực ít tài nguyên CPU và RAM, phần mềm cung cấp khả năng bảo vệ tối ưu mà không làm gián đoạn trải nghiệm chơi game hay đồ họa nặng. ESET sở hữu công nghệ bảo vệ đa lớp dựa trên điện toán đám mây, giúp phát hiện và ngăn chặn mã độc, ransomware và các cuộc tấn công phishing với tốc độ cực nhanh và độ chính xác tuyệt đối.',
    thumbnail: 'https://res.cloudinary.com/diap7lvcv/image/upload/v1767001444/eset_jpfpvx.jpg',
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
    description: 'BKAV Pro Internet Security là niềm tự hào của phần mềm diệt virus Việt Nam, tiên phong trong việc ứng dụng công nghệ điện toán đám mây và trí tuệ nhân tạo để bảo vệ người dùng nội địa. Phần mềm cung cấp khả năng phòng vệ đa tầng, giúp ngăn chặn hiệu quả các loại virus lây lan qua USB, tệp tin đính kèm email và các trang web độc hại. Điểm vượt trội của BKAV Pro chính là dịch vụ hỗ trợ kỹ thuật trực tiếp từ các chuyên gia bảo mật hàng đầu tại Việt Nam, sẵn sàng giúp bạn xử lý mọi sự cố mã độc phức tạp một cách nhanh chóng và tận tâm nhất.',
    thumbnail: 'https://res.cloudinary.com/diap7lvcv/image/upload/v1767001446/bkav_bm7ksh.jpg',
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