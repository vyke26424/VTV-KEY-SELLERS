// prisma/seed-data/part5.ts

export const productsPart5 = [
  // ================= CATEGORY: DESIGN (THIẾT KẾ & ĐỒ HỌA) =================
  {
    name: 'Canva Pro', 
    slug: 'canva-pro', 
    categorySlug: 'design',
    description: 'Công cụ thiết kế đồ họa trực tuyến phổ biến nhất thế giới dành cho người không chuyên. Tài khoản Canva Pro mở khóa hàng triệu hình ảnh stock, video, phông chữ cao cấp và đặc biệt là tính năng xóa phông nền bằng một cú nhấp chuột cùng bộ công cụ Magic Resize thông minh.',
    thumbnail: 'https://digimarket.vn/thumbnails/products/large/uploads/canva-pro-icon-1.png.webp',
    isHot: true, 
    avgRating: 4.9, 
    keywordNames: ["canva", "design", "edit"],
    aiMetadata: {
      keywords: ["thiết kế online", "xóa phông", "làm slide"],
      features: ["Kho template Premium", "Xóa phông nền 1 chạm", "Magic Resize"],
      suitable_for: ["Marketer", "Sinh viên", "Content Creator"]
    },
    variants: [{ name: 'Nâng cấp Vĩnh Viễn', price: 150000, orginalPrice: 2000000 }]
  },
  {
    name: 'Adobe All Apps', 
    slug: 'adobe-all-apps', 
    categorySlug: 'design',
    description: 'Trọn bộ giải pháp sáng tạo chuyên nghiệp từ Adobe. Bao gồm hơn 20 ứng dụng hàng đầu như Photoshop, Illustrator, Premiere Pro, After Effects và Acrobat Pro. Tài khoản đi kèm 100GB lưu trữ đám mây và quyền truy cập vào các tính năng AI Generative Fill tiên tiến nhất.',
    thumbnail: 'https://s7494.pcdn.co/byod/files/2022/06/adobe-creative-cloud-300x250.png',
    isHot: true, 
    avgRating: 4.8, 
    keywordNames: ["adobe", "photoshop", "design"],
    aiMetadata: {
      keywords: ["photoshop", "chỉnh sửa ảnh", "dựng phim", "đồ họa"],
      features: ["Full bộ 20+ App Adobe", "Cloud 100GB", "AI Generative Fill"],
      suitable_for: ["Designer chuyên nghiệp", "Editor", "Studio"]
    },
    variants: [{ name: '1 Năm (Chính chủ)', price: 1600000, orginalPrice: 8000000 }]
  },
  {
    name: 'CapCut Pro (Toàn diện)', 
    slug: 'capcut-pro-full', 
    categorySlug: 'design',
    description: 'Phiên bản cao cấp nhất của ứng dụng dựng video hot nhất hiện nay. Mở khóa toàn bộ các hiệu ứng VIP, bộ lọc màu điện ảnh và các tính năng AI thông minh như tự động xóa vật thể, làm nét video và phụ đề tự động. Hỗ trợ đồng bộ dự án mượt mà giữa điện thoại và máy tính.',
    thumbnail: 'https://res.cloudinary.com/diap7lvcv/image/upload/v1766675822/capcut_mfyyni.png',
    isHot: true, 
    avgRating: 4.9, 
    keywordNames: ["capcut", "edit", "design"],
    aiMetadata: {
      keywords: ["dựng video tiktok", "edit video chuyên nghiệp", "hiệu ứng vip"],
      features: ["Mở khóa tính năng AI nâng cao", "Xóa logo CapCut", "Đồng bộ đa nền tảng"],
      suitable_for: ["Content Creator", "YouTuber", "Editor"]
    },
    variants: [{ name: '1 Năm', price: 350000, orginalPrice: 900000 }]
  },
  {
    name: 'Freepik Premium (Cá nhân)', 
    slug: 'freepik-premium-private', 
    categorySlug: 'design',
    description: 'Kho tài nguyên khổng lồ dành cho dân thiết kế với hàng triệu Vector, tệp PSD chất lượng cao và ảnh Stock bản quyền. Với tài khoản Premium, bạn có thể tải xuống không giới hạn tài nguyên mà không cần ghi công tác giả, giúp đẩy nhanh tiến độ công việc thiết kế hàng ngày.',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Freepik_logo.svg/2560px-Freepik_logo.svg.png',
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
    description: 'Dịch vụ đăng ký tất cả trong một cho các chuyên gia sáng tạo. Cung cấp quyền tải xuống không giới hạn hàng triệu theme WordPress, template video, âm nhạc không bản quyền và đồ họa 3D. Đây là công cụ đắc lực giúp tối ưu hóa ngân sách và thời gian cho mọi dự án lớn nhỏ.',
    thumbnail: 'https://res.cloudinary.com/diap7lvcv/image/upload/v1766676218/evanto_eqqg80.png',
    isHot: true, 
    avgRating: 4.8, 
    keywordNames: ["envato", "design"],
    aiMetadata: {
      keywords: ["wordpress theme", "video template", "tài nguyên đồ họa"],
      features: ["Tải xuống không giới hạn", "Giấy phép thương mại rõ ràng", "Update mỗi ngày"],
      suitable_for: ["Web Developer", "Video Editor", "Agency quảng cáo"]
    },
    variants: [{ name: '1 Tháng (Share)', price: 150000, orginalPrice: 800000 }]
  },
  {
    name: 'Figma Professional Plan', 
    slug: 'figma-pro-subscription', 
    categorySlug: 'design',
    description: 'Công cụ thiết kế giao diện (UI/UX) hàng đầu thế giới hoạt động trên trình duyệt. Gói Professional mở khóa lịch sử phiên bản không giới hạn, thư viện nhóm dùng chung và các thư mục dự án riêng tư, giúp quá trình cộng tác giữa Designer và Developer trở nên hoàn hảo.',
    thumbnail: 'https://res.cloudinary.com/diap7lvcv/image/upload/v1766676663/figma-professional-png_alectu.webp',
    isHot: false, 
    avgRating: 4.9, 
    keywordNames: ["figma", "design"],
    aiMetadata: {
      keywords: ["thiết kế ui ux", "thiết kế web", "figma pro"],
      features: ["Lịch sử phiên bản vô hạn", "Thư viện nhóm nâng cao", "Cộng tác thời gian thực"],
      suitable_for: ["UI/UX Designer", "Product Manager", "Dev Team"]
    },
    variants: [{ name: 'Nâng cấp 1 Năm', price: 450000, orginalPrice: 3000000 }]
  },
  {
    name: 'Pikbest Premium', 
    slug: 'pikbest-premium-pro', 
    categorySlug: 'design',
    description: 'Nền tảng cung cấp các mẫu thiết kế Powerpoint, quảng cáo sáng tạo và âm thanh hiệu ứng mang phong cách châu Á đặc trưng. Pikbest giúp bạn tìm kiếm cảm hứng và tài liệu thiết kế chất lượng cao để tạo ra những bài thuyết trình hoặc chiến dịch marketing ấn tượng.',
    thumbnail: 'https://seeklogo.com/images/P/pikbest-logo-3841C52608-seeklogo.com.png',
    isHot: false, 
    avgRating: 4.5, 
    keywordNames: ["pikbest", "design"],
    aiMetadata: {
      keywords: ["template powerpoint", "poster quảng cáo", "tài nguyên thiết kế"],
      features: ["Tải template Powerpoint VIP", "PSD/Vector chọn lọc", "Dễ dàng chỉnh sửa"],
      suitable_for: ["Giáo viên", "Nhân viên văn phòng", "Designer"]
    },
    variants: [{ name: '1 Năm', price: 390000, orginalPrice: 2000000 }]
  },
  {
    name: 'Lightroom Presets Pack', 
    slug: 'lr-presets-full-pack', 
    categorySlug: 'design',
    description: 'Bộ sưu tập hơn 5.000 màu chỉnh ảnh (Presets) chuyên nghiệp dành cho Adobe Lightroom. Giúp bạn biến hóa bức ảnh thô thành tác phẩm nghệ thuật chỉ với một lần chạm, tương thích hoàn hảo cho cả phiên bản Lightroom trên máy tính và điện thoại di động.',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Adobe_Photoshop_Lightroom_CC_logo.svg/2101px-Adobe_Photoshop_Lightroom_CC_logo.svg.png',
    isHot: false, 
    avgRating: 4.7, 
    keywordNames: ["lightroom", "edit"],
    aiMetadata: {
      keywords: ["chỉnh ảnh mobile", "màu lightroom", "presets đẹp"],
      features: ["Hơn 5000+ Presets chọn lọc", "Dùng cho cả PC và Mobile", "Update liên tục"],
      suitable_for: ["Nhiếp ảnh gia", "Travel Blogger", "Người dùng cá nhân"]
    },
    variants: [{ name: 'Full Pack', price: 99000, orginalPrice: 500000 }]
  }
];