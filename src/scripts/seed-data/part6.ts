// prisma/seed-data/part6.ts

export const productsPart6 = [
  // ================= CATEGORY: EDUCATION & WORK =================
  {
    name: 'LinkedIn Learning', slug: 'linkedin-learning-premium', categorySlug: 'education',
    description: 'Nâng tầm sự nghiệp với kho tàng kiến thức khổng lồ từ LinkedIn Learning. Với hơn 16.000 khóa học được dẫn dắt bởi các chuyên gia đầu ngành trong các lĩnh vực Kinh doanh, Công nghệ và Sáng tạo, bạn có thể tự do lựa chọn lộ trình phát triển kỹ năng mềm hoặc kỹ năng chuyên môn. Sau khi hoàn thành mỗi khóa học, bạn sẽ nhận được chứng chỉ trực tiếp trên profile LinkedIn cá nhân, giúp gây ấn tượng mạnh mẽ với các nhà tuyển dụng hàng đầu.',
    thumbnail: 'https://res.cloudinary.com/diap7lvcv/image/upload/v1766676223/Tai-khoan-LinkedIn-Learning-The-Boring-Store_shvzvx.webp',
    isHot: false, avgRating: 4.6, keywordNames: ["linkedin", "study"],
    aiMetadata: {
      keywords: ["học kỹ năng chuyên môn", "chứng chỉ linkedin", "phát triển sự nghiệp"],
      features: ["Hơn 16.000 khóa học chuyên sâu", "Chứng chỉ hoàn thành chính thức", "Học offline trên ứng dụng di động"],
      suitable_for: ["Người đang tìm việc", "Quản lý dự án", "Nhân viên văn phòng"]
    },
    variants: [{ name: '1 Năm', price: 550000, orginalPrice: 3000000 }]
  },
  {
    name: 'Zoom Pro (Hội họp không giới hạn)', slug: 'zoom-pro-business', categorySlug: 'education',
    description: 'Giải pháp hội nghị trực tuyến hàng đầu cho doanh nghiệp và giáo dục. Gói Zoom Pro loại bỏ hoàn toàn giới hạn 40 phút của bản miễn phí, cho phép bạn tổ chức các cuộc họp kéo dài liên tục lên đến 30 giờ với sức chứa 100 người tham gia. Đi kèm với đó là các tính năng quản lý cuộc họp nâng cao, ghi âm cuộc họp lên đám mây và báo cáo chi tiết, giúp quy trình làm việc từ xa trở nên chuyên nghiệp và hiệu quả hơn bao giờ hết.',
    thumbnail: 'https://res.cloudinary.com/diap7lvcv/image/upload/v1766676222/zoompro_atp70k.webp',
    isHot: false, avgRating: 4.6, keywordNames: ["zoom", "study"],
    aiMetadata: {
      keywords: ["họp trực tuyến", "học online", "zoom bản quyền"],
      features: ["Họp không giới hạn thời gian", "Ghi hình đám mây", "Quản lý người tham gia chuyên sâu"],
      suitable_for: ["Giáo viên", "Chủ doanh nghiệp", "Nhóm làm việc từ xa"]
    },
    variants: [{ name: '1 Tháng', price: 150000, orginalPrice: 350000 }]
  },

  // ================= CATEGORY: DESIGN & CREATIVE =================
  {
    name: 'Envato Elements', slug: 'envato-elements-premium', categorySlug: 'design',
    description: 'Kho tài nguyên sáng tạo không giới hạn dành cho Designer và Editor chuyên nghiệp. Chỉ với một tài khoản, bạn có thể tải xuống hàng triệu tệp tin từ giao diện website (WordPress), mẫu video (After Effects, Premiere), âm nhạc không bản quyền, cho đến các phông chữ và đồ họa 3D đẳng cấp. Đây là "mỏ vàng" giúp bạn tối ưu hóa thời gian thực hiện dự án mà vẫn đảm bảo được chất lượng thẩm mỹ cao nhất cho khách hàng.',
    thumbnail: 'https://res.cloudinary.com/diap7lvcv/image/upload/v1766676218/evanto_eqqg80.png',
    isHot: true, avgRating: 4.8, keywordNames: ["envato", "design"],
    aiMetadata: {
      keywords: ["tài nguyên thiết kế", "wordpress theme", "video template", "stock footage"],
      features: ["Tải xuống không giới hạn", "Giấy phép thương mại rõ ràng", "Cập nhật tài nguyên mỗi ngày"],
      suitable_for: ["Web Developer", "Video Editor", "Agency quảng cáo"]
    },
    variants: [{ name: '1 Tháng (Share)', price: 150000, orginalPrice: 800000 }]
  },

  // ================= CATEGORY: SECURITY =================
  {
    name: 'Norton 360 Deluxe', slug: 'norton-360-deluxe', categorySlug: 'security',
    description: 'Giải pháp bảo mật đa lớp toàn diện giúp bảo vệ thiết bị của bạn trước các mối đe dọa trực tuyến phức tạp nhất. Norton 360 Deluxe không chỉ diệt virus mà còn tích hợp sẵn Secure VPN để bảo vệ quyền riêng tư khi truy cập Wi-Fi công cộng, tính năng SafeCam ngăn chặn hacker truy cập webcam trái phép và bộ nhớ sao lưu đám mây 50GB để bảo vệ các dữ liệu quan trọng nhất trước rủi ro bị mã hóa bởi Ransomware.',
    thumbnail: 'https://res.cloudinary.com/diap7lvcv/image/upload/v1766676217/norton_zygrc1.jpg',
    isHot: false, avgRating: 4.8, keywordNames: ["norton", "security"],
    aiMetadata: {
      keywords: ["diệt virus norton", "bảo mật webcam", "sao lưu dữ liệu", "vpn tích hợp"],
      features: ["Bảo vệ tối đa 3 thiết bị", "50GB Cloud Backup", "Trình quản lý mật khẩu an toàn"],
      suitable_for: ["Người dùng có nhiều thiết bị", "Gia đình cần bảo mật cao"]
    },
    variants: [{ name: '1 Năm / 3 Thiết bị', price: 290000, orginalPrice: 600000 }]
  },

  // ================= CATEGORY: ENTERTAINMENT =================
  {
    name: 'Tidal HiFi Plus', slug: 'tidal-hifi-plus-music', categorySlug: 'entertainment',
    description: 'Dịch vụ nghe nhạc dành riêng cho những người đam mê âm thanh chất lượng cao (Audiophile). Tidal HiFi Plus cung cấp định dạng Master Quality Authenticated (MQA) và Dolby Atmos, mang đến độ chi tiết âm thanh chân thực nhất như đang ngồi trong phòng thu. Không quảng cáo, hỗ trợ nghe offline và khả năng kết nối trực tiếp với các thiết bị âm thanh chuyên dụng giúp bạn tận hưởng âm nhạc một cách trọn vẹn và đẳng cấp nhất.',
    thumbnail: 'https://res.cloudinary.com/diap7lvcv/image/upload/v1766676233/tai-khoan-tidal-hifi-plus-1_lgfdrl.png',
    isHot: false, avgRating: 4.6, keywordNames: ["tidal", "nhạc"],
    aiMetadata: {
      keywords: ["nhạc lossless", "âm thanh hi-fi", "nhạc chất lượng cao", "audiophile"],
      features: ["Chất lượng MQA & Dolby Atmos", "Nghe nhạc không quảng cáo", "Hỗ trợ kết nối thiết bị chuyên dụng"],
      suitable_for: ["Người chơi âm thanh", "Người yêu thích nhạc chất lượng cao"]
    },
    variants: [{ name: '3 Tháng', price: 120000, orginalPrice: 500000 }]
  },

  // ================= CATEGORY: SYSTEM SOFTWARE =================
  {
    name: 'VMware Workstation Pro 17', slug: 'vmware-workstation-pro', categorySlug: 'software',
    description: 'Phần mềm tạo máy ảo mạnh mẽ nhất dành cho các kỹ sư hệ thống và lập trình viên. VMware Workstation Pro cho phép bạn chạy đồng thời nhiều hệ điều hành như Windows, Linux và các hệ thống máy chủ trên cùng một chiếc máy tính vật lý duy nhất. Đây là công cụ lý tưởng để thử nghiệm phần mềm trong các môi trường khác nhau, xây dựng mô hình mạng giả lập hoặc phát triển các ứng dụng đa nền tảng một cách an toàn và chuyên nghiệp.',
    thumbnail: 'https://res.cloudinary.com/diap7lvcv/image/upload/v1766676228/vmware_j5dcjo.png',
    isHot: false, avgRating: 4.8, keywordNames: ["vmware", "software"],
    aiMetadata: {
      keywords: ["máy ảo vps", "chạy linux trên windows", "test phần mềm"],
      features: ["Chạy nhiều hệ điều hành cùng lúc", "Hỗ trợ ảo hóa mạnh mẽ", "Kết nối mạng máy ảo chuyên sâu"],
      suitable_for: ["IT Admin", "DevOps", "Người nghiên cứu bảo mật"]
    },
    variants: [{ name: 'Key Vĩnh Viễn', price: 250000, orginalPrice: 4000000 }]
  }
];