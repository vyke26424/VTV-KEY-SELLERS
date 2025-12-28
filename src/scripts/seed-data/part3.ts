// prisma/seed-data/part3.ts

export const productsPart3 = [
  // ================= CATEGORY: ENTERTAINMENT (GIẢI TRÍ & PHIM ẢNH) =================
  {
    name: 'YouTube Premium', 
    slug: 'youtube-premium', 
    categorySlug: 'entertainment',
    description: 'Nâng tầm trải nghiệm giải trí số với YouTube Premium, giải pháp hoàn hảo để thưởng thức video không giới hạn mà không bị ngắt quãng bởi quảng cáo khó chịu. Sản phẩm hỗ trợ đầy đủ các tính năng cao cấp như chạy nền khi tắt màn hình hoặc chuyển ứng dụng, cho phép tải video ngoại tuyến để xem khi không có mạng. Đặc biệt, gói dịch vụ này bao gồm toàn bộ quyền lợi của YouTube Music Premium, mở ra kho nhạc khổng lồ với hàng triệu bài hát chất lượng cao để bạn tận hưởng mọi lúc mọi nơi.',
    thumbnail: 'https://res.cloudinary.com/diap7lvcv/image/upload/v1766673505/youtube_premium_kzunwo.png',
    isHot: true, 
    avgRating: 4.9, 
    keywordNames: ["youtube", "nhạc", "premium"],
    aiMetadata: {
      keywords: ["youtube không quảng cáo", "youtube music", "nâng cấp mail chính chủ", "ytb premium"],
      features: ["Nghe nhạc tắt màn hình", "Không quảng cáo", "Youtube Music Premium"], 
      suitable_for: ["Sinh viên", "Người hay nghe nhạc", "Gia đình"]
    },
    variants: [
      { name: '1 Tháng', price: 35000, orginalPrice: 79000 },
      { name: '6 Tháng', price: 149000, orginalPrice: 350000 },
      { name: '1 Năm', price: 279000, orginalPrice: 700000 }
    ]
  },
  {
    name: 'Netflix Premium 4K', 
    slug: 'netflix-premium', 
    categorySlug: 'entertainment',
    description: 'Tận hưởng rạp phim tại gia với tài khoản Netflix Premium chất lượng cao nhất, hỗ trợ độ phân giải 4K Ultra HD sắc nét và công nghệ âm thanh vòm Spatial Audio sống động. Bạn sẽ được truy cập vào kho phim bom tấn khổng lồ từ Hollywood, các series độc quyền (Netflix Originals) và những bộ phim tài liệu phong phú. Toàn bộ nội dung đều được tối ưu hóa với đầy đủ hệ thống phụ đề tiếng Việt chuẩn xác và thuyết minh chuyên nghiệp, mang lại trải nghiệm xem phim trọn vẹn nhất.',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/7/75/Netflix_icon.svg',
    isHot: true, 
    avgRating: 4.9, 
    keywordNames: ["netflix", "phim", "4k"],
    aiMetadata: {
      keywords: ["xem phim 4k", "netflix", "phim mỹ"],
      features: ["Chất lượng 4K Ultra HD", "Vietsub/Lồng tiếng", "Không quảng cáo"],
      suitable_for: ["Mọt phim", "Gia đình", "Cặp đôi"]
    },
    variants: [
      { name: '1 Tháng (Slot)', price: 85000, orginalPrice: 260000 },
      { name: '6 Tháng (Slot)', price: 480000, orginalPrice: 1560000 },
      { name: '1 Năm (Slot)', price: 900000, orginalPrice: 3120000 }
    ]
  },
  {
    name: 'Spotify Premium', 
    slug: 'spotify-premium', 
    categorySlug: 'entertainment',
    description: 'Dịch vụ nâng cấp tài khoản Spotify chính chủ giúp bạn đắm chìm trong không gian âm nhạc đỉnh cao với chất lượng âm thanh 320kbps cực kỳ chi tiết. Với gói Premium, người dùng có thể nghe nhạc không giới hạn, loại bỏ hoàn toàn quảng cáo và dễ dàng tải xuống các playlist yêu thích để nghe ngoại tuyến trên mọi thiết bị từ điện thoại đến máy tính. Đây là lựa chọn lý tưởng để cá nhân hóa gu âm nhạc và khám phá những nghệ sĩ mới mỗi ngày mà không gặp bất kỳ rào cản nào.',
    thumbnail: 'https://res.cloudinary.com/diap7lvcv/image/upload/v1766673506/spotify_qe10by.png',
    isHot: true, 
    avgRating: 4.8, 
    keywordNames: ["spotify", "nhạc"],
    aiMetadata: {
      keywords: ["nghe nhạc", "spotify", "âm thanh chất lượng cao"],
      features: ["Nghe nhạc không quảng cáo", "Chuyển bài không giới hạn", "Tải nhạc offline"],
      suitable_for: ["Người yêu nhạc", "Gen Z"]
    },
    variants: [
      { name: '1 Tháng', price: 35000, orginalPrice: 59000 },
      { name: '6 Tháng', price: 160000, orginalPrice: 354000 },
      { name: '1 Năm', price: 290000, orginalPrice: 590000 }
    ]
  },
  {
    name: 'VieON VIP K+', 
    slug: 'vieon-vip-kplus', 
    categorySlug: 'entertainment',
    description: 'Sở hữu gói giải trí tổng hợp hàng đầu Việt Nam, cho phép bạn theo dõi trọn vẹn các giải đấu thể thao kịch tính nhất hành tinh như Ngoại Hạng Anh thông qua hệ thống 4 kênh K+ chuyên biệt. Bên cạnh thể thao, VieON VIP còn cung cấp đặc quyền xem sớm và độc quyền kho phim bộ Việt Nam, Hàn Quốc, cùng các show thực tế hot nhất hiện nay với chất lượng hình ảnh Full HD siêu nét, đảm bảo đáp ứng mọi nhu cầu giải trí của các thành viên trong gia đình.',
    thumbnail: 'https://cdn.vieon.vn/vieon-logo.png',
    isHot: true, 
    avgRating: 4.6, 
    keywordNames: ["vieon", "k+", "phim"],
    aiMetadata: {
      keywords: ["vieon", "k+", "phim", "ngoại hạng anh"],
      features: ["Xem 4 kênh K+", "Phim bộ độc quyền", "Truyền hình trực tuyến"],
      suitable_for: ["Fan bóng đá", "Người yêu phim Việt"]
    },
    variants: [
      { name: '1 Tháng VIP + K+', price: 169000, orginalPrice: 219000 },
      { name: '6 Tháng VIP + K+', price: 950000, orginalPrice: 1314000 },
      { name: '1 Năm VIP + K+', price: 1750000, orginalPrice: 2628000 }
    ]
  },
  {
    name: 'Disney+ (Disney Plus)', 
    slug: 'disney-plus-premium', 
    categorySlug: 'entertainment',
    description: 'Mở ra cánh cửa khám phá thế giới giải trí huyền thoại từ Disney, bao gồm vũ trụ điện ảnh Marvel, trường ca Star Wars, thế giới hoạt hình đầy màu sắc của Pixar và các chương trình khám phá thiên nhiên kỳ thú từ National Geographic. Ứng dụng hỗ trợ công nghệ hình ảnh 4K IMAX Enhanced tiên tiên, giúp tái hiện không gian điện ảnh sống động ngay tại phòng khách của bạn. Bạn cũng có thể tải phim ngoại tuyến để thưởng thức cùng gia đình trong những chuyến đi mà không cần kết nối internet.',
    thumbnail: 'https://res.cloudinary.com/diap7lvcv/image/upload/v1766675190/disney-1-1965833994_r90sfr.jpg',
    isHot: false, 
    avgRating: 4.7, 
    keywordNames: ["disney", "phim", "4k"],
    aiMetadata: {
      keywords: ["xem phim marvel", "disney plus", "phim hoạt hình"],
      features: ["Chất lượng 4K IMAX", "Không quảng cáo", "Tải phim offline"],
      suitable_for: ["Trẻ em", "Fan Marvel/Star Wars", "Gia đình"]
    },
    variants: [
      { name: '1 Tháng', price: 55000, orginalPrice: 125000 },
      { name: '6 Tháng', price: 195000, orginalPrice: 750000 },
      { name: '1 Năm', price: 350000, orginalPrice: 1500000 }
    ]
  },
  {
    name: 'Amazon Prime Video', 
    slug: 'prime-video', 
    categorySlug: 'entertainment',
    description: 'Khám phá nền tảng xem phim trực tuyến hàng đầu của Amazon, nơi quy tụ hàng loạt nội dung Originals đình đám và độc quyền như The Boys, Fallout, Reacher mà bạn không thể tìm thấy ở đâu khác. Dịch vụ hỗ trợ trải nghiệm xem phim trên đa dạng thiết bị từ Smart TV đến điện thoại với chất lượng hình ảnh lên tới 4K HDR cực kỳ sắc nét. Đây là điểm đến lý tưởng cho những tín đồ yêu thích các series hành động, giả tưởng và phong cách làm phim đặc trưng của điện ảnh Mỹ.',
    thumbnail: 'https://m.media-amazon.com/images/G/01/prime/marketing/slashPrime/prime-video-logo._CB610223274_.png',
    isHot: false, 
    avgRating: 4.5, 
    keywordNames: ["amazon", "phim"],
    aiMetadata: {
      keywords: ["amazon prime", "phim độc quyền", "xem phim mỹ"],
      features: ["Nội dung Amazon Originals", "Chất lượng 4K HDR", "Hỗ trợ đa thiết bị"],
      suitable_for: ["Người yêu phim Mỹ", "Người dùng hệ sinh thái Amazon"]
    },
    variants: [
      { name: '1 Tháng', price: 45000, orginalPrice: 100000 },
      { name: '6 Tháng', price: 180000, orginalPrice: 600000 },
      { name: '1 Năm', price: 320000, orginalPrice: 1200000 }
    ]
  },
  {
    name: 'HBO Max (Max)', 
    slug: 'hbo-max', 
    categorySlug: 'entertainment',
    description: 'Thưởng thức toàn bộ thư viện nội dung đẳng cấp và lâu đời từ HBO, ngôi nhà của những siêu phẩm truyền hình mọi thời đại như Game of Thrones, Harry Potter và House of the Dragon. Với HBO Max, bạn sẽ được trải nghiệm chất lượng âm thanh và hình ảnh đạt tiêu chuẩn quốc tế, mang lại cảm giác chân thực trong từng khung hình. Gói dịch vụ cung cấp quyền truy cập vào các phim bom tấn mới nhất từ Warner Bros ngay sau khi ra rạp, đáp ứng đam mê của những mọt phim series thực thụ.',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Max_2023_logo.svg/1200px-Max_2023_logo.svg.png',
    isHot: false, 
    avgRating: 4.8, 
    keywordNames: ["hbo", "phim"],
    aiMetadata: {
      keywords: ["hbo max", "phim hbo", "series đỉnh cao"],
      features: ["Xem trọn bộ Game of Thrones", "Phim bom tấn Warner Bros", "Chất lượng cao"],
      suitable_for: ["Fan HBO", "Người thích phim series"]
    },
    variants: [
      { name: '1 Tháng', price: 60000, orginalPrice: 200000 },
      { name: '6 Tháng', price: 320000, orginalPrice: 1200000 },
      { name: '1 Năm', price: 590000, orginalPrice: 2400000 }
    ]
  },
  {
    name: 'Apple Music', 
    slug: 'apple-music', 
    categorySlug: 'entertainment',
    description: 'Dịch vụ nghe nhạc trực tuyến cao cấp từ Apple mang đến trải nghiệm âm thanh tuyệt hảo với hàng triệu bài hát ở định dạng Lossless chất lượng cao. Điểm nổi bật nhất chính là công nghệ Spatial Audio (âm thanh vòm) kết hợp với Dolby Atmos, giúp âm nhạc bao quanh bạn, tạo cảm giác sống động như đang ngồi giữa một buổi hòa nhạc trực tiếp. Apple Music tích hợp hoàn hảo vào hệ sinh thái Apple, cho phép bạn đồng bộ hóa và thưởng thức âm nhạc trên iPhone, iPad, Mac và Apple Watch một cách mượt mà.',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Apple_Music_logo.svg/1200px-Apple_Music_logo.svg.png',
    isHot: false, 
    avgRating: 4.7, 
    keywordNames: ["apple", "nhạc"],
    aiMetadata: {
      keywords: ["nghe nhạc apple", "spatial audio", "lossless music"],
      features: ["Âm thanh chất lượng cao", "Spatial Audio", "Tích hợp hệ sinh thái Apple"],
      suitable_for: ["Người dùng iPhone/iPad", "Audiophile cơ bản"]
    },
    variants: [
      { name: '1 Tháng', price: 25000, orginalPrice: 59000 },
      { name: '3 Tháng', price: 45000, orginalPrice: 177000 },
      { name: '1 Năm', price: 160000, orginalPrice: 708000 }
    ]
  },
  {
    name: 'Crunchyroll Fan', 
    slug: 'crunchyroll', 
    categorySlug: 'entertainment',
    description: 'Trở thành "Fan" cứng của cộng đồng Anime lớn nhất thế giới với Crunchyroll. Bạn sẽ được xem những tập phim mới nhất của các bộ Anime đình đám như One Piece, Naruto, Jujutsu Kaisen có bản quyền chỉ sau 1 giờ so với thời gian phát sóng tại Nhật Bản. Dịch vụ đảm bảo trải nghiệm xem phim mượt mà ở độ phân giải Full HD, hoàn toàn không có quảng cáo gây gián đoạn và hỗ trợ phụ đề đa ngôn ngữ, giúp bạn bắt kịp mọi diễn biến hấp dẫn của thế giới hoạt hình Nhật Bản một cách nhanh nhất.',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Crunchyroll_Logo.svg/1200px-Crunchyroll_Logo.svg.png',
    isHot: true, 
    avgRating: 4.8, 
    keywordNames: ["crunchyroll", "phim"],
    aiMetadata: {
      keywords: ["xem anime", "anime bản quyền", "one piece mới nhất"],
      features: ["Xem anime không quảng cáo", "Cập nhật siêu tốc", "Kho phim Anime lớn nhất"],
      suitable_for: ["Wibu", "Fan Anime"]
    },
    variants: [
      { name: '1 Tháng', price: 45000, orginalPrice: 100000 },
      { name: '6 Tháng', price: 195000, orginalPrice: 600000 },
      { name: '1 Năm', price: 350000, orginalPrice: 1200000 }
    ]
  },
  {
    name: 'Tidal HiFi Plus', 
    slug: 'tidal-hifi-plus-music', 
    categorySlug: 'entertainment',
    description: 'Lựa chọn số một dành cho các Audiophile chuyên nghiệp và những người yêu cầu khắt khe nhất về âm thanh. Tidal HiFi Plus cung cấp định dạng Master Quality Authenticated (MQA), cùng công nghệ Dolby Atmos và Sony 360 Reality Audio để mang lại chất lượng âm thanh thuần khiết, đúng như những gì nghệ sĩ đã thể hiện trong phòng thu. Người dùng có thể nghe nhạc không quảng cáo, hỗ trợ kết nối trực tiếp với các thiết bị giải mã (DAC) chuyên dụng, mở ra một chiều không gian âm nhạc chân thực và đẳng cấp nhất.',
    thumbnail: 'https://res.cloudinary.com/diap7lvcv/image/upload/v1766676233/tai-khoan-tidal-hifi-plus-1_lgfdrl.png',
    isHot: false, 
    avgRating: 4.6, 
    keywordNames: ["tidal", "nhạc"],
    aiMetadata: {
      keywords: ["nhạc lossless", "âm thanh hi-fi", "nhạc chất lượng cao", "audiophile"],
      features: ["Chất lượng MQA & Dolby Atmos", "Nghe nhạc không quảng cáo", "Hỗ trợ kết nối thiết bị chuyên dụng"],
      suitable_for: ["Người chơi âm thanh", "Người yêu thích nhạc chất lượng cao"]
    },
    variants: [
      { name: '1 Tháng', price: 50000, orginalPrice: 160000 },
      { name: '3 Tháng', price: 120000, orginalPrice: 500000 },
      { name: '1 Năm', price: 450000, orginalPrice: 1900000 }
    ]
  }
];