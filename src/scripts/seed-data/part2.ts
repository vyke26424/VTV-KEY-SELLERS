// prisma/seed-data/part2.ts

export const productsPart2 = [
  // ================= CATEGORY: AI (TRÍ TUỆ NHÂN TẠO) =================
  {
    name: 'ChatGPT Plus (GPT-4o)', 
    slug: 'chatgpt-plus', 
    categorySlug: 'ai',
    description: 'Nâng cấp tài khoản chính chủ của bạn lên phiên bản ChatGPT Plus để tận dụng tối đa sức mạnh từ OpenAI. Với mô hình GPT-4o thế hệ mới, bạn sẽ trải nghiệm tốc độ phản hồi cực nhanh, khả năng xử lý đa phương thức vượt trội từ hình ảnh, âm thanh đến văn bản phức tạp. Tài khoản Plus giúp bạn ưu tiên truy cập trong giờ cao điểm, sử dụng không giới hạn các công cụ phân tích dữ liệu chuyên sâu, vẽ tranh nghệ thuật với DALL-E 3 và tạo các chatbot tùy chỉnh (GPTs) phục vụ riêng cho công việc và học tập.',
    thumbnail: 'https://res.cloudinary.com/diap7lvcv/image/upload/v1766673043/vtv-key-products/qbrup4dilo4zppo9dnuz.png',
    isHot: true, 
    avgRating: 4.9, 
    keywordNames: ["chatgpt", "gpt-4o", "openai", "ai", "trợ lý ảo", "viết code"],
    aiMetadata: {
      keywords: ["openai", "trợ lý ảo", "viết code", "gpt-4", "nâng cấp chatgpt"],
      features: ["Mô hình GPT-4o mới nhất", "Vẽ tranh DALL-E 3", "Phân tích dữ liệu Advanced Data Analysis", "Tạo GPTs cá nhân"],
      suitable_for: ["Lập trình viên", "Content Creator", "Sinh viên", "Marketing chuyên nghiệp"]
    },
    variants: [
      { name: '1 Tháng (Share)', price: 140000, orginalPrice: 200000 },
      { name: '1 Tháng (Riêng)', price: 490000, orginalPrice: 580000 }, 
      { name: '6 Tháng (Gói gia hạn)', price: 2350000, orginalPrice: 3480000 }
    ]
  },
  {
    name: 'Midjourney Pro', 
    slug: 'midjourney-pro', 
    categorySlug: 'ai',
    description: 'Midjourney Pro là công cụ vẽ tranh bằng trí tuệ nhân tạo hàng đầu hiện nay, cho phép biến những ý tưởng từ văn bản thành những tác phẩm nghệ thuật kỹ thuật số đỉnh cao. Với phiên bản Pro, bạn được hưởng các đặc quyền tối cao bao gồm: toàn quyền thương mại cho sản phẩm tạo ra, chế độ Stealth mode giúp bảo mật hoàn toàn các câu lệnh (prompts), và dung lượng xử lý ảnh tốc độ cao (Fast Hours) lớn nhất, giúp công việc sáng tạo của bạn không bao giờ bị gián đoạn.',
    thumbnail: 'https://res.cloudinary.com/diap7lvcv/image/upload/v1766673121/google-gemini-icon_o6inzu.png',
    isHot: true, 
    avgRating: 4.8, 
    keywordNames: ["midjourney", "ai", "design", "vẽ tranh ai", "nghệ thuật số"],
    aiMetadata: {
      keywords: ["vẽ tranh ai", "tạo ảnh", "nghệ thuật số", "midjourney pro"],
      features: ["Tạo ảnh chất lượng cao 4K", "Stealth mode bảo mật", "Quyền thương mại hoàn toàn", "Xử lý ảnh ưu tiên"],
      suitable_for: ["Designer", "Họa sĩ", "Kiến trúc sư", "Người làm quảng cáo"]
    },
    variants: [
      { name: 'Basic Plan 1 Tháng', price: 290000, orginalPrice: 350000 },
      { name: 'Standard Plan 1 Tháng', price: 650000, orginalPrice: 800000 },
      { name: 'Standard Plan 1 Năm', price: 6100000, orginalPrice: 9600000 }
    ]
  },
  {
    name: 'Claude 3 Opus', 
    slug: 'claude-3-opus', 
    categorySlug: 'ai',
    description: 'Claude 3 Opus là mô hình ngôn ngữ lớn mạnh mẽ nhất từ Anthropic, được thiết kế để xử lý các yêu cầu khó khăn nhất với độ thông minh tiệm cận con người. Opus vượt trội trong các bài kiểm tra về suy luận logic, toán học và lập trình chuyên sâu. Với khả năng thấu hiểu ngữ cảnh siêu việt và phong cách giao tiếp tự nhiên, Claude 3 Opus là trợ thủ đắc lực cho việc phân tích các tài liệu học thuật phức tạp hoặc xây dựng các chiến lược kinh doanh đa tầng.',
    thumbnail: 'https://pbs.twimg.com/media/GH6cqzWXkAApxQl.jpg',
    isHot: false, 
    avgRating: 4.8, 
    keywordNames: ["claude", "ai", "bot", "anthropic", "viết code", "viết văn"],
    aiMetadata: {
      keywords: ["claude ai", "anthropic", "xử lý văn bản", "claude 3 opus"],
      features: ["Xử lý context cực dài 200k tokens", "Khả năng lập trình xuất sắc", "Hạn chế ảo giác thông tin", "Phân tích tài liệu PDF phức tạp"],
      suitable_for: ["Nhà nghiên cứu", "Dev chuyên nghiệp", "Biên tập viên", "Nhà phân tích dữ liệu"]
    },
    variants: [
      { name: 'Tài khoản riêng 1 Tháng', price: 520000, orginalPrice: 600000 },
      { name: 'Gói gia hạn 3 Tháng', price: 1250000, orginalPrice: 1800000 }
    ]
  },
  {
    name: 'Google Gemini Advanced', 
    slug: 'gemini-advanced', 
    categorySlug: 'ai',
    description: 'Khám phá đỉnh cao công nghệ AI của Google với gói Gemini Advanced (sử dụng mô hình Ultra 1.0). Dịch vụ này mang lại khả năng phân tích, lập luận và sáng tạo nội dung vượt xa các mô hình thông thường. Đặc biệt, Gemini Advanced được tích hợp sâu vào Google Workspace, cho phép bạn soạn thảo Gmail, tạo nội dung trong Google Docs và phân tích dữ liệu trong Sheets chỉ bằng những yêu cầu đơn giản. Gói này còn tặng kèm 2TB lưu trữ Google One cho toàn bộ tài khoản của bạn.',
    thumbnail: 'https://res.cloudinary.com/diap7lvcv/image/upload/v1766673121/google-gemini-icon_o6inzu.png',
    isHot: true, 
    avgRating: 4.7, 
    keywordNames: ["gemini", "google", "ai", "google one", "trợ lý ảo"],
    aiMetadata: {
      keywords: ["google ai", "gemini ultra", "google one", "gemini advanced"],
      features: ["AI Google Ultra 1.0", "Tích hợp Docs/Sheets/Gmail", "Tặng 2TB lưu trữ Google One", "Xử lý logic đa tầng"],
      suitable_for: ["Người dùng Google Workspace", "Dân văn phòng", "Quản lý dự án"]
    },
    variants: [
      { name: 'Nâng cấp 1 Tháng', price: 90000, orginalPrice: 480000 },
      { name: 'Gói nâng cấp 6 Tháng', price: 420000, orginalPrice: 2880000 }
    ]
  },
  {
    name: 'Claude 3.5 Sonnet (Pro)', 
    slug: 'claude-3-5-sonnet', 
    categorySlug: 'ai',
    description: 'Claude 3.5 Sonnet là một bước nhảy vọt về trí tuệ nhân tạo từ Anthropic, mang đến sự cân bằng hoàn hảo giữa trí thông minh đỉnh cao và tốc độ xử lý nhanh chóng. Phiên bản này đặc biệt hiệu quả cho các tác vụ lập trình (coding) và viết lách chuyên nghiệp nhờ khả năng hiểu các sắc thái ngôn ngữ tinh tế. Tính năng Artifacts mới cho phép người dùng xem trực tiếp các đoạn code, website hoặc thiết kế đồ họa ngay trong cửa sổ chat, giúp tối ưu hóa quy trình làm việc từ ý tưởng đến thực thi.',
    thumbnail: 'https://res.cloudinary.com/diap7lvcv/image/upload/v1766675181/What-is-Claude-Sonnet-3.5-1747766292_wgzosm.png',
    isHot: true, 
    avgRating: 4.9, 
    keywordNames: ["claude", "ai", "bot", "anthropic", "lập trình ai", "viết lách"],
    aiMetadata: {
      keywords: ["claude pro", "anthropic", "lập trình ai", "viết lách", "claude 3.5"],
      features: ["Mô hình Claude 3.5 Sonnet", "Truy cập ưu tiên", "Tính năng Artifacts độc đáo", "Giới hạn tin nhắn lớn"],
      suitable_for: ["Lập trình viên", "Writer", "Nhà nghiên cứu", "Content Creator"]
    },
    variants: [
      { name: '1 Tháng (Chính chủ)', price: 480000, orginalPrice: 550000 },
      { name: 'Gói 1 Năm', price: 4500000, orginalPrice: 6600000 }
    ]
  },
  {
    name: 'GitHub Copilot', 
    slug: 'github-copilot', 
    categorySlug: 'ai',
    description: 'Tăng tốc quy trình lập trình của bạn với GitHub Copilot - trợ lý code AI hàng đầu thế giới. Được huấn luyện trên hàng tỷ dòng mã nguồn, Copilot có thể gợi ý toàn bộ các đoạn code, hàm và giải thuật phức tạp ngay khi bạn đang gõ. Công cụ này tích hợp hoàn hảo với VS Code, JetBrains và các IDE phổ biến khác, giúp bạn giảm bớt thời gian cho các tác vụ lặp lại, học hỏi các mẫu code mới và tập trung hoàn toàn vào việc xây dựng logic sáng tạo cho dự án phần mềm.',
    thumbnail: 'https://res.cloudinary.com/diap7lvcv/image/upload/v1766675831/aicandy_cong_cu_ai_GitHubCopilot_jmrfdl.webp',
    isHot: false, 
    avgRating: 4.9, 
    keywordNames: ["copilot", "ai", "viết code", "lập trình ai", "github"],
    aiMetadata: {
      keywords: ["lập trình ai", "tự động viết code", "dev tools", "github ai", "copilot"],
      features: ["Gợi ý code thời gian thực", "Hỗ trợ đa ngôn ngữ lập trình", "Tích hợp VS Code, JetBrains", "Tạo unit test tự động"],
      suitable_for: ["Lập trình viên", "Sinh viên IT", "Kỹ sư phần mềm"]
    },
    variants: [
      { name: 'Gói 1 Tháng', price: 290000, orginalPrice: 350000 },
      { name: 'Gói 1 Năm', price: 2600000, orginalPrice: 4200000 }
    ]
  },
  {
    name: 'Quillbot Premium', 
    slug: 'quillbot-premium', 
    categorySlug: 'ai',
    description: 'Quillbot Premium là công cụ tối ưu cho việc diễn đạt và trau chuốt văn bản tiếng Anh. Với các chế độ viết đa dạng như Formal, Academic, Creative... bạn có thể thay đổi tông giọng và cấu trúc câu một cách linh hoạt mà vẫn giữ nguyên ý nghĩa gốc. Phiên bản Premium mở khóa toàn bộ giới hạn ký tự, tích hợp trình kiểm tra đạo văn (Plagiarism Checker), trình kiểm tra ngữ pháp và đề xuất từ vựng phong phú, giúp các bài luận, email hoặc báo cáo của bạn luôn đạt chuẩn chuyên nghiệp.',
    thumbnail: 'https://res.cloudinary.com/diap7lvcv/image/upload/v1766675830/quill_ejotkb.png',
    isHot: false, 
    avgRating: 4.8, 
    keywordNames: ["quillbot", "ai", "ngoại ngữ", "sửa lỗi tiếng anh", "viết văn"],
    aiMetadata: {
      keywords: ["sửa lỗi tiếng anh", "diễn đạt lại văn bản", "check đạo văn", "quillbot premium"],
      features: ["Nhiều chế độ Paraphrase nâng cao", "Trình kiểm tra đạo văn chuyên nghiệp", "Không giới hạn số từ", "Tiện ích mở rộng Chrome/Word"],
      suitable_for: ["Du học sinh", "Biên dịch viên", "Người viết blog", "Sinh viên"]
    },
    variants: [
      { name: '1 Tháng Premium', price: 150000, orginalPrice: 200000 },
      { name: '1 Năm Premium', price: 1350000, orginalPrice: 2400000 }
    ]
  },
  {
    name: 'Perplexity Pro', 
    slug: 'perplexity-pro', 
    categorySlug: 'ai',
    description: 'Perplexity Pro tái định nghĩa cách bạn tìm kiếm thông tin bằng cách kết hợp trí tuệ nhân tạo và dữ liệu thời gian thực từ Internet. Khác với các chatbot AI khác có thể đưa thông tin cũ, Perplexity luôn cung cấp câu trả lời mới nhất kèm theo trích dẫn nguồn cụ thể để bạn kiểm chứng. Gói Pro cho phép bạn sử dụng không giới hạn các mô hình hàng đầu như GPT-4o, Claude 3, thực hiện tải lên các tệp tài liệu PDF dài để yêu cầu AI phân tích và tóm tắt thông tin một cách nhanh chóng.',
    thumbnail: 'https://res.cloudinary.com/diap7lvcv/image/upload/v1766675179/Perplexity-Pro-Annual-Offer-2014106965_h2wcxb.webp',
    isHot: true, 
    avgRating: 4.9, 
    keywordNames: ["perplexity", "ai", "google", "tìm kiếm ai", "tra cứu thông tin"],
    aiMetadata: {
      keywords: ["tìm kiếm ai", "tra cứu thông tin", "phân tích dữ liệu", "perplexity pro"],
      features: ["Tùy chọn GPT-4o/Claude 3", "Dẫn nguồn trích dẫn chính xác", "Upload file không giới hạn", "Phân tích dữ liệu thực tế"],
      suitable_for: ["Sinh viên", "Nhà báo", "Người nghiên cứu thị trường", "Học thuật"]
    },
    variants: [
      { name: 'Tài khoản 1 Tháng', price: 480000, orginalPrice: 550000 },
      { name: 'Tài khoản 1 Năm', price: 4650000, orginalPrice: 6600000 }
    ]
  },
  {
    name: 'ElevenLabs Creator', 
    slug: 'elevenlabs', 
    categorySlug: 'ai',
    description: 'ElevenLabs là công cụ tạo giọng nói AI chân thực và cảm xúc nhất hiện nay, mang lại sức sống cho các nội dung số của bạn. Với công nghệ chuyển văn bản thành giọng nói (Text-to-Speech) tiên tiến, ElevenLabs hỗ trợ hàng trăm giọng nói đa dạng và tự nhiên cho nhiều ngôn ngữ, bao gồm cả tiếng Việt. Gói Creator cho phép bạn clone (sao chép) giọng nói cá nhân với độ chính xác kinh ngạc, rất phù hợp cho việc lồng tiếng video TikTok, YouTuber, Podcast hoặc kể chuyện audio với chất lượng phòng thu chuyên nghiệp.',
    thumbnail: 'https://avatars.githubusercontent.com/u/111288604?s=280&v=4',
    isHot: false, 
    avgRating: 4.8, 
    keywordNames: ["ai", "bot", "giọng nói", "lồng tiếng ai", "tts"],
    aiMetadata: {
      keywords: ["lồng tiếng ai", "giọng nói nhân tạo", "speech synthesis", "elevenlabs"],
      features: ["Giọng nói siêu thực đa ngôn ngữ", "Voice Cloning chuyên nghiệp", "Hỗ trợ tiếng Việt tự nhiên", "API mạnh mẽ cho nhà phát triển"],
      suitable_for: ["YouTuber", "Podcaster", "Nhà sáng tạo video TikTok", "Dựng phim"]
    },
    variants: [
      { name: '100k ký tự/tháng', price: 250000, orginalPrice: 300000 },
      { name: '500k ký tự/tháng', price: 950000, orginalPrice: 1500000 }
    ]
  }
];