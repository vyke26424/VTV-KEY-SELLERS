// prisma/seed-data/part3.ts

export const productsPart3 = [
  // ================= CATEGORY: EDUCATION =================
  {
    name: 'Duolingo Super', slug: 'duolingo-super', categorySlug: 'education',
    description: 'Học ngoại ngữ không quảng cáo, trái tim vô hạn. Nâng cấp chính chủ.',
    thumbnail: 'https://banquyen88.vn/wp-content/uploads/2023/10/Nang-cap-Duolingo-Supper-1.png',
    isHot: true, avgRating: 4.9, keywordNames: ["duolingo", "study"],
    aiMetadata: {
      keywords: ["học tiếng anh", "ngoại ngữ", "app học tập"],
      features: ["Trái tim vô hạn", "Không quảng cáo", "Luyện tập lỗi sai"],
      suitable_for: ["Học sinh", "Người tự học ngoại ngữ"]
    },
    variants: [{ name: '1 Năm (Family)', price: 180000, orginalPrice: 1500000 }]
  },
  {
    name: 'NordVPN 1 Năm', slug: 'nord-vpn', categorySlug: 'education',
    description: 'VPN bảo mật tốt nhất. Xem Netflix US mượt mà. 6 thiết bị.',
    thumbnail: 'https://i0.wp.com/software.centrix.asia/wp-content/uploads/unnamed.jpg?fit=512%2C512&ssl=1',
    isHot: true, avgRating: 4.7, keywordNames: ["nordvpn", "vpn", "ip"],
    aiMetadata: {
      keywords: ["fake ip", "bảo mật internet", "riêng tư"],
      features: ["Tốc độ cao", "Fake IP sang US/UK", "Bảo mật dữ liệu"],
      suitable_for: ["Người hay đi du lịch", "IT", "Xem phim nước ngoài"]
    },
    variants: [{ name: 'Tài khoản 1 Năm', price: 250000, orginalPrice: 1400000 }]
  },

  // ================= CATEGORY: DESIGN =================
  {
    name: 'Canva Pro', slug: 'canva-pro', categorySlug: 'design',
    description: 'Tài khoản Canva Pro mở khóa full tính năng, xóa phông, template VIP.',
    thumbnail: 'https://digimarket.vn/thumbnails/products/large/uploads/canva-pro-icon-1.png.webp',
    isHot: true, avgRating: 4.9, keywordNames: ["canva", "design", "edit"],
    aiMetadata: {
      keywords: ["thiết kế online", "xóa phông", "làm slide"],
      features: ["Kho template Premium", "Xóa phông nền 1 chạm", "Magic Resize"],
      suitable_for: ["Marketer", "Sinh viên", "Content Creator"]
    },
    variants: [{ name: 'Nâng cấp Vĩnh Viễn', price: 150000, orginalPrice: 2000000 }]
  },
  {
    name: 'Adobe All Apps', slug: 'adobe-all-apps', categorySlug: 'design',
    description: 'Trọn bộ Adobe Creative Cloud: Photoshop, AI, Premiere... Cloud 100GB.',
    thumbnail: 'https://s7494.pcdn.co/byod/files/2022/06/adobe-creative-cloud-300x250.png',
    isHot: true, avgRating: 4.8, keywordNames: ["adobe", "photoshop", "design"],
    aiMetadata: {
      keywords: ["photoshop", "chỉnh sửa ảnh", "dựng phim", "đồ họa"],
      features: ["Full bộ 20+ App Adobe", "Cloud 100GB", "AI Generative Fill"],
      suitable_for: ["Designer chuyên nghiệp", "Editor", "Studio"]
    },
    variants: [{ name: '1 Năm (Chính chủ)', price: 1600000, orginalPrice: 8000000 }]
  },

  // ================= CATEGORY: SECURITY =================
  {
    name: 'Kaspersky Total Security', slug: 'kaspersky-ts', categorySlug: 'security',
    description: 'Phần mềm diệt virus tốt nhất. Bảo vệ thanh toán, chống ransomware.',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Kaspersky_logo.svg/1200px-Kaspersky_logo.svg.png',
    isHot: true, avgRating: 4.9, keywordNames: ["kaspersky", "dietvirus", "security"],
    aiMetadata: {
      keywords: ["diệt virus", "bảo mật", "chống hacker"],
      features: ["Chống Ransomware", "Bảo vệ thanh toán Online", "Nhẹ máy"],
      suitable_for: ["Máy tính cá nhân", "Kế toán", "Văn phòng"]
    },
    variants: [{ name: '1 Năm / 1 Thiết bị', price: 160000, orginalPrice: 300000 }]
  },
  {
    name: 'AdGuard License', slug: 'adguard', categorySlug: 'security',
    description: 'Chặn quảng cáo toàn hệ thống (Web, App). Chống theo dõi quyền riêng tư.',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/AdGuard_Logo.png/1200px-AdGuard_Logo.png',
    isHot: true, avgRating: 4.9, keywordNames: ["security"],
    aiMetadata: {
      keywords: ["chặn quảng cáo", "lọc web", "quyền riêng tư"],
      features: ["Chặn quảng cáo Youtube/Web", "Chặn theo dõi", "Tiết kiệm data"],
      suitable_for: ["Mọi người dùng Internet"]
    },
    variants: [{ name: 'Vĩnh Viễn / 1 PC', price: 250000, orginalPrice: 800000 }]
  }
];