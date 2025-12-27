// prisma/seed-data/part2.ts

export const productsPart2 = [
  // ================= CATEGORY: AI (TRÍ TUỆ NHÂN TẠO) =================
  {
    name: 'ChatGPT Plus (GPT-4o)', 
    slug: 'chatgpt-plus', 
    categorySlug: 'ai',
    description: 'Nâng cấp tài khoản chính chủ lên ChatGPT Plus. Mở khóa sức mạnh của GPT-4o mới nhất, vẽ tranh DALL-E 3.',
    thumbnail: 'https://res.cloudinary.com/diap7lvcv/image/upload/v1766673043/vtv-key-products/qbrup4dilo4zppo9dnuz.png',
    isHot: true, 
    avgRating: 4.9, 
    keywordNames: ["chatgpt", "gpt-4o", "openai", "ai"],
    aiMetadata: {
      keywords: ["openai", "trợ lý ảo", "viết code", "gpt-4"],
      features: ["Mô hình GPT-4o mới nhất", "Vẽ tranh DALL-E 3", "Phân tích dữ liệu"],
      suitable_for: ["Lập trình viên", "Content Creator", "Sinh viên", "Marketing"]
    },
    variants: [
      { name: '1 Tháng (Riêng)', price: 490000, orginalPrice: 580000 }, 
      { name: '1 Tháng (Share)', price: 140000, orginalPrice: 200000 }
    ]
  },
  {
    name: 'Midjourney Pro', 
    slug: 'midjourney-pro', 
    categorySlug: 'ai',
    description: 'Công cụ tạo ảnh AI nghệ thuật đẹp nhất thế giới hiện nay. Quyền thương mại và chế độ Stealth mode.',
    thumbnail: 'https://res.cloudinary.com/diap7lvcv/image/upload/v1766673121/google-gemini-icon_o6inzu.png',
    isHot: true, 
    avgRating: 4.8, 
    keywordNames: ["midjourney", "ai", "design"],
    aiMetadata: {
      keywords: ["vẽ tranh ai", "tạo ảnh", "nghệ thuật số"],
      features: ["Tạo ảnh chất lượng cao", "Stealth mode", "Quyền thương mại"],
      suitable_for: ["Designer", "Họa sĩ", "Kiến trúc sư"]
    },
    variants: [{ name: 'Standard 1 Tháng', price: 650000, orginalPrice: 800000 }]
  },
  {
    name: 'Claude 3 Opus', 
    slug: 'claude-3-opus', 
    categorySlug: 'ai',
    description: 'AI thông minh nhất từ Anthropic, xử lý văn bản dài cực tốt, code đỉnh cao.',
    thumbnail: 'https://pbs.twimg.com/media/GH6cqzWXkAApxQl.jpg',
    isHot: false, 
    avgRating: 4.8, 
    keywordNames: ["claude", "ai", "bot"],
    aiMetadata: {
      keywords: ["claude ai", "anthropic", "xử lý văn bản"],
      features: ["Xử lý context cực dài", "Khả năng lập trình xuất sắc", "Hạn chế ảo giác"],
      suitable_for: ["Nhà nghiên cứu", "Dev chuyên nghiệp"]
    },
    variants: [{ name: 'Tài khoản riêng 1T', price: 520000, orginalPrice: 600000 }]
  },
  {
    name: 'Google Gemini Advanced', 
    slug: 'gemini-advanced', 
    categorySlug: 'ai',
    description: 'Mô hình AI mạnh nhất của Google (Ultra 1.0). Tích hợp sâu vào Google Workspace. Tặng 2TB Google One.',
    thumbnail: 'https://res.cloudinary.com/diap7lvcv/image/upload/v1766673121/google-gemini-icon_o6inzu.png',
    isHot: true, 
    avgRating: 4.7, 
    keywordNames: ["gemini", "google", "ai"],
    aiMetadata: {
      keywords: ["google ai", "gemini ultra", "google one"],
      features: ["AI Google Ultra 1.0", "Tích hợp Docs/Sheets", "Tặng 2TB lưu trữ"],
      suitable_for: ["Người dùng Google Workspace", "Dân văn phòng"]
    },
    variants: [{ name: 'Nâng cấp 1 Tháng', price: 90000, orginalPrice: 480000 }]
  },
  {
    name: 'Claude 3.5 Sonnet (Pro)', 
    slug: 'claude-3-5-sonnet', 
    categorySlug: 'ai',
    description: 'Trải nghiệm trí tuệ nhân tạo thế hệ mới từ Anthropic với mô hình Claude 3.5 Sonnet đỉnh cao. Đây là giải pháp AI vượt trội trong việc hiểu ngữ cảnh phức tạp và lập trình chính xác.',
    thumbnail: 'https://res.cloudinary.com/diap7lvcv/image/upload/v1766675181/What-is-Claude-Sonnet-3.5-1747766292_wgzosm.png',
    isHot: true, 
    avgRating: 4.9, 
    keywordNames: ["claude", "ai", "bot"],
    aiMetadata: {
      keywords: ["claude pro", "anthropic", "lập trình ai", "viết lách"],
      features: ["Mô hình Claude 3.5 Sonnet", "Truy cập ưu tiên", "Tính năng Artifacts", "Giới hạn tin nhắn lớn"],
      suitable_for: ["Lập trình viên", "Writer", "Nhà nghiên cứu"]
    },
    variants: [{ name: '1 Tháng (Chính chủ)', price: 480000, orginalPrice: 550000 }]
  },
  {
    name: 'GitHub Copilot', 
    slug: 'github-copilot', 
    categorySlug: 'ai',
    description: 'Trợ lý lập trình AI tốt nhất cho Developer. Tự động gợi ý code trong VS Code.',
    thumbnail: 'https://res.cloudinary.com/diap7lvcv/image/upload/v1766675831/aicandy_cong_cu_ai_GitHubCopilot_jmrfdl.webp',
    isHot: false, 
    avgRating: 4.9, 
    keywordNames: ["copilot", "ai"],
    aiMetadata: {
      keywords: ["lập trình ai", "tự động viết code", "dev tools", "github ai"],
      features: ["Gợi ý code thời gian thực", "Hỗ trợ đa ngôn ngữ lập trình", "Tích hợp VS Code, JetBrains"],
      suitable_for: ["Lập trình viên", "Sinh viên IT", "Kỹ sư phần mềm"]
    },
    variants: [{ name: 'Gói 1 Năm', price: 450000, orginalPrice: 2400000 }]
  },
  {
    name: 'Quillbot Premium', 
    slug: 'quillbot-premium', 
    categorySlug: 'ai',
    description: 'Công cụ Paraphrase tiếng Anh số 1 thế giới. Hỗ trợ check đạo văn, tóm tắt văn bản.',
    thumbnail: 'https://res.cloudinary.com/diap7lvcv/image/upload/v1766675830/quill_ejotkb.png',
    isHot: false, 
    avgRating: 4.8, 
    keywordNames: ["quillbot", "ai"],
    aiMetadata: {
      keywords: ["sửa lỗi tiếng anh", "diễn đạt lại văn bản", "check đạo văn"],
      features: ["Nhiều chế độ Paraphrase nâng cao", "Trình kiểm tra đạo văn chuyên nghiệp", "Không giới hạn số từ"],
      suitable_for: ["Du học sinh", "Biên dịch viên", "Người viết blog"]
    },
    variants: [{ name: '1 Năm', price: 250000, orginalPrice: 900000 }]
  },
  {
    name: 'Jasper AI Boss Mode', 
    slug: 'jasper-ai', 
    categorySlug: 'ai',
    description: 'AI viết Content Marketing chuyên nghiệp. Tạo bài Blog, Facebook Ads chỉ trong vài giây.',
    thumbnail: 'https://assets-global.website-files.com/60e5f2de011b86acebc30db7/60e5f2de011b86427bc30e2f_Jasper%20Logo%20(1).png',
    isHot: false, 
    avgRating: 4.7, 
    keywordNames: ["jasper", "ai", "bot"],
    aiMetadata: {
      keywords: ["marketing ai", "viết lách tự động", "jasper boss mode"],
      features: ["Tạo Content đa kênh", "Tối ưu SEO bài viết", "Hỗ trợ 25+ ngôn ngữ"],
      suitable_for: ["Marketer", "Blogger", "Copywriter"]
    },
    variants: [{ name: '1 Tháng', price: 290000, orginalPrice: 1200000 }]
  },
  {
    name: 'Perplexity Pro', 
    slug: 'perplexity-pro', 
    categorySlug: 'ai',
    description: 'Công cụ tìm kiếm AI thay thế Google. Tìm kiếm thông tin chính xác, có dẫn nguồn.',
    thumbnail: 'https://res.cloudinary.com/diap7lvcv/image/upload/v1766675179/Perplexity-Pro-Annual-Offer-2014106965_h2wcxb.webp',
    isHot: true, 
    avgRating: 4.9, 
    keywordNames: ["perplexity", "ai", "google"],
    aiMetadata: {
      keywords: ["tìm kiếm ai", "tra cứu thông tin", "phân tích dữ liệu"],
      features: ["Tùy chọn GPT-4o/Claude 3", "Dẫn nguồn chính xác", "Upload file không giới hạn"],
      suitable_for: ["Sinh viên", "Nhà báo", "Người nghiên cứu thị trường"]
    },
    variants: [{ name: '1 Năm', price: 990000, orginalPrice: 2400000 }]
  },
  {
    name: 'Poe Subscription', 
    slug: 'poe-sub', 
    categorySlug: 'ai',
    description: 'Truy cập tất cả các bot AI: GPT-4, Claude 3, Llama 2 trong một ứng dụng duy nhất.',
    thumbnail: 'https://seeklogo.com/images/P/poe-logo-5A1E4239E3-seeklogo.com.png',
    isHot: false, 
    avgRating: 4.6, 
    keywordNames: ["ai", "bot"],
    aiMetadata: {
      keywords: ["chatbot hub", "quora ai", "đa mô hình"],
      features: ["Truy cập nhiều AI lớn", "Tạo bot cá nhân", "Giao diện đa nền tảng"],
      suitable_for: ["Người thích trải nghiệm nhiều AI"]
    },
    variants: [{ name: '1 Tháng', price: 150000, orginalPrice: 400000 }]
  },
  {
    name: 'ElevenLabs Creator', 
    slug: 'elevenlabs', 
    categorySlug: 'ai',
    description: 'Công cụ chuyển văn bản thành giọng nói (Text-to-Speech) AI cảm xúc nhất hiện nay. Clone giọng nói.',
    thumbnail: 'https://avatars.githubusercontent.com/u/111288604?s=280&v=4',
    isHot: false, 
    avgRating: 4.8, 
    keywordNames: ["ai", "bot"],
    aiMetadata: {
      keywords: ["lồng tiếng ai", "giọng nói nhân tạo", "speech synthesis"],
      features: ["Giọng nói siêu thực", "Voice Cloning", "Hỗ trợ tiếng Việt"],
      suitable_for: ["YouTuber", "Podcaster", "Nhà sáng tạo video"]
    },
    variants: [{ name: '100k ký tự/tháng', price: 120000, orginalPrice: 250000 }]
  }
];