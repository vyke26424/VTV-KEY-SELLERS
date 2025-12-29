// prisma/seed-data/part5.ts

export const productsPart5 = [
  // ================= CATEGORY: DESIGN (THIẾT KẾ & ĐỒ HỌA) =================
  {
    name: 'Canva Pro', 
    slug: 'canva-pro', 
    categorySlug: 'design',
    description: 'Canva Pro là công cụ thiết kế đồ họa trực tuyến mạnh mẽ và phổ biến nhất hiện nay, được tối ưu hóa cho cả những người không chuyên. Khi nâng cấp tài khoản Pro, bạn sẽ mở khóa kho tài nguyên khổng lồ với hàng triệu hình ảnh stock, video chất lượng cao và phông chữ cao cấp. Đặc biệt, người dùng Pro được sở hữu các tính năng độc quyền như xóa phông nền tự động bằng AI chỉ với một cú nhấp chuột, bộ công cụ Magic Resize để thay đổi kích thước thiết kế linh hoạt cho mọi nền tảng mạng xã hội và khả năng quản lý bộ nhận diện thương hiệu nhất quán.',
    thumbnail: 'https://digimarket.vn/thumbnails/products/large/uploads/canva-pro-icon-1.png.webp',
    isHot: true, 
    avgRating: 4.9, 
    keywordNames: ["canva", "design", "edit"],
    aiMetadata: {
      keywords: ["thiết kế online", "xóa phông", "làm slide"],
      features: ["Kho template Premium", "Xóa phông nền 1 chạm", "Magic Resize"],
      suitable_for: ["Marketer", "Sinh viên", "Content Creator"]
    },
    variants: [{ name: 'Nâng cấp Vĩnh Viễn', price: 150000, orginalPrice: 900000 }]
  },
  {
    name: 'Adobe All Apps', 
    slug: 'adobe-all-apps', 
    categorySlug: 'design',
    description: 'Trọn bộ Adobe Creative Cloud là giải pháp sáng tạo toàn diện nhất dành cho các nhà thiết kế chuyên nghiệp. Gói dịch vụ này cung cấp quyền truy cập vào hơn 20 ứng dụng hàng đầu ngành công nghiệp như Photoshop (chỉnh sửa ảnh), Illustrator (thiết kế vector), Premiere Pro (dựng phim), After Effects (hiệu ứng hình ảnh) và Acrobat Pro. Tài khoản đi kèm với 100GB lưu trữ đám mây để đồng bộ dự án mọi lúc mọi nơi, cùng quyền trải nghiệm sớm các tính năng AI Generative Fill tiên tiến nhất từ Adobe Firefly, giúp biến ý tưởng thành hiện thực chỉ bằng các câu lệnh văn bản đơn giản.',
    thumbnail: 'https://res.cloudinary.com/diap7lvcv/image/upload/v1767000637/ADOBE_pobkrt.png',
    isHot: true, 
    avgRating: 4.8, 
    keywordNames: ["adobe", "photoshop", "design"],
    aiMetadata: {
      keywords: ["photoshop", "chỉnh sửa ảnh", "dựng phim", "đồ họa"],
      features: ["Full bộ 20+ App Adobe", "Cloud 100GB", "AI Generative Fill"],
      suitable_for: ["Designer chuyên nghiệp", "Editor", "Studio"]
    },
    variants: [{ name: '1 Năm (Chính chủ)', price: 1600000, orginalPrice: 5000000 }]
  },
  {
    name: 'CapCut Pro (Toàn diện)', 
    slug: 'capcut-pro-full', 
    categorySlug: 'design',
    description: 'CapCut Pro là phiên bản nâng cấp mạnh mẽ nhất của ứng dụng dựng video ngắn hot nhất toàn cầu hiện nay. Bằng việc nâng cấp lên gói Pro, bạn sẽ được mở khóa toàn bộ kho hiệu ứng VIP, bộ lọc màu điện ảnh và các tính năng hỗ trợ bởi trí tuệ nhân tạo (AI) thông minh như tự động xóa vật thể thừa, làm nét video chất lượng thấp và tạo phụ đề tự động chính xác tuyệt đối. CapCut Pro hỗ trợ quy trình làm việc chuyên nghiệp với khả năng đồng bộ dự án mượt mà giữa các thiết bị điện thoại và máy tính, giúp các nhà sáng tạo nội dung TikTok, YouTube và Facebook tiết kiệm tối đa thời gian biên tập.',
    thumbnail: 'https://res.cloudinary.com/diap7lvcv/image/upload/v1766675822/capcut_mfyyni.png',
    isHot: true, 
    avgRating: 4.9, 
    keywordNames: ["capcut", "edit", "design"],
    aiMetadata: {
      keywords: ["dựng video tiktok", "edit video chuyên nghiệp", "hiệu ứng vip"],
      features: ["Mở khóa tính năng AI nâng cao", "Xóa logo CapCut", "Đồng bộ đa nền tảng"],
      suitable_for: ["Content Creator", "YouTuber", "Editor"]
    },
    variants: [{ name: '1 Năm', price: 350000, orginalPrice: 700000 }]
  },
  {
    name: 'Freepik Premium (Cá nhân)', 
    slug: 'freepik-premium-private', 
    categorySlug: 'design',
    description: 'Freepik Premium là kho tài nguyên đồ họa khổng lồ không thể thiếu dành cho các nhà thiết kế và Agency Marketing. Với tài khoản Premium, bạn có quyền truy cập và tải xuống không giới hạn hàng triệu tệp Vector, PSD chất lượng cao, ảnh Stock bản quyền và các mẫu icon phong phú. Ưu điểm lớn nhất của gói Premium là khả năng sử dụng tài nguyên cho các dự án thương mại mà không cần ghi công tác giả, giúp tối ưu hóa tiến độ công việc và nâng tầm chuyên nghiệp cho mọi bản thiết kế hàng ngày của bạn.',
    thumbnail: 'https://res.cloudinary.com/diap7lvcv/image/upload/v1767000649/FREEPIK_smsqol.png',
    isHot: false, 
    avgRating: 4.7, 
    keywordNames: ["freepik", "design"],
    aiMetadata: {
      keywords: ["tài nguyên thiết kế", "ảnh stock", "vector premium"],
      features: ["Tải xuống không giới hạn", "Không cần ghi công", "Giấy phép thương mại"],
      suitable_for: ["Designer", "Freelancer", "Agency Marketing"]
    },
    variants: [{ name: '1 Năm (ID riêng)', price: 750000, orginalPrice: 2500000 }]
  },
  {
    name: 'Envato Elements', 
    slug: 'envato-elements-premium', 
    categorySlug: 'design',
    description: 'Envato Elements là dịch vụ đăng ký tài nguyên sáng tạo "tất cả trong một" tốt nhất thế giới hiện nay dành cho cộng đồng Designer và Web Developer. Chỉ với một khoản phí cố định, bạn được sở hữu quyền tải xuống không giới hạn hơn 6 triệu tài nguyên số, từ theme WordPress chuyên nghiệp, template video cho After Effects, Premiere, cho đến âm nhạc không bản quyền và các mẫu đồ họa 3D ấn tượng. Đây là công cụ đắc lực giúp tối ưu hóa ngân sách và đẩy nhanh thời gian hoàn thành cho các dự án thiết kế từ cá nhân đến doanh nghiệp.',
    thumbnail: 'https://res.cloudinary.com/diap7lvcv/image/upload/v1766676218/evanto_eqqg80.png',
    isHot: true, 
    avgRating: 4.8, 
    keywordNames: ["envato", "design"],
    aiMetadata: {
      keywords: ["wordpress theme", "video template", "tài nguyên đồ họa"],
      features: ["Tải xuống không giới hạn", "Giấy phép thương mại rõ ràng", "Update mỗi ngày"],
      suitable_for: ["Web Developer", "Video Editor", "Agency quảng cáo"]
    },
    variants: [{ name: '1 Tháng (Share)', price: 150000, orginalPrice: 400000 }]
  },
  {
    name: 'Figma Professional Plan', 
    slug: 'figma-pro-subscription', 
    categorySlug: 'design',
    description: 'Figma Professional Plan là công cụ thiết kế giao diện (UI/UX) chuẩn mực nhất cho các đội ngũ làm sản phẩm hiện đại. Hoạt động hoàn toàn trên nền tảng đám mây, Figma Pro cho phép cộng tác thời gian thực không giới hạn giữa Designer, Developer và Stakeholder. Gói Professional mở khóa các tính năng thiết yếu như lịch sử phiên bản không giới hạn, xây dựng thư viện nhóm dùng chung (Team Libraries) và các thư mục dự án riêng tư. Điều này giúp quy trình thiết kế từ ý tưởng ban đầu đến khi bàn giao mã nguồn cho lập trình viên trở nên nhất quán và hiệu quả tuyệt đối.',
    thumbnail: 'https://res.cloudinary.com/diap7lvcv/image/upload/v1766676663/figma-professional-png_alectu.webp',
    isHot: false, 
    avgRating: 4.9, 
    keywordNames: ["figma", "design"],
    aiMetadata: {
      keywords: ["thiết kế ui ux", "thiết kế web", "figma pro"],
      features: ["Lịch sử phiên bản vô hạn", "Thư viện nhóm nâng cao", "Cộng tác thời gian thực"],
      suitable_for: ["UI/UX Designer", "Product Manager", "Dev Team"]
    },
    variants: [{ name: 'Nâng cấp 1 Năm', price: 450000, orginalPrice: 500000 }]
  },
  {
    name: 'Pikbest Premium', 
    slug: 'pikbest-premium-pro', 
    categorySlug: 'design',
    description: 'Pikbest Premium là nền tảng cung cấp tài nguyên đồ họa chất lượng cao với phong cách thiết kế hiện đại, tinh tế và đa dạng các chủ đề mang bản sắc châu Á. Tại đây, bạn có thể tìm thấy hàng ngàn mẫu thiết kế Powerpoint chuyên nghiệp cho công việc thuyết trình, các mẫu quảng cáo sáng tạo, hiệu ứng âm thanh và video intro ấn tượng. Pikbest giúp các nhà thiết kế và nhân viên văn phòng dễ dàng tìm thấy nguồn cảm hứng, từ đó tạo ra những sản phẩm truyền thông thu hút chỉ trong thời gian ngắn mà vẫn đảm bảo được tính thẩm mỹ cao nhất.',
    thumbnail: 'https://res.cloudinary.com/diap7lvcv/image/upload/v1767000704/PIKBEST_lv8kl6.png',
    isHot: false, 
    avgRating: 4.5, 
    keywordNames: ["pikbest", "design"],
    aiMetadata: {
      keywords: ["template powerpoint", "poster quảng cáo", "tài nguyên thiết kế"],
      features: ["Tải template Powerpoint VIP", "PSD/Vector chọn lọc", "Dễ dàng chỉnh sửa"],
      suitable_for: ["Giáo viên", "Nhân viên văn phòng", "Designer"]
    },
    variants: [{ name: '1 Năm', price: 390000, orginalPrice: 700000 }]
  },
  {
    name: 'Lightroom Presets Pack', 
    slug: 'lr-presets-full-pack', 
    categorySlug: 'design',
    description: 'Gói Lightroom Presets Full Pack là bộ sưu tập tinh hoa gồm hơn 5.000 công thức chỉnh màu chuyên nghiệp được thiết kế bởi các nhiếp ảnh gia hàng đầu. Thay vì phải mất hàng giờ tự tay điều chỉnh các thông số phức tạp, bạn chỉ cần áp dụng các Preset này để biến những bức ảnh thô trở thành tác phẩm nghệ thuật có màu sắc điện ảnh, cổ điển hoặc hiện đại chỉ sau một lần chạm. Bộ sản phẩm tương thích hoàn hảo cho cả phiên bản Lightroom trên máy tính và ứng dụng di động, đi kèm với lộ trình cập nhật liên tục các xu hướng màu sắc mới nhất của năm.',
    thumbnail: 'https://res.cloudinary.com/diap7lvcv/image/upload/v1767000645/LIGHTROOM_qh4cta.webp',
    isHot: false, 
    avgRating: 4.7, 
    keywordNames: ["lightroom", "edit"],
    aiMetadata: {
      keywords: ["chỉnh ảnh mobile", "màu lightroom", "presets đẹp"],
      features: ["Hơn 5000+ Presets chọn lọc", "Dùng cho cả PC và Mobile", "Update liên tục"],
      suitable_for: ["Nhiếp ảnh gia", "Travel Blogger", "Người dùng cá nhân"]
    },
    variants: [{ name: 'Full Pack', price: 399000, orginalPrice: 500000 }]
  }
];