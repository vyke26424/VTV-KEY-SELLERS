// prisma/seed-data/part1.ts

export const productsPart1 = [
  // ================= CATEGORY: AI =================
  {
    name: 'ChatGPT Plus (GPT-4o)', slug: 'chatgpt-plus', categorySlug: 'ai',
    description: 'Nâng cấp tài khoản chính chủ lên ChatGPT Plus. Mở khóa sức mạnh của GPT-4o mới nhất, vẽ tranh DALL-E 3.',
    thumbnail: 'https://shop.activeitfirm.com/wp-content/uploads/2025/01/Chat-GPT-Plus-1-600x600.png',
    isHot: true, avgRating: 4.9, keywordNames: ["chatgpt", "gpt-4o", "openai", "ai"],
    aiMetadata: {
      keywords: ["openai", "trợ lý ảo", "viết code", "gpt-4"],
      features: ["Mô hình GPT-4o mới nhất", "Vẽ tranh DALL-E 3", "Phân tích dữ liệu"],
      suitable_for: ["Lập trình viên", "Content Creator", "Sinh viên", "Marketing"]
    },
    variants: [{ name: '1 Tháng (Riêng)', price: 490000, orginalPrice: 580000 }, { name: '1 Tháng (Share)', price: 140000, orginalPrice: 200000 }]
  },
  {
    name: 'Midjourney Pro', slug: 'midjourney-pro', categorySlug: 'ai',
    description: 'Công cụ tạo ảnh AI nghệ thuật đẹp nhất thế giới hiện nay. Quyền thương mại và chế độ Stealth mode.',
    thumbnail: 'https://registry.npmmirror.com/@lobehub/icons-static-png/1.75.0/files/dark/midjourney.png',
    isHot: true, avgRating: 4.8, keywordNames: ["midjourney", "ai", "design"],
    aiMetadata: {
      keywords: ["vẽ tranh ai", "tạo ảnh", "nghệ thuật số"],
      features: ["Tạo ảnh chất lượng cao", "Stealth mode", "Quyền thương mại"],
      suitable_for: ["Designer", "Họa sĩ", "Kiến trúc sư"]
    },
    variants: [{ name: 'Standard 1 Tháng', price: 650000, orginalPrice: 800000 }]
  },
  {
    name: 'Google Gemini Advanced', slug: 'gemini-advanced', categorySlug: 'ai',
    description: 'Mô hình AI mạnh nhất của Google (Ultra 1.0). Tích hợp sâu vào Google Workspace. Tặng 2TB Google One.',
    thumbnail: 'https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/google-gemini-icon.png',
    isHot: true, avgRating: 4.7, keywordNames: ["gemini", "google", "ai"],
    aiMetadata: {
      keywords: ["google ai", "gemini ultra", "google one"],
      features: ["AI Google Ultra 1.0", "Tích hợp Docs/Sheets", "Tặng 2TB lưu trữ"],
      suitable_for: ["Người dùng Google Workspace", "Dân văn phòng"]
    },
    variants: [{ name: 'Nâng cấp 1 Tháng', price: 90000, orginalPrice: 480000 }]
  },
  
  // ... (Bạn có thể thêm tiếp các sản phẩm AI khác từ list cũ vào đây, nhớ thêm aiMetadata tương tự)

  // ================= CATEGORY: ENTERTAINMENT =================
  {
    name: 'YouTube Premium', slug: 'youtube-premium', categorySlug: 'entertainment',
    description: 'Xem YouTube không quảng cáo, chạy nền, tải video offline. Kèm YouTube Music.',
    thumbnail: 'https://file.hstatic.net/200000061442/article/youtube_15d1e937db924cecb271594febec2780_1024x1024.png',
    isHot: true, avgRating: 4.9, keywordNames: ["youtube", "nhạc", "premium"],
    aiMetadata: {
      keywords: ["youtube không quảng cáo", "youtube music", "nâng cấp mail chính chủ", "ytb premium"],
      features: ["Nghe nhạc tắt màn hình", "Không quảng cáo", "Youtube Music Premium"], 
      suitable_for: ["Sinh viên", "Người hay nghe nhạc", "Gia đình"]
    },
    variants: [{ name: '6 Tháng', price: 149000, orginalPrice: 350000 }]
  },
  {
    name: 'Netflix Premium 4K', slug: 'netflix-premium', categorySlug: 'entertainment',
    description: 'Tài khoản Netflix Premium xem phim 4K Ultra HD. Xem không giới hạn, không quảng cáo.',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/7/75/Netflix_icon.svg',
    isHot: true, avgRating: 4.9, keywordNames: ["netflix", "phim", "4k"],
    aiMetadata: {
      keywords: ["xem phim 4k", "netflix", "phim mỹ"],
      features: ["Chất lượng 4K Ultra HD", "Vietsub/Lồng tiếng", "Không quảng cáo"],
      suitable_for: ["Mọt phim", "Gia đình", "Cặp đôi"]
    },
    variants: [{ name: '1 Tháng (Slot)', price: 85000, orginalPrice: 260000 }]
  },
  {
    name: 'Spotify Premium', slug: 'spotify-premium', categorySlug: 'entertainment',
    description: 'Nâng cấp Spotify chính chủ. Nghe nhạc 320kbps, chuyển bài không giới hạn.',
    thumbnail: 'https://m.media-amazon.com/images/I/31B2Nyzd8XL.png',
    isHot: true, avgRating: 4.8, keywordNames: ["spotify", "nhạc"],
    aiMetadata: {
      keywords: ["nghe nhạc", "spotify", "âm thanh chất lượng cao"],
      features: ["Nghe nhạc không quảng cáo", "Chuyển bài không giới hạn", "Tải nhạc offline"],
      suitable_for: ["Người yêu nhạc", "Gen Z"]
    },
    variants: [{ name: '1 Năm', price: 290000, orginalPrice: 590000 }]
  }
];