// prisma/seed-data/part1.ts

export const productsPart1 = [
  // ================= CATEGORY: GAME =================
  {
    name: 'Black Myth: Wukong', 
    slug: 'black-myth-wukong', 
    categorySlug: 'game',
    description: 'Siêu phẩm hành động nhập vai AAA lấy cảm hứng từ Tây Du Ký. Key Steam Global.',
    thumbnail: 'https://tintuc-divineshop.cdn.vccloud.vn/wp-content/uploads/2024/08/blackmyth-1723969364570.jpg',
    isHot: true, 
    avgRating: 5.0, 
    keywordNames: ["wukong", "game", "steam"],
    aiMetadata: {
      keywords: ["game hành động", "nhập vai", "tây du ký", "souls-like"],
      features: ["Đồ họa Unreal Engine 5", "Cốt truyện lôi cuốn", "Key Steam Global"],
      suitable_for: ["Gamer Hardcore", "Fan kiếm hiệp"]
    },
    variants: [{ name: 'Standard Edition', price: 1150000, orginalPrice: 1299000 }]
  },
  {
    name: 'GTA V Premium', 
    slug: 'gta-5-premium', 
    categorySlug: 'game',
    description: 'Huyền thoại thế giới mở. Bao gồm GTA Online + Starter Pack.',
    thumbnail: 'https://res.cloudinary.com/diap7lvcv/image/upload/v1766999223/Grand_Theft_Auto_V_DVD_cover_hdx8b2.jpg',
    isHot: true, 
    avgRating: 4.9, 
    keywordNames: ["gta", "game", "steam"],
    aiMetadata: {
      keywords: ["gta v", "rockstar games", "game thế giới mở"],
      features: ["GTA Online included", "Criminal Enterprise Starter Pack", "Premium Edition content"],
      suitable_for: ["Gamer thích tự do", "Fan hành động"]
    },
    variants: [{ name: 'Premium Edition', price: 230000, orginalPrice: 450000 }]
  },
  {
    name: 'Minecraft Java & Bedrock', 
    slug: 'minecraft-pc', 
    categorySlug: 'game',
    description: 'Game sinh tồn sáng tạo hay nhất. Key bản quyền Microsoft chính hãng.',
    thumbnail: 'https://res.cloudinary.com/diap7lvcv/image/upload/v1766999319/Minecraft-Java-and-Bedrock-Edition_ox0jph.jpg',
    isHot: true, 
    avgRating: 4.9, 
    keywordNames: ["minecraft", "game"],
    aiMetadata: {
      keywords: ["xây dựng", "sinh tồn", "sandbox"],
      features: ["Bao gồm cả bản Java và Bedrock", "Chơi đa nền tảng", "Cập nhật vĩnh viễn"],
      suitable_for: ["Trẻ em", "Người thích sáng tạo"]
    },
    variants: [{ name: 'Key Global', price: 490000, orginalPrice: 750000 }]
  },
  {
    name: 'Valorant Points (VP)', 
    slug: 'valorant-points', 
    categorySlug: 'game',
    description: 'Nạp VP giá rẻ, uy tín qua Riot ID. An toàn tuyệt đối 100%.',
    thumbnail: 'https://res.cloudinary.com/diap7lvcv/image/upload/v1766673863/valorant_s1faqi.png',
    isHot: true, 
    avgRating: 4.9, 
    keywordNames: ["valorant", "game", "napthe"],
    aiMetadata: {
      keywords: ["nạp game", "skin súng", "riot games"],
      features: ["Nạp qua Riot ID", "Nhận VP ngay lập tức", "An toàn không ban acc"],
      suitable_for: ["Game thủ Valorant"]
    },
    variants: [{ name: '2000 VP', price: 400000, orginalPrice: 450000 }]
  },
  {
    name: 'Steam Wallet 10$', 
    slug: 'steam-wallet-10', 
    categorySlug: 'game',
    description: 'Mã thẻ nạp tiền Steam 10 USD. Tự động quy đổi sang VNĐ. Code Global.',
    thumbnail: 'https://res.cloudinary.com/diap7lvcv/image/upload/v1766673864/steamwallet_ck25er.jpg',
    isHot: true, 
    avgRating: 5.0, 
    keywordNames: ["steam", "game", "napthe"],
    aiMetadata: {
      keywords: ["nạp steam", "mua game bản quyền", "thẻ steam"],
      features: ["Code Global", "Tự động quy đổi VNĐ", "Nạp an toàn"],
      suitable_for: ["Game thủ PC"]
    },
    variants: [{ name: '10 USD', price: 270000, orginalPrice: 300000 }]
  },
  {
    name: 'Roblox Robux 800', 
    slug: 'roblox-robux-800', 
    categorySlug: 'game',
    description: 'Thẻ nạp 800 Robux chính hãng. Nạp code nhận ngay, không cần đưa nick.',
    thumbnail: 'https://res.cloudinary.com/diap7lvcv/image/upload/v1766999637/robloxrobux_qf5eci.jpg',
    isHot: true, 
    avgRating: 4.8, 
    keywordNames: ["roblox", "game", "napthe"],
    aiMetadata: {
      keywords: ["nạp robux", "skin roblox", "game pass"],
      features: ["Code nạp trực tiếp", "Không cần login nick", "Hàng chính hãng"],
      suitable_for: ["Người chơi Roblox"]
    },
    variants: [{ name: '800 Robux', price: 210000, orginalPrice: 250000 }]
  },
  {
    name: 'Elden Ring', 
    slug: 'elden-ring', 
    categorySlug: 'game',
    description: 'Game of The Year 2022. Thể loại Soul-like thế giới mở cực cuốn.',
    thumbnail: 'https://res.cloudinary.com/diap7lvcv/image/upload/v1766675833/eldenring_ogme7h.jpg',
    isHot: false, 
    avgRating: 4.9, 
    keywordNames: ["game", "steam"],
    aiMetadata: {
      keywords: ["game AAA", "souls-like", "thế giới mở", "hành động"],
      features: ["Cốt truyện sâu sắc", "Thế giới rộng lớn", "Độ khó cao"],
      suitable_for: ["Gamer Hardcore", "Fan FromSoftware"]
    },
    variants: [{ name: 'Standard Edition', price: 850000, orginalPrice: 1090000 }]
  },
  {
    name: 'FC 24 (FIFA 24)', 
    slug: 'fc-24', 
    categorySlug: 'game',
    description: 'Game bóng đá đỉnh cao từ EA Sports. Chế độ Ultimate Team hấp dẫn.',
    thumbnail: 'https://res.cloudinary.com/diap7lvcv/image/upload/v1766999638/fc24_ofepvj.jpg',
    isHot: true, 
    avgRating: 4.7, 
    keywordNames: ["fc24", "fifa", "game"],
    aiMetadata: {
      keywords: ["đá bóng", "fifa", "ea sports", "ultimate team"],
      features: ["HyperMotionV technology", "Bóng đá nữ trong UT", "PlayStyles"],
      suitable_for: ["Fan bóng đá", "Gamer thích cạnh tranh"]
    },
    variants: [{ name: 'Standard Key', price: 650000, orginalPrice: 1500000 }]
  },
  {
    name: 'Cyberpunk 2077', 
    slug: 'cyberpunk-2077', 
    categorySlug: 'game',
    description: 'Game nhập vai thế giới mở tương lai. Bao gồm bản cập nhật 2.0 mới nhất.',
    thumbnail: 'https://res.cloudinary.com/diap7lvcv/image/upload/v1766999638/Cyberpunk_x6qkb1.jpg',
    isHot: false, 
    avgRating: 4.6, 
    keywordNames: ["cyberpunk", "game", "steam"],
    aiMetadata: {
      keywords: ["tương lai", "nhập vai", "night city", "sci-fi"],
      features: ["Bản cập nhật 2.0 lớn", "Đồ họa cực đỉnh", "Cốt truyện rẽ nhánh"],
      suitable_for: ["Người yêu thích sci-fi", "Gamer thích nhập vai"]
    },
    variants: [{ name: 'Ultimate Edition', price: 890000, orginalPrice: 1800000 }]
  },
  {
    name: 'Xbox Game Pass Ultimate', 
    slug: 'xbox-game-pass', 
    categorySlug: 'game',
    description: 'Chơi hơn 100 game đỉnh cao trên PC và Xbox. Bao gồm cả EA Play.',
    thumbnail: 'https://res.cloudinary.com/diap7lvcv/image/upload/v1766999638/xbox_h82arg.jpg',
    isHot: true, 
    avgRating: 4.9, 
    keywordNames: ["xbox", "game"],
    aiMetadata: {
      keywords: ["thuê game", "game pass", "microsoft game"],
      features: ["Hơn 100 đầu game", "Bao gồm EA Play", "Chơi trên cả PC/Xbox"],
      suitable_for: ["Game thủ muốn chơi nhiều game giá rẻ"]
    },
    variants: [{ name: 'Code 3 Tháng', price: 450000, orginalPrice: 890000 }]
  },
  {
    name: 'PUBG Plus', 
    slug: 'pubg-plus', 
    categorySlug: 'game',
    description: 'Nâng cấp tài khoản PUBG Battlegrounds lên Plus. Mở khóa Ranked Mode và tạo Custom Match.',
    thumbnail: 'https://res.cloudinary.com/diap7lvcv/image/upload/v1766999637/pubgplus_fq2ohq.jpg',
    isHot: false, 
    avgRating: 4.7, 
    keywordNames: ["pubg", "game", "steam"],
    aiMetadata: {
      keywords: ["bắn súng", "battle royale", "pubg plus"],
      features: ["Mở khóa đấu Rank", "Tạo phòng tùy chọn", "Item đặc biệt"],
      suitable_for: ["Người chơi PUBG lâu năm"]
    },
    variants: [{ name: 'Key Vĩnh Viễn', price: 280000, orginalPrice: 350000 }]
  },
  {
    name: 'Grand Theft Auto VI (GTA 6)', 
    slug: 'gta-vi-pre-order', 
    categorySlug: 'game',
    description: 'Siêu phẩm được mong chờ nhất thập kỷ từ Rockstar Games, đưa người chơi quay trở lại Vice City rực rỡ sắc màu nhưng đầy rẫy tội phạm.',
    thumbnail: 'https://res.cloudinary.com/diap7lvcv/image/upload/v1766676661/%C3%81p_ph%C3%ADch_Grand_Theft_Auto_VI_uwjwkp.png',
    isHot: true, 
    avgRating: 5.0, 
    keywordNames: ["game", "gta", "steam"],
    aiMetadata: {
      keywords: ["gta 6", "rockstar games", "game thế giới mở", "siêu phẩm 2025"],
      features: ["Bản đồ Vice City mở rộng", "Đồ họa Next-gen", "Cốt truyện song mã độc đáo", "Hệ thống AI cư dân thông minh"],
      suitable_for: ["Tất cả game thủ", "Fan dòng game hành động", "Người sưu tầm game bản quyền"]
    },
    variants: [{ name: 'Pre-order Global', price: 1850000, orginalPrice: 2000000 }]
  },
  {
    name: 'Half-Life 3', 
    slug: 'half-life-3-steam', 
    categorySlug: 'game',
    description: 'Sự trở lại của huyền thoại Gordon Freeman trong phần tiếp theo của series bắn súng góc nhìn thứ nhất (FPS) vĩ đại nhất mọi thời đại.',
    thumbnail: 'https://res.cloudinary.com/diap7lvcv/image/upload/v1766676675/halflife_3_itwknk.jpg',
    isHot: true, 
    avgRating: 5.0, 
    keywordNames: ["game", "steam"],
    aiMetadata: {
      keywords: ["half life 3", "valve", "source 2", "fps huyền thoại"],
      features: ["Cơ chế vật lý đột phá", "Cốt truyện tiếp nối đỉnh cao", "Đồ họa Source 2 tối tân", "Trải nghiệm nhập vai sâu sắc"],
      suitable_for: ["Fan lâu năm của Valve", "Người yêu thích game bắn súng cốt truyện"]
    },
    variants: [{ name: 'Standard Key Steam', price: 1250000, orginalPrice: 1500000 }]
  }
];