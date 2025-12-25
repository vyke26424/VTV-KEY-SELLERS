// prisma/seed-data/part5.ts

export const productsPart5 = [
  // ================= CATEGORY: AI =================
  {
    name: 'GitHub Copilot', slug: 'github-copilot-dev', categorySlug: 'ai',
    description: 'Trợ lý lập trình AI hàng đầu thế giới được phát triển bởi GitHub và OpenAI. Công cụ này hoạt động như một người bạn đồng hành trong quá trình viết mã, tự động gợi ý các dòng code, hàm và toàn bộ logic dựa trên ngữ cảnh mà bạn đang thực hiện. Copilot hỗ trợ hầu hết các ngôn ngữ lập trình phổ biến và tích hợp mượt mà vào các trình soạn thảo như VS Code, giúp lập trình viên giảm bớt thời gian cho các tác vụ lặp lại và tập trung vào việc giải quyết các bài toán phức tạp hơn.',
    thumbnail: 'https://res.cloudinary.com/diap7lvcv/image/upload/v1766675831/aicandy_cong_cu_ai_GitHubCopilot_jmrfdl.webp',
    isHot: false, avgRating: 4.9, keywordNames: ["copilot", "ai"],
    aiMetadata: {
      keywords: ["lập trình ai", "tự động viết code", "dev tools", "github ai"],
      features: ["Gợi ý code thời gian thực", "Hỗ trợ đa ngôn ngữ lập trình", "Tích hợp VS Code, JetBrains"],
      suitable_for: ["Lập trình viên", "Sinh viên IT", "Kỹ sư phần mềm"]
    },
    variants: [{ name: 'Gói 1 Năm', price: 450000, orginalPrice: 2400000 }]
  },
  {
    name: 'Quillbot Premium', slug: 'quillbot-premium-pro', categorySlug: 'ai',
    description: 'Công cụ viết lách và diễn đạt lại văn bản hàng đầu dành cho người học tập và làm việc trong môi trường quốc tế. Với phiên bản Premium, bạn sẽ không còn giới hạn về số lượng từ khi Paraphrase, đồng thời mở khóa các chế độ viết nâng cao như Academic, Creative và Formal. Quillbot còn tích hợp sẵn trình kiểm tra lỗi ngữ pháp, kiểm tra đạo văn chuyên sâu và tính năng tóm tắt văn bản, giúp bạn hoàn thiện các bài luận hoặc email chuyên nghiệp chỉ trong tích tắc.',
    thumbnail: 'https://res.cloudinary.com/diap7lvcv/image/upload/v1766675830/quill_ejotkb.png',
    isHot: false, avgRating: 4.8, keywordNames: ["quillbot", "ai"],
    aiMetadata: {
      keywords: ["sửa lỗi tiếng anh", "diễn đạt lại văn bản", "check đạo văn"],
      features: ["Nhiều chế độ Paraphrase nâng cao", "Trình kiểm tra đạo văn chuyên nghiệp", "Không giới hạn số từ"],
      suitable_for: ["Du học sinh", "Biên dịch viên", "Người viết blog"]
    },
    variants: [{ name: '1 Năm', price: 250000, orginalPrice: 900000 }]
  },

  // ================= CATEGORY: EDUCATION & VPN =================
  {
    name: 'Coursera Plus', slug: 'coursera-plus-unlimited', categorySlug: 'education',
    description: 'Cánh cửa mở ra kho tàng tri thức từ các trường đại học và tổ chức giáo dục hàng đầu thế giới. Gói Coursera Plus cho phép bạn truy cập không giới hạn vào hơn 7.000 khóa học, các chương trình chuyên môn và chứng chỉ nghề nghiệp từ Google, IBM, Stanford. Bạn có thể tự do học tập theo tốc độ cá nhân, nhận được số lượng chứng chỉ không giới hạn để làm đẹp hồ sơ LinkedIn và CV, từ đó mở ra nhiều cơ hội thăng tiến trong sự nghiệp toàn cầu.',
    thumbnail: 'https://res.cloudinary.com/diap7lvcv/image/upload/v1766675823/Coursera-Plus-min-280x280_uutyer.png',
    isHot: false, avgRating: 4.8, keywordNames: ["coursera", "study"],
    aiMetadata: {
      keywords: ["học trực tuyến", "chứng chỉ quốc tế", "đào tạo từ xa"],
      features: ["Truy cập hơn 7000 khóa học", "Chứng chỉ không giới hạn", "Học từ các chuyên gia hàng đầu"],
      suitable_for: ["Người đi làm", "Sinh viên", "Người tự học chuyên sâu"]
    },
    variants: [{ name: '1 Năm', price: 1900000, orginalPrice: 9000000 }]
  },

  // ================= CATEGORY: DESIGN =================
  {
    name: 'CapCut Pro (Toàn diện)', slug: 'capcut-pro-full', categorySlug: 'design',
    description: 'Nâng tầm video của bạn lên tiêu chuẩn chuyên nghiệp với phiên bản CapCut Pro. Bạn sẽ được sử dụng toàn bộ kho hiệu ứng VIP, các bộ lọc màu điện ảnh và công cụ chỉnh sửa AI thông minh nhất như tự động xóa vật thể hay làm nét video. Phiên bản này giúp loại bỏ hoàn toàn các hạn chế về watermark, quảng cáo và cung cấp dung lượng lưu trữ đám mây lớn, giúp bạn dễ dàng biên tập video trên cả điện thoại lẫn máy tính một cách linh hoạt.',
    thumbnail: 'https://res.cloudinary.com/diap7lvcv/image/upload/v1766675822/capcut_mfyyni.png',
    isHot: true, avgRating: 4.9, keywordNames: ["capcut", "edit", "design"],
    aiMetadata: {
      keywords: ["dựng video tiktok", "edit video chuyên nghiệp", "hiệu ứng vip"],
      features: ["Mở khóa tính năng AI nâng cao", "Xóa logo CapCut", "Đồng bộ đa nền tảng"],
      suitable_for: ["Content Creator", "YouTuber", "Editor"]
    },
    variants: [{ name: '1 Năm', price: 350000, orginalPrice: 900000 }]
  },

  // ================= CATEGORY: SECURITY =================
  {
    name: 'Bitdefender Total Security', slug: 'bitdefender-ts-premium', categorySlug: 'security',
    description: 'Phần mềm bảo vệ toàn diện máy tính và các thiết bị di động khỏi mọi mối đe dọa mạng. Bitdefender nổi tiếng với khả năng tiêu diệt virus, mã độc và trojan mà không gây nặng máy nhờ công nghệ quét đám mây tiên tiến. Gói Total Security bao gồm các tính năng bảo vệ đa lớp chống Ransomware, tường lửa mạnh mẽ, bảo vệ thanh toán trực tuyến và tính năng tối ưu hóa hệ thống giúp thiết bị của bạn luôn hoạt động ở trạng thái nhanh nhất và an toàn nhất.',
    thumbnail: 'https://res.cloudinary.com/diap7lvcv/image/upload/v1766675822/bitfender_jczrzw.png',
    isHot: false, avgRating: 4.8, keywordNames: ["bitdefender", "dietvirus", "security"],
    aiMetadata: {
      keywords: ["diệt virus nhẹ máy", "bảo mật toàn diện", "chống hacker"],
      features: ["Bảo vệ đa thiết bị (Win/Mac/Mobile)", "Chống theo dõi webcam", "Tối ưu hóa một chạm"],
      suitable_for: ["Gia đình", "Doanh nghiệp", "Người dùng ngân hàng số"]
    },
    variants: [{ name: '1 Năm / 5 Thiết bị', price: 250000, orginalPrice: 800000 }]
  },

  // ================= CATEGORY: GAME =================
  {
    name: 'Elden Ring (Steam Key)', slug: 'elden-ring-global', categorySlug: 'game',
    description: 'Khám phá thế giới giả tưởng hùng vĩ của vùng đất Lands Between trong siêu phẩm Elden Ring. Được nhào nặn bởi bàn tay tài hoa của Hidetaka Miyazaki và nhà văn George R.R. Martin, trò chơi mang đến một trải nghiệm Souls-like thế giới mở đầy khắc nghiệt nhưng cũng vô cùng lôi cuốn. Với đồ họa đỉnh cao, hệ thống chiến đấu đa dạng và hàng trăm bí mật đang chờ được khám phá, đây xứng đáng là tựa game hành động nhập vai xuất sắc nhất mà bạn nên sở hữu.',
    thumbnail: 'https://res.cloudinary.com/diap7lvcv/image/upload/v1766675833/eldenring_ogme7h.jpg',
    isHot: false, avgRating: 4.9, keywordNames: ["game", "steam"],
    aiMetadata: {
      keywords: ["game AAA", "souls-like", "thế giới mở", "elden ring"],
      features: ["Cốt truyện sâu sắc", "Thế giới mở rộng lớn", "Key Steam bản quyền"],
      suitable_for: ["Game thủ PC", "Fan thể loại hành động nhập vai"]
    },
    variants: [{ name: 'Standard Edition', price: 850000, orginalPrice: 1090000 }]
  }
];