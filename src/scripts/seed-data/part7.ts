// prisma/seed-data/part7.ts

export const productsPart7 = [
  // ================= CATEGORY: GAME (BONUS SPECIAL) =================
  {
    name: 'Grand Theft Auto VI (GTA 6)', slug: 'gta-vi-pre-order', categorySlug: 'game',
    description: 'Siêu phẩm được mong chờ nhất thập kỷ từ Rockstar Games, đưa người chơi quay trở lại Vice City rực rỡ sắc màu nhưng đầy rẫy tội phạm. GTA 6 hứa hẹn thiết lập một tiêu chuẩn mới cho dòng game thế giới mở với đồ họa chân thực đến kinh ngạc, hệ thống tương tác vật lý đột phá và một cốt truyện kịch tính xoay quanh cặp đôi nhân vật chính đầy lôi cuốn. Đây không chỉ là một trò chơi, mà là một trải nghiệm sống động trong một thế giới ảo rộng lớn và chi tiết nhất từng được tạo ra.',
    thumbnail: 'https://res.cloudinary.com/diap7lvcv/image/upload/v1766676661/%C3%81p_ph%C3%ADch_Grand_Theft_Auto_VI_uwjwkp.png',
    isHot: true, avgRating: 5.0, keywordNames: ["game", "gta", "steam"],
    aiMetadata: {
      keywords: ["gta 6", "rockstar games", "game thế giới mở", "siêu phẩm 2025"],
      features: ["Bản đồ Vice City mở rộng", "Đồ họa Next-gen", "Cốt truyện song mã độc đáo", "Hệ thống AI cư dân thông minh"],
      suitable_for: ["Tất cả game thủ", "Fan dòng game hành động", "Người sưu tầm game bản quyền"]
    },
    variants: [{ name: 'Pre-order Global', price: 1850000, orginalPrice: 2000000 }]
  },
  {
    name: 'Half-Life 3', slug: 'half-life-3-steam', categorySlug: 'game',
    description: 'Sự trở lại của huyền thoại Gordon Freeman trong phần tiếp theo của series bắn súng góc nhìn thứ nhất (FPS) vĩ đại nhất mọi thời đại. Half-Life 3 được phát triển trên nền tảng Source 2 mới nhất, mang đến cơ chế giải đố dựa trên vật lý phức tạp và những trận chiến nghẹt thở chống lại thế giới Combine. Với sự kết hợp hoàn hảo giữa kể chuyện môi trường và lối chơi đổi mới, đây chính là tác phẩm định nghĩa lại thể loại hành động viễn tưởng cho thế hệ phần cứng mới.',
    thumbnail: 'https://res.cloudinary.com/diap7lvcv/image/upload/v1766676675/halflife_3_itwknk.jpg',
    isHot: true, avgRating: 5.0, keywordNames: ["game", "steam"],
    aiMetadata: {
      keywords: ["half life 3", "valve", "source 2", "fps huyền thoại"],
      features: ["Cơ chế vật lý đột phá", "Cốt truyện tiếp nối đỉnh cao", "Đồ họa Source 2 tối tân", "Trải nghiệm nhập vai sâu sắc"],
      suitable_for: ["Fan lâu năm của Valve", "Người yêu thích game bắn súng cốt truyện"]
    },
    variants: [{ name: 'Standard Key Steam', price: 1250000, orginalPrice: 1500000 }]
  },

  // ================= CATEGORY: SOFTWARE & TOOLS =================

  {
    name: 'CleanMyMac X (Bản Quyền)', slug: 'clean-my-mac-x-key', categorySlug: 'software',
    description: 'Công cụ dọn dẹp và tối ưu hóa hệ thống hàng đầu dành cho người dùng macOS. CleanMyMac X giúp loại bỏ hàng gigabyte rác hệ thống, các ứng dụng không sử dụng và tệp tin tạm một cách an toàn nhất. Ngoài ra, phần mềm còn tích hợp bộ quét mã độc chuyên sâu, tính năng bảo trì giúp tăng tốc độ xử lý của máy Mac và quản lý quyền riêng tư cho các trình duyệt, giúp chiếc máy tính của bạn luôn hoạt động trơn tru như lúc mới mua.',
    thumbnail: 'https://res.cloudinary.com/diap7lvcv/image/upload/v1766676671/cleanmymac_yrneeh.jpg',
    isHot: false, avgRating: 4.8, keywordNames: ["windows", "key"],
    aiMetadata: {
      keywords: ["tối ưu macos", "dọn rác máy tính", "tăng tốc macbook"],
      features: ["Dọn rác hệ thống thông minh", "Gỡ ứng dụng triệt để", "Quét Malware thời gian thực", "Quản lý tệp lớn & cũ"],
      suitable_for: ["Người dùng Macbook/iMac", "Thiết kế đồ họa", "Lập trình viên trên Mac"]
    },
    variants: [{ name: 'Gói 1 Năm / 1 Mac', price: 450000, orginalPrice: 1200000 }]
  },

  // ================= CATEGORY: EDUCATION & VPN =================
  {
    name: 'ExpressVPN Premium', slug: 'express-vpn-premium', categorySlug: 'education',
    description: 'Dịch vụ mạng riêng ảo (VPN) dẫn đầu thị trường về tốc độ và tính bảo mật. Với hệ thống máy chủ đặt tại 94 quốc gia, ExpressVPN giúp bạn vượt qua mọi rào cản địa lý để truy cập các nội dung toàn cầu như Netflix US, Hulu hay Disney+. Công nghệ TrustedServer cùng mã hóa cấp quân sự đảm bảo rằng mọi hoạt động trực tuyến của bạn hoàn toàn ẩn danh, không để lại dấu vết và an toàn tuyệt đối trước các mối đe dọa từ tin tặc trên Wi-Fi công cộng[cite: 59].',
    thumbnail: 'https://res.cloudinary.com/diap7lvcv/image/upload/v1766676668/ExpressVPN-logo_ul55cu.png',
    isHot: false, avgRating: 4.8, keywordNames: ["expressvpn", "vpn"],
    aiMetadata: {
      keywords: ["vpn tốc độ cao", "ẩn ip", "bảo mật internet", "fake ip"],
      features: ["Băng thông không giới hạn", "Mã hóa AES-256 bit", "Hỗ trợ đa nền tảng", "Không lưu nhật ký truy cập"],
      suitable_for: ["Người làm việc từ xa", "Người xem phim nước ngoài", "Gamer giảm ping"]
    },
    variants: [{ name: 'Key Mobile 1 Năm', price: 350000, orginalPrice: 2000000 }]
  },

  // ================= CATEGORY: DESIGN =================
  {
    name: 'Figma Professional Plan', slug: 'figma-pro-subscription', categorySlug: 'design',
    description: 'Công cụ thiết kế giao diện (UI/UX) chuẩn mực nhất cho các nhóm làm việc hiện đại. Gói Professional mở khóa các tính năng cao cấp như lịch sử phiên bản không giới hạn, thư viện nhóm dùng chung cho tất cả các dự án và quyền truy cập vào các thư mục dự án riêng tư. Với khả năng cộng tác thời gian thực mượt mà, Figma giúp quy trình thiết kế từ ý tưởng đến bàn giao cho lập trình viên trở nên nhất quán và hiệu quả hơn bao giờ hết[cite: 68].',
    thumbnail: 'https://res.cloudinary.com/diap7lvcv/image/upload/v1766676663/figma-professional-png_alectu.webp',
    isHot: false, avgRating: 4.9, keywordNames: ["figma", "design"],
    aiMetadata: {
      keywords: ["thiết kế ui ux", "thiết kế web", "figma pro", "team design"],
      features: ["Lịch sử phiên bản vô hạn", "Thư viện nhóm nâng cao", "Quyền truy cập riêng tư", "Cộng tác không giới hạn"],
      suitable_for: ["UI/UX Designer", "Product Manager", "Agency thiết kế"]
    },
    variants: [{ name: 'Nâng cấp 1 Năm', price: 450000, orginalPrice: 3000000 }]
  }
];