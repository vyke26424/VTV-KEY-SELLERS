// prisma/seed-data/part2.ts

export const productsPart2 = [
  // ================= CATEGORY: GAME =================
  {
    name: 'Black Myth: Wukong', slug: 'black-myth-wukong', categorySlug: 'game',
    description: 'Siêu phẩm hành động nhập vai AAA lấy cảm hứng từ Tây Du Ký. Key Steam Global.',
    thumbnail: 'https://tintuc-divineshop.cdn.vccloud.vn/wp-content/uploads/2024/08/blackmyth-1723969364570.jpg',
    isHot: true, avgRating: 5.0, keywordNames: ["wukong", "game", "steam"],
    aiMetadata: {
      keywords: ["game hành động", "nhập vai", "tây du ký", "souls-like"],
      features: ["Đồ họa Unreal Engine 5", "Cốt truyện lôi cuốn", "Key Steam Global"],
      suitable_for: ["Gamer Hardcore", "Fan kiếm hiệp"]
    },
    variants: [{ name: 'Standard Edition', price: 1150000, orginalPrice: 1299000 }]
  },
  {
    name: 'Valorant Points (VP)', slug: 'valorant-points', categorySlug: 'game',
    description: 'Nạp VP giá rẻ, uy tín qua Riot ID. An toàn tuyệt đối 100%.',
    thumbnail: 'https://seeklogo.com/images/V/valorant-logo-FAB2CA0E55-seeklogo.com.png',
    isHot: true, avgRating: 4.9, keywordNames: ["valorant", "game", "napthe"],
    aiMetadata: {
      keywords: ["nạp game", "skin súng", "riot games"],
      features: ["Nạp qua Riot ID", "Nhận VP ngay lập tức", "An toàn không ban acc"],
      suitable_for: ["Game thủ Valorant"]
    },
    variants: [{ name: '2000 VP', price: 400000, orginalPrice: 450000 }]
  },
  {
    name: 'Steam Wallet 10$', slug: 'steam-wallet-10', categorySlug: 'game',
    description: 'Mã thẻ nạp tiền Steam 10 USD. Tự động quy đổi sang VNĐ. Code Global.',
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Steam_icon_logo.svg/2048px-Steam_icon_logo.svg.png',
    isHot: true, avgRating: 5.0, keywordNames: ["steam", "game", "napthe"],
    aiMetadata: {
      keywords: ["nạp steam", "mua game bản quyền", "thẻ steam"],
      features: ["Code Global", "Tự động quy đổi VNĐ", "Nạp an toàn"],
      suitable_for: ["Game thủ PC"]
    },
    variants: [{ name: '10 USD', price: 270000, orginalPrice: 300000 }]
  },

  // ================= CATEGORY: SOFTWARE =================
  {
    name: 'Windows 11 Pro', slug: 'windows-11-pro', categorySlug: 'software',
    description: 'Key kích hoạt Windows 11 Pro bản quyền vĩnh viễn. Update thoải mái.',
    thumbnail: 'https://keyoff.net/wp-content/uploads/2021/10/Key-Windows-11-gia-re.jpg',
    isHot: true, avgRating: 4.9, keywordNames: ["windows", "key", "microsoft"],
    aiMetadata: {
      keywords: ["key win 11", "bản quyền windows", "hệ điều hành"],
      features: ["Bản quyền vĩnh viễn", "Update chính hãng", "Kích hoạt online"],
      suitable_for: ["Người dùng PC", "Laptop mới", "Doanh nghiệp"]
    },
    variants: [{ name: 'Key Vĩnh Viễn', price: 150000, orginalPrice: 3500000 }]
  },
  {
    name: 'Office 365 Family', slug: 'office-365', categorySlug: 'software',
    description: 'Office bản quyền + 1TB OneDrive. Nâng cấp trên chính Email của bạn.',
    thumbnail: 'https://seeklogo.com/images/M/microsoft-office-365-logo-62374514EC-seeklogo.com.png',
    isHot: true, avgRating: 4.9, keywordNames: ["office", "microsoft", "google-drive"],
    aiMetadata: {
      keywords: ["word", "excel", "powerpoint", "lưu trữ đám mây"],
      features: ["Full bộ Office mới nhất", "1TB OneDrive", "Chia sẻ 5 thiết bị"],
      suitable_for: ["Gia đình", "Sinh viên", "Nhân viên văn phòng"]
    },
    variants: [{ name: '1 Năm (Slot)', price: 250000, orginalPrice: 1400000 }]
  },
  {
    name: 'IDM License Key', slug: 'idm-key', categorySlug: 'software',
    description: 'Phần mềm tăng tốc download số 1 thế giới. Key chính hãng bảo hành trọn đời.',
    thumbnail: 'https://3.bp.blogspot.com/-UlQVjpBhT44/Th3BOsfBGQI/AAAAAAAAAFM/Ww2qhQgqKI8/s1600/Internet_Download_Manager.jpg',
    isHot: true, avgRating: 4.9, keywordNames: ["idm", "key"],
    aiMetadata: {
      keywords: ["tải nhanh", "bắt link video", "download manager"],
      features: ["Tăng tốc download 500%", "Bắt link Youtube/Phim", "Key chính hãng trọn đời"],
      suitable_for: ["Người hay tải phim", "Game thủ"]
    },
    variants: [{ name: 'Key Trọn Đời', price: 430000, orginalPrice: 600000 }]
  }
];