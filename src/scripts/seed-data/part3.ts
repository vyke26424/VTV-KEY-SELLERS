// prisma/seed-data/part3.ts

export const productsPart3 = [
  // ================= CATEGORY: ENTERTAINMENT (GIẢI TRÍ & PHIM ẢNH) =================
  {
    name: 'YouTube Premium', 
    slug: 'youtube-premium', 
    categorySlug: 'entertainment',
    description: 'Trải nghiệm xem YouTube hoàn hảo không bị ngắt quãng bởi quảng cáo. Hỗ trợ tính năng chạy nền khi tắt màn hình, tải video ngoại tuyến và bao gồm toàn bộ quyền lợi của YouTube Music Premium để bạn tận hưởng kho nhạc khổng lồ mọi lúc mọi nơi[cite: 24].',
    thumbnail: 'https://res.cloudinary.com/diap7lvcv/image/upload/v1766673505/youtube_premium_kzunwo.png',
    isHot: true, 
    avgRating: 4.9, 
    keywordNames: ["youtube", "nhạc", "premium"],
    aiMetadata: {
      keywords: ["youtube không quảng cáo", "youtube music", "nâng cấp mail chính chủ", "ytb premium"],
      features: ["Nghe nhạc tắt màn hình", "Không quảng cáo", "Youtube Music Premium"], 
      suitable_for: ["Sinh viên", "Người hay nghe nhạc", "Gia đình"]
    },
    variants: [{ name: '6 Tháng', price: 149000, orginalPrice: 350000 }]
  },
  {
    name: 'Netflix Premium 4K', 
    slug: 'netflix-premium', 
    categorySlug: 'entertainment',
    description: 'Tài khoản xem phim chất lượng cao nhất hỗ trợ độ phân giải 4K Ultra HD và âm thanh Spatial Audio. Kho phim bom tấn Hollywood, series độc quyền và phim tài liệu phong phú với đầy đủ phụ đề tiếng Việt và thuyết minh chuyên nghiệp[cite: 23].',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/7/75/Netflix_icon.svg',
    isHot: true, 
    avgRating: 4.9, 
    keywordNames: ["netflix", "phim", "4k"],
    aiMetadata: {
      keywords: ["xem phim 4k", "netflix", "phim mỹ"],
      features: ["Chất lượng 4K Ultra HD", "Vietsub/Lồng tiếng", "Không quảng cáo"],
      suitable_for: ["Mọt phim", "Gia đình", "Cặp đôi"]
    },
    variants: [{ name: '1 Tháng (Slot)', price: 85000, orginalPrice: 260000 }]
  },
  {
    name: 'Spotify Premium', 
    slug: 'spotify-premium', 
    categorySlug: 'entertainment',
    description: 'Nâng cấp tài khoản Spotify chính chủ để thưởng thức âm nhạc chất lượng cao 320kbps. Nghe nhạc không giới hạn, không quảng cáo và dễ dàng tải xuống các playlist yêu thích để nghe ngoại tuyến trên mọi thiết bị[cite: 25].',
    thumbnail: 'https://res.cloudinary.com/diap7lvcv/image/upload/v1766673506/spotify_qe10by.png',
    isHot: true, 
    avgRating: 4.8, 
    keywordNames: ["spotify", "nhạc"],
    aiMetadata: {
      keywords: ["nghe nhạc", "spotify", "âm thanh chất lượng cao"],
      features: ["Nghe nhạc không quảng cáo", "Chuyển bài không giới hạn", "Tải nhạc offline"],
      suitable_for: ["Người yêu nhạc", "Gen Z"]
    },
    variants: [{ name: '1 Năm', price: 290000, orginalPrice: 590000 }]
  },
  {
    name: 'VieON VIP K+', 
    slug: 'vieon-vip-kplus', 
    categorySlug: 'entertainment',
    description: 'Gói giải trí tổng hợp hàng đầu Việt Nam. Xem trọn vẹn các giải thể thao đỉnh cao như Ngoại Hạng Anh, hệ thống kênh K+, cùng kho phim bộ Việt Nam, Hàn Quốc độc quyền với chất lượng hình ảnh Full HD siêu nét[cite: 26].',
    thumbnail: 'https://cdn.vieon.vn/vieon-logo.png',
    isHot: true, 
    avgRating: 4.6, 
    keywordNames: ["vieon", "k+", "phim"],
    aiMetadata: {
      keywords: ["vieon", "k+", "phim", "ngoại hạng anh"],
      features: ["Xem 4 kênh K+", "Phim bộ độc quyền", "Truyền hình trực tuyến"],
      suitable_for: ["Fan bóng đá", "Người yêu phim Việt"]
    },
    variants: [{ name: '1 Tháng VIP + K+', price: 169000, orginalPrice: 219000 }]
  },
  {
    name: 'Disney+ (Disney Plus)', 
    slug: 'disney-plus-premium', 
    categorySlug: 'entertainment',
    description: 'Khám phá vũ trụ điện ảnh Marvel, Star Wars, thế giới hoạt hình Pixar và các chương trình khám phá National Geographic. Hỗ trợ chất lượng hình ảnh 4K IMAX Enhanced mang lại trải nghiệm rạp phim ngay tại ngôi nhà của bạn[cite: 27].',
    thumbnail: 'https://res.cloudinary.com/diap7lvcv/image/upload/v1766675190/disney-1-1965833994_r90sfr.jpg',
    isHot: false, 
    avgRating: 4.7, 
    keywordNames: ["disney", "phim", "4k"],
    aiMetadata: {
      keywords: ["xem phim marvel", "disney plus", "phim hoạt hình"],
      features: ["Chất lượng 4K IMAX", "Không quảng cáo", "Tải phim offline"],
      suitable_for: ["Trẻ em", "Fan Marvel/Star Wars", "Gia đình"]
    },
    variants: [{ name: '1 Năm', price: 350000, orginalPrice: 1500000 }]
  },
  {
    name: 'Amazon Prime Video', 
    slug: 'prime-video', 
    categorySlug: 'entertainment',
    description: 'Nền tảng xem phim trực tuyến của Amazon với nhiều nội dung Originals độc quyền như The Boys, Fallout, Reacher. Hỗ trợ xem trên nhiều thiết bị với chất lượng 4K HDR sắc nét[cite: 28].',
    cite]thumbnail: 'https://m.media-amazon.com/images/G/01/prime/marketing/slashPrime/prime-video-logo._CB610223274_.png',
    isHot: false, 
    avgRating: 4.5, 
    keywordNames: ["amazon", "phim"],
    aiMetadata: {
      keywords: ["amazon prime", "phim độc quyền", "xem phim mỹ"],
      features: ["Nội dung Amazon Originals", "Chất lượng 4K HDR", "Hỗ trợ đa thiết bị"],
      suitable_for: ["Người yêu phim Mỹ", "Người dùng hệ sinh thái Amazon"]
    },
    variants: [{ name: '6 Tháng', price: 180000, orginalPrice: 600000 }]
  },
  {
    name: 'HBO Max (Max)', 
    slug: 'hbo-max', 
    categorySlug: 'entertainment',
    description: 'Thưởng thức toàn bộ thư viện nội dung đẳng cấp từ HBO với những siêu phẩm như Game of Thrones, Harry Potter, House of the Dragon. Trải nghiệm điện ảnh đỉnh cao với âm thanh và hình ảnh tiêu chuẩn quốc tế[cite: 28, 29].',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Max_2023_logo.svg/1200px-Max_2023_logo.svg.png',
    isHot: false, 
    avgRating: 4.8, 
    keywordNames: ["hbo", "phim"],
    aiMetadata: {
      keywords: ["hbo max", "phim hbo", "series đỉnh cao"],
      features: ["Xem trọn bộ Game of Thrones", "Phim bom tấn Warner Bros", "Chất lượng cao"],
      suitable_for: ["Fan HBO", "Người thích phim series"]
    },
    variants: [{ name: '1 Tháng', price: 60000, orginalPrice: 200000 }]
  },
  {
    name: 'Apple Music', 
    slug: 'apple-music', 
    categorySlug: 'entertainment',
    description: 'Dịch vụ nghe nhạc trực tuyến hàng đầu của Apple. Truy cập hàng triệu bài hát với chất lượng Lossless và Spatial Audio (âm thanh vòm) tuyệt đỉnh, mang lại cảm giác âm nhạc sống động và chân thực nhất[cite: 29].',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Apple_Music_logo.svg/1200px-Apple_Music_logo.svg.png',
    isHot: false, 
    avgRating: 4.7, 
    keywordNames: ["apple", "nhạc"],
    aiMetadata: {
      keywords: ["nghe nhạc apple", "spatial audio", "lossless music"],
      features: ["Âm thanh chất lượng cao", "Spatial Audio", "Tích hợp hệ sinh thái Apple"],
      suitable_for: ["Người dùng iPhone/iPad", "Audiophile cơ bản"]
    },
    variants: [{ name: '3 Tháng', price: 45000, orginalPrice: 177000 }]
  },
  {
    name: 'Crunchyroll Fan', 
    slug: 'crunchyroll', 
    categorySlug: 'entertainment',
    description: 'Thiên đường dành cho các tín đồ Anime. Xem các bộ phim mới nhất như One Piece, Naruto bản quyền ngay sau khi phát sóng tại Nhật Bản chỉ 1 giờ với chất lượng Full HD và không quảng cáo[cite: 30, 31].',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Crunchyroll_Logo.svg/1200px-Crunchyroll_Logo.svg.png',
    isHot: true, 
    avgRating: 4.8, 
    keywordNames: ["crunchyroll", "phim"],
    aiMetadata: {
      keywords: ["xem anime", "anime bản quyền", "one piece mới nhất"],
      features: ["Xem anime không quảng cáo", "Cập nhật siêu tốc", "Kho phim Anime lớn nhất"],
      suitable_for: ["Wibu", "Fan Anime"]
    },
    variants: [{ name: '1 Năm', price: 350000, orginalPrice: 1200000 }]
  },
  {
    name: 'Tidal HiFi Plus', 
    slug: 'tidal-hifi-plus-music', 
    categorySlug: 'entertainment',
    description: 'Dịch vụ âm nhạc dành riêng cho Audiophile. Cung cấp chất lượng âm thanh Master Quality Authenticated (MQA), Dolby Atmos và Sony 360 Reality Audio để bạn nghe nhạc đúng như ý đồ của nghệ sĩ trong phòng thu[cite: 32].',
    thumbnail: 'https://res.cloudinary.com/diap7lvcv/image/upload/v1766676233/tai-khoan-tidal-hifi-plus-1_lgfdrl.png',
    isHot: false, 
    avgRating: 4.6, 
    keywordNames: ["tidal", "nhạc"],
    aiMetadata: {
      keywords: ["nhạc lossless", "âm thanh hi-fi", "nhạc chất lượng cao", "audiophile"],
      features: ["Chất lượng MQA & Dolby Atmos", "Nghe nhạc không quảng cáo", "Hỗ trợ kết nối thiết bị chuyên dụng"],
      suitable_for: ["Người chơi âm thanh", "Người yêu thích nhạc chất lượng cao"]
    },
    variants: [{ name: '3 Tháng', price: 120000, orginalPrice: 500000 }]
  }
];