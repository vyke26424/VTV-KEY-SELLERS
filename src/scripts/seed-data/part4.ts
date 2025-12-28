// prisma/seed-data/part4.ts

export const productsPart4 = [
  // ================= CATEGORY: EDUCATION & VPN (HỌC TẬP & VPN) =================
  {
    name: 'Duolingo Super', 
    slug: 'duolingo-super', 
    categorySlug: 'education',
    description: 'Nâng cấp trải nghiệm học ngoại ngữ của bạn lên một tầm cao mới với Duolingo Super. Gói dịch vụ cao cấp này giúp loại bỏ hoàn toàn các quảng cáo gây xao nhãng, cung cấp tính năng "trái tim vô hạn" để bạn có thể học tập liên tục mà không lo bị gián đoạn khi làm sai. Đặc biệt, bạn sẽ được truy cập vào các bài luyện tập cá nhân hóa được thiết kế riêng để giúp bạn khắc phục nhanh chóng các lỗi sai thường gặp, giúp việc ghi nhớ từ vựng và ngữ pháp trở nên hiệu quả hơn bao giờ hết.',
    thumbnail: 'https://res.cloudinary.com/diap7lvcv/image/upload/v1766675163/img-elsapro-lifetime-4096741723_mk9fee.jpg',
    isHot: true, 
    avgRating: 4.9, 
    keywordNames: ["duolingo", "study"],
    aiMetadata: {
      keywords: ["học tiếng anh", "ngoại ngữ", "app học tập"],
      features: ["Trái tim vô hạn", "Không quảng cáo", "Luyện tập lỗi sai"],
      suitable_for: ["Học sinh", "Người tự học ngoại ngữ"]
    },
    variants: [
      { name: '1 Tháng', price: 45000, orginalPrice: 150000 },
      { name: '6 Tháng', price: 120000, orginalPrice: 800000 },
      { name: '1 Năm (Family)', price: 180000, orginalPrice: 1500000 }
    ]
  },
  {
    name: 'NordVPN Premium', 
    slug: 'nord-vpn', 
    categorySlug: 'education',
    description: 'NordVPN là giải pháp bảo mật Internet hàng đầu thế giới, giúp bảo vệ tuyệt đối dữ liệu cá nhân và quyền riêng tư trực tuyến của bạn trước các mối đe dọa mạng. Với khả năng thay đổi địa chỉ IP sang hơn 60 quốc gia khác nhau, bạn có thể dễ dàng truy cập vào các nội dung bị chặn địa lý như Netflix US, Disney+ với tốc độ cực nhanh và ổn định. Dịch vụ hỗ trợ bảo vệ tối đa trên 6 thiết bị cùng lúc với công nghệ mã hóa tiên tiến, đảm bảo mọi hoạt động duyệt web của bạn luôn được ẩn danh.',
    thumbnail: 'https://i0.wp.com/software.centrix.asia/wp-content/uploads/unnamed.jpg?fit=512%2C512&ssl=1',
    isHot: true, 
    avgRating: 4.7, 
    keywordNames: ["nordvpn", "vpn", "ip"],
    aiMetadata: {
      keywords: ["fake ip", "bảo mật internet", "riêng tư"],
      features: ["Tốc độ cao", "Fake IP sang US/UK", "Bảo mật dữ liệu"],
      suitable_for: ["Người hay đi du lịch", "IT", "Xem phim nước ngoài"]
    },
    variants: [
      { name: '1 Tháng', price: 55000, orginalPrice: 250000 },
      { name: '6 Tháng', price: 160000, orginalPrice: 800000 },
      { name: '1 Năm', price: 250000, orginalPrice: 1400000 }
    ]
  },
  {
    name: 'ELSA Speak Pro', 
    slug: 'elsa-pro-lifetime', 
    categorySlug: 'education',
    description: 'Tự tin giao tiếp tiếng Anh như người bản xứ với ELSA Speak Pro, ứng dụng luyện phát âm hàng đầu thế giới tích hợp trí tuệ nhân tạo (AI). Công nghệ nhận diện giọng nói độc quyền giúp bạn phát hiện lỗi sai chính xác đến từng âm tiết và hướng dẫn cách sửa chi tiết. Với lộ trình học cá nhân hóa dựa trên trình độ của bạn và kho tàng hơn 7.000 bài học đa dạng chủ đề, ELSA là người bạn đồng hành không thể thiếu để cải thiện kỹ năng nói và phản xạ tiếng Anh một cách nhanh chóng nhất.',
    thumbnail: 'https://res.cloudinary.com/diap7lvcv/image/upload/v1766675163/img-elsapro-lifetime-4096741723_mk9fee.jpg',
    isHot: true, 
    avgRating: 4.8, 
    keywordNames: ["elsa", "study"],
    aiMetadata: {
      keywords: ["học tiếng anh", "phát âm chuẩn", "giao tiếp ai"],
      features: ["Công nghệ nhận diện giọng nói AI", "Phân tích lỗi sai chi tiết", "Học trọn đời không giới hạn"],
      suitable_for: ["Người mất gốc tiếng Anh", "Người chuẩn bị thi IELTS", "Người đi làm"]
    },
    variants: [
      { name: '1 Năm', price: 350000, orginalPrice: 900000 },
      { name: 'Trọn Đời', price: 890000, orginalPrice: 2500000 }
    ]
  },
  {
    name: 'Coursera Plus', 
    slug: 'coursera-plus-unlimited', 
    categorySlug: 'education',
    description: 'Coursera Plus là cánh cửa mở ra kho tàng tri thức vô tận từ các trường đại học và tổ chức giáo dục danh tiếng nhất hành tinh. Người dùng được quyền truy cập không giới hạn vào hơn 7.000 khóa học chuyên sâu, các dự án thực hành và chương trình đào tạo chuyên nghiệp. Sau khi hoàn thành, bạn sẽ nhận được chứng chỉ có giá trị toàn cầu từ các đối tác lớn như Google, IBM, Stanford hay Yale, giúp làm đẹp hồ sơ năng lực và mở ra nhiều cơ hội thăng tiến trong sự nghiệp quốc tế.',
    thumbnail: 'https://res.cloudinary.com/diap7lvcv/image/upload/v1766675823/Coursera-Plus-min-280x280_uutyer.png',
    isHot: false, 
    avgRating: 4.8, 
    keywordNames: ["coursera", "study"],
    aiMetadata: {
      keywords: ["học trực tuyến", "chứng chỉ quốc tế", "đào tạo từ xa"],
      features: ["Truy cập hơn 7000 khóa học", "Chứng chỉ không giới hạn", "Học từ các chuyên gia hàng đầu"],
      suitable_for: ["Người đi làm", "Sinh viên", "Người tự học chuyên sâu"]
    },
    variants: [
      { name: '1 Tháng', price: 350000, orginalPrice: 1200000 },
      { name: '1 Năm', price: 1900000, orginalPrice: 9000000 }
    ]
  },
  {
    name: 'Grammarly Premium', 
    slug: 'grammarly-premium', 
    categorySlug: 'education',
    description: 'Hoàn thiện kỹ năng viết lách tiếng Anh chuyên nghiệp với Grammarly Premium, trợ lý ngôn ngữ thông minh vượt xa các trình kiểm tra lỗi chính tả thông thường. Công cụ không chỉ giúp bạn sửa lỗi ngữ pháp phức tạp mà còn đưa ra các gợi ý thay đổi từ vựng tinh tế, điều chỉnh tông giọng bài viết phù hợp với ngữ cảnh (trang trọng, thân thiện) và tích hợp trình kiểm tra đạo văn chuyên sâu. Đây là giải pháp lý tưởng để viết email, bài luận hoặc các tài liệu kinh doanh một cách tự tin và chính xác.',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Grammarly_logo.svg/1200px-Grammarly_logo.svg.png',
    isHot: false, 
    avgRating: 4.8, 
    keywordNames: ["grammarly", "study"],
    aiMetadata: {
      keywords: ["sửa lỗi tiếng anh", "viết bài luận", "kiểm tra đạo văn"],
      features: ["Sửa lỗi ngữ pháp chuyên sâu", "Gợi ý tông giọng", "Check đạo văn"],
      suitable_for: ["Sinh viên", "Biên tập viên", "Người làm việc quốc tế"]
    },
    variants: [
      { name: '1 Tháng', price: 120000, orginalPrice: 500000 },
      { name: '6 Tháng', price: 350000, orginalPrice: 1500000 },
      { name: '1 Năm', price: 550000, orginalPrice: 3000000 }
    ]
  },
  {
    name: 'LinkedIn Learning', 
    slug: 'linkedin-learning-premium', 
    categorySlug: 'education',
    description: 'Phát triển kỹ năng chuyên môn và nâng tầm giá trị bản thân với hơn 16.000 khóa học chất lượng cao trên LinkedIn Learning. Toàn bộ nội dung được dẫn dắt bởi các chuyên gia đầu ngành trong nhiều lĩnh vực từ Kinh doanh, Công nghệ đến Sáng tạo. Sau khi hoàn thành khóa học, bạn có thể đăng tải chứng chỉ trực tiếp lên hồ sơ LinkedIn cá nhân, giúp thu hút sự chú ý của các nhà tuyển dụng và chuyên gia trong mạng lưới nghề nghiệp của mình.',
    thumbnail: 'https://res.cloudinary.com/diap7lvcv/image/upload/v1766676223/Tai-khoan-LinkedIn-Learning-The-Boring-Store_shvzvx.webp',
    isHot: false, 
    avgRating: 4.6, 
    keywordNames: ["linkedin", "study"],
    aiMetadata: {
      keywords: ["học kỹ năng chuyên môn", "chứng chỉ linkedin", "phát triển sự nghiệp"],
      features: ["Hơn 16.000 khóa học chuyên sâu", "Chứng chỉ hoàn thành chính thức", "Học offline trên di động"],
      suitable_for: ["Người đang tìm việc", "Quản lý dự án", "Nhân viên văn phòng"]
    },
    variants: [
      { name: '1 Tháng', price: 120000, orginalPrice: 600000 },
      { name: '6 Tháng', price: 350000, orginalPrice: 1800000 },
      { name: '1 Năm', price: 550000, orginalPrice: 3000000 }
    ]
  },
  {
    name: 'Zoom Pro', 
    slug: 'zoom-pro-business', 
    categorySlug: 'education',
    description: 'Zoom Pro là giải pháp hội họp và giảng dạy trực tuyến chuyên nghiệp nhất hiện nay. Với gói Pro, bạn hoàn toàn loại bỏ giới hạn 40 phút của bản miễn phí, cho phép tổ chức cuộc họp lên đến 30 giờ liên tục với sức chứa 100 người tham gia. Dịch vụ hỗ trợ đầy đủ các tính năng như ghi hình đám mây, báo cáo chi tiết về người tham dự và quản lý quyền kiểm soát cuộc họp nâng cao, giúp mọi buổi thảo luận của bạn diễn ra suôn sẻ và hiệu quả.',
    thumbnail: 'https://res.cloudinary.com/diap7lvcv/image/upload/v1766676222/zoompro_atp70k.webp',
    isHot: false, 
    avgRating: 4.6, 
    keywordNames: ["zoom", "study"],
    aiMetadata: {
      keywords: ["họp trực tuyến", "học online", "zoom bản quyền"],
      features: ["Họp không giới hạn thời gian", "Ghi hình đám mây", "100 người tham gia"],
      suitable_for: ["Giáo viên", "Chủ doanh nghiệp", "Nhóm làm việc từ xa"]
    },
    variants: [
      { name: '1 Tháng', price: 150000, orginalPrice: 350000 },
      { name: '6 Tháng', price: 750000, orginalPrice: 2100000 },
      { name: '1 Năm', price: 1250000, orginalPrice: 4200000 }
    ]
  },
  {
    name: 'ExpressVPN Premium', 
    slug: 'express-vpn-premium', 
    categorySlug: 'education',
    description: 'Được mệnh danh là dịch vụ VPN có tốc độ kết nối nhanh nhất thế giới, ExpressVPN mang đến khả năng bảo mật cấp quân sự với mã hóa AES-256 bit. Ứng dụng giúp bạn ẩn danh tuyệt đối trên không gian mạng, bảo vệ mọi thông tin cá nhân khỏi các hacker và cho phép truy cập mượt mà vào bất kỳ website hay dịch vụ stream phim nào bị chặn tại Việt Nam. Đây là lựa chọn hàng đầu cho những ai đề cao tốc độ, sự an toàn và tính ổn định tuyệt đối khi sử dụng Internet.',
    thumbnail: 'https://res.cloudinary.com/diap7lvcv/image/upload/v17666668/ExpressVPN-logo_ul55cu.png',
    isHot: false, 
    avgRating: 4.8, 
    keywordNames: ["expressvpn", "vpn"],
    aiMetadata: {
      keywords: ["vpn tốc độ cao", "ẩn ip", "bảo mật internet", "fake ip"],
      features: ["Băng thông không giới hạn", "Mã hóa AES-256 bit", "Bảo mật cấp quân sự"],
      suitable_for: ["Người làm việc từ xa", "Người xem phim nước ngoài", "Gamer giảm ping"]
    },
    variants: [
      { name: '1 Tháng', price: 65000, orginalPrice: 300000 },
      { name: '6 Tháng', price: 220000, orginalPrice: 1200000 },
      { name: 'Key Mobile 1 Năm', price: 350000, orginalPrice: 2000000 }
    ]
  }
];