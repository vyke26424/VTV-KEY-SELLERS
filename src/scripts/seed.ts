// prisma/seed.ts

import { PrismaClient, StockStatus, Prisma } from '@prisma/client';
import * as dotenv from 'dotenv';
import { EncryptionService } from '../admin/utils/encryption/encryption.service';

// 1. Load environment variables
dotenv.config();

const prisma = new PrismaClient();

// 2. Mock ConfigService (Để chạy Encryption mà không cần NestJS app)
const mockConfigService: any = {
  get: (key: string) => process.env[key],
  getOrThrow: (key: string) => {
    const value = process.env[key];
    if (!value) throw new Error(`❌ Missing environment variable: ${key}`);
    return value;
  },
};

// 3. Initialize Encryption Service
const encryptionService = new EncryptionService(mockConfigService);

async function main() {
  console.log('🌱 Start seeding VTV Key Sellers Data (Massive Data)...');

  // --- 1. CATEGORIES (DANH MỤC CHUẨN) ---
  const categoriesData = [
    { name: 'Trí tuệ nhân tạo (AI)', slug: 'ai' },
    { name: 'Giải Trí & Phim Ảnh', slug: 'entertainment' },
    { name: 'Game Bản Quyền', slug: 'game' },
    { name: 'Phần mềm & Windows', slug: 'software' },
    { name: 'Học tập & VPN', slug: 'education' },
    { name: 'Design & Đồ họa', slug: 'design' },
    { name: 'Diệt Virus & Bảo Mật', slug: 'security' },
  ];

  const categories: Record<string, number> = {};
  for (const cat of categoriesData) {
    const newCat = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    categories[cat.slug] = newCat.id;
    console.log(`📂 Category: ${newCat.name}`);
  }

  // --- 2. KEYWORDS (TỪ KHÓA PHONG PHÚ - ĐÃ CẬP NHẬT THÊM) ---
  const allKeywordNames = [
    // AI
    "chatgpt", "gpt-4o", "openai", "midjourney", "claude", "gemini", "google", "copilot", "quillbot", "ai", "bot", "jasper", "perplexity",
    // Entertainment
    "netflix", "youtube", "spotify", "k+", "vieon", "fpt", "hbo", "disney", "phim", "nhạc", "4k", "amazon", "apple", "tidal", "crunchyroll",
    // Game
    "steam", "valorant", "lienminh", "gta", "minecraft", "roblox", "wukong", "fc24", "fifa", "game", "napthe", "xbox", "playstation", "cyberpunk", "pubg",
    // Software
    "windows", "office", "microsoft", "idm", "winrar", "driver", "key", "banquyen", "google-drive", "jetbrains", "vmware", "winzip",
    // Education & VPN
    "duolingo", "coursera", "udemy", "grammarly", "zoom", "elsa", "vpn", "nordvpn", "expressvpn", "ip", "skillshare", "linkedin", "scribd",
    // Design
    "canva", "adobe", "photoshop", "capcut", "freepik", "envato", "lightroom", "edit", "figma", "motion", "pikbest",
    // Security
    "kaspersky", "bitdefender", "malwarebytes", "virus", "dietvirus", "bao-mat", "norton", "bkav", "eset", "mcafee"
  ];
  
  const createdKeywords: Record<string, any> = {};
  for (const name of allKeywordNames) {
    const keyword = await prisma.keywords.upsert({
      where: { name: name },
      update: {},
      create: { name: name },
    });
    createdKeywords[name] = keyword;
  }

  const getKeywordConnect = (names: string[]) => ({
    connect: (names || [])
      .map(name => createdKeywords[name])
      .filter(k => k) // Lọc bỏ nếu keyword không tồn tại để tránh lỗi
      .map(k => ({ id: k.id }))
  });

  // --- 3. MASSIVE PRODUCTS LIST (KHOẢNG 10-15 SP MỖI LOẠI) ---
  const productsList = [
    // ================= CATEGORY: AI (TRÍ TUỆ NHÂN TẠO) =================
    {
      name: 'ChatGPT Plus (GPT-4o)', slug: 'chatgpt-plus', categoryId: categories['ai'],
      description: 'Nâng cấp tài khoản chính chủ lên ChatGPT Plus. Mở khóa sức mạnh của GPT-4o mới nhất, vẽ tranh DALL-E 3.',
      thumbnail: 'https://shop.activeitfirm.com/wp-content/uploads/2025/01/Chat-GPT-Plus-1-600x600.png',
      isHot: true, avgRating: 4.9, keywordNames: ["chatgpt", "gpt-4o", "openai", "ai"],
      variants: [{ name: '1 Tháng (Riêng)', price: 490000, orginalPrice: 580000 }, { name: '1 Tháng (Share)', price: 140000, orginalPrice: 200000 }]
    },
    {
      name: 'Midjourney Pro', slug: 'midjourney-pro', categoryId: categories['ai'],
      description: 'Công cụ tạo ảnh AI nghệ thuật đẹp nhất thế giới hiện nay. Quyền thương mại và chế độ Stealth mode.',
      thumbnail: 'https://registry.npmmirror.com/@lobehub/icons-static-png/1.75.0/files/dark/midjourney.png',
      isHot: true, avgRating: 4.8, keywordNames: ["midjourney", "ai", "design"],
      variants: [{ name: 'Standard 1 Tháng', price: 650000, orginalPrice: 800000 }]
    },
    {
      name: 'Claude 3 Opus', slug: 'claude-3-opus', categoryId: categories['ai'],
      description: 'AI thông minh nhất từ Anthropic, xử lý văn bản dài cực tốt, code đỉnh cao.',
      thumbnail: 'https://pbs.twimg.com/media/GH6cqzWXkAApxQl.jpg',
      isHot: false, avgRating: 4.8, keywordNames: ["claude", "ai", "bot"],
      variants: [{ name: 'Tài khoản riêng 1T', price: 520000, orginalPrice: 600000 }]
    },
    {
      name: 'Google Gemini Advanced', slug: 'gemini-advanced', categoryId: categories['ai'],
      description: 'Mô hình AI mạnh nhất của Google (Ultra 1.0). Tích hợp sâu vào Google Workspace. Tặng 2TB Google One.',
      thumbnail: 'https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/google-gemini-icon.png',
      isHot: true, avgRating: 4.7, keywordNames: ["gemini", "google", "ai"],
      variants: [{ name: 'Nâng cấp 1 Tháng', price: 90000, orginalPrice: 480000 }]
    },
    {
      name: 'GitHub Copilot', slug: 'github-copilot', categoryId: categories['ai'],
      description: 'Trợ lý lập trình AI tốt nhất cho Developer. Tự động gợi ý code trong VS Code.',
      thumbnail: 'https://seeklogo.com/images/G/github-copilot-logo-3357744754-seeklogo.com.png',
      isHot: false, avgRating: 4.9, keywordNames: ["copilot", "ai"],
      variants: [{ name: 'Gói 1 Năm', price: 450000, orginalPrice: 2400000 }]
    },
    {
      name: 'Quillbot Premium', slug: 'quillbot-premium', categoryId: categories['ai'],
      description: 'Công cụ Paraphrase tiếng Anh số 1 thế giới. Hỗ trợ check đạo văn, tóm tắt văn bản.',
      thumbnail: 'https://images.g2crowd.com/uploads/product/image/large_detail/large_detail_3f29562cb0e487ba6203d92036511394/quillbot.png',
      isHot: false, avgRating: 4.8, keywordNames: ["quillbot", "ai"],
      variants: [{ name: '1 Năm', price: 250000, orginalPrice: 900000 }]
    },
    {
      name: 'Jasper AI Boss Mode', slug: 'jasper-ai', categoryId: categories['ai'],
      description: 'AI viết Content Marketing chuyên nghiệp. Tạo bài Blog, Facebook Ads chỉ trong vài giây.',
      thumbnail: 'https://assets-global.website-files.com/60e5f2de011b86acebc30db7/60e5f2de011b86427bc30e2f_Jasper%20Logo%20(1).png',
      isHot: false, avgRating: 4.7, keywordNames: ["jasper", "ai", "bot"],
      variants: [{ name: '1 Tháng', price: 290000, orginalPrice: 1200000 }]
    },
    {
      name: 'Perplexity Pro', slug: 'perplexity-pro', categoryId: categories['ai'],
      description: 'Công cụ tìm kiếm AI thay thế Google. Tìm kiếm thông tin chính xác, có dẫn nguồn.',
      thumbnail: 'https://seeklogo.com/images/P/perplexity-ai-logo-13120A663F-seeklogo.com.png',
      isHot: true, avgRating: 4.9, keywordNames: ["perplexity", "ai", "google"],
      variants: [{ name: '1 Năm', price: 990000, orginalPrice: 2400000 }]
    },
    {
      name: 'Poe Subscription', slug: 'poe-sub', categoryId: categories['ai'],
      description: 'Truy cập tất cả các bot AI: GPT-4, Claude 3, Llama 2 trong một ứng dụng duy nhất.',
      thumbnail: 'https://seeklogo.com/images/P/poe-logo-5A1E4239E3-seeklogo.com.png',
      isHot: false, avgRating: 4.6, keywordNames: ["ai", "bot"],
      variants: [{ name: '1 Tháng', price: 150000, orginalPrice: 400000 }]
    },
    {
      name: 'ElevenLabs Creator', slug: 'elevenlabs', categoryId: categories['ai'],
      description: 'Công cụ chuyển văn bản thành giọng nói (Text-to-Speech) AI cảm xúc nhất hiện nay. Clone giọng nói.',
      thumbnail: 'https://avatars.githubusercontent.com/u/111288604?s=280&v=4',
      isHot: false, avgRating: 4.8, keywordNames: ["ai", "bot"],
      variants: [{ name: '100k ký tự/tháng', price: 120000, orginalPrice: 250000 }]
    },

    // ================= CATEGORY: ENTERTAINMENT (GIẢI TRÍ) =================
    {
      name: 'Netflix Premium 4K', slug: 'netflix-premium', categoryId: categories['entertainment'],
      description: 'Tài khoản Netflix Premium xem phim 4K Ultra HD. Xem không giới hạn, không quảng cáo.',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/7/75/Netflix_icon.svg',
      isHot: true, avgRating: 4.9, keywordNames: ["netflix", "phim", "4k"],
      variants: [{ name: '1 Tháng (Slot)', price: 85000, orginalPrice: 260000 }]
    },
    {
      name: 'YouTube Premium', slug: 'youtube-premium', categoryId: categories['entertainment'],
      description: 'Xem YouTube không quảng cáo, chạy nền, tải video offline. Kèm YouTube Music.',
      thumbnail: 'https://file.hstatic.net/200000061442/article/youtube_15d1e937db924cecb271594febec2780_1024x1024.png',
      isHot: true, avgRating: 4.9, keywordNames: ["youtube", "nhạc", "premium"],
      variants: [{ name: '6 Tháng', price: 149000, orginalPrice: 350000 }]
    },
    {
      name: 'Spotify Premium', slug: 'spotify-premium', categoryId: categories['entertainment'],
      description: 'Nâng cấp Spotify chính chủ. Nghe nhạc 320kbps, chuyển bài không giới hạn.',
      thumbnail: 'https://m.media-amazon.com/images/I/31B2Nyzd8XL.png',
      isHot: true, avgRating: 4.8, keywordNames: ["spotify", "nhạc"],
      variants: [{ name: '1 Năm', price: 290000, orginalPrice: 590000 }]
    },
    {
      name: 'VieON VIP K+', slug: 'vieon-vip-kplus', categoryId: categories['entertainment'],
      description: 'Xem Ngoại Hạng Anh, phim Việt độc quyền, truyền hình trực tuyến Full HD.',
      thumbnail: 'https://cdn.vieon.vn/vieon-logo.png',
      isHot: true, avgRating: 4.6, keywordNames: ["vieon", "k+", "phim"],
      variants: [{ name: '1 Tháng VIP + K+', price: 169000, orginalPrice: 219000 }]
    },
    {
      name: 'Disney+ (Disney Plus)', slug: 'disney-plus', categoryId: categories['entertainment'],
      description: 'Kho phim Marvel, Star Wars, Pixar. Chất lượng 4K IMAX Enhanced.',
      thumbnail: 'https://cdn.mos.cms.futurecdn.net/v2/t:0,l:420,cw:1080,ch:1080,q:80,w:1080/c6fFaJ2NrD7u2g8TP2u2iY.jpg',
      isHot: false, avgRating: 4.7, keywordNames: ["disney", "phim", "4k"],
      variants: [{ name: '1 Năm', price: 350000, orginalPrice: 1500000 }]
    },
    {
      name: 'Amazon Prime Video', slug: 'prime-video', categoryId: categories['entertainment'],
      description: 'Xem phim The Boys, Fallout, Reacher độc quyền. Chất lượng 4K HDR.',
      thumbnail: 'https://m.media-amazon.com/images/G/01/prime/marketing/slashPrime/prime-video-logo._CB610223274_.png',
      isHot: false, avgRating: 4.5, keywordNames: ["amazon", "phim"],
      variants: [{ name: '6 Tháng', price: 180000, orginalPrice: 600000 }]
    },
    {
      name: 'HBO Max (Max)', slug: 'hbo-max', categoryId: categories['entertainment'],
      description: 'Xem House of the Dragon, Harry Potter, Game of Thrones trọn bộ.',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Max_2023_logo.svg/1200px-Max_2023_logo.svg.png',
      isHot: false, avgRating: 4.8, keywordNames: ["hbo", "phim"],
      variants: [{ name: '1 Tháng', price: 60000, orginalPrice: 200000 }]
    },
    {
      name: 'Apple Music', slug: 'apple-music', categoryId: categories['entertainment'],
      description: 'Nghe nhạc Lossless, Spatial Audio chất lượng cao nhất hệ sinh thái Apple.',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Apple_Music_logo.svg/1200px-Apple_Music_logo.svg.png',
      isHot: false, avgRating: 4.7, keywordNames: ["apple", "nhạc"],
      variants: [{ name: '3 Tháng', price: 45000, orginalPrice: 177000 }]
    },
    {
      name: 'Crunchyroll Fan', slug: 'crunchyroll', categoryId: categories['entertainment'],
      description: 'Kho Anime lớn nhất thế giới. Xem One Piece, Naruto bản quyền mới nhất sau Nhật 1h.',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Crunchyroll_Logo.svg/1200px-Crunchyroll_Logo.svg.png',
      isHot: true, avgRating: 4.8, keywordNames: ["crunchyroll", "phim"],
      variants: [{ name: '1 Năm', price: 350000, orginalPrice: 1200000 }]
    },
    {
      name: 'Tidal HiFi Plus', slug: 'tidal-hifi', categoryId: categories['entertainment'],
      description: 'Dịch vụ nghe nhạc dành cho Audiophile. Chất lượng Master Quality Authenticated (MQA).',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Tidal_logo.svg/2560px-Tidal_logo.svg.png',
      isHot: false, avgRating: 4.6, keywordNames: ["tidal", "nhạc"],
      variants: [{ name: '3 Tháng', price: 120000, orginalPrice: 500000 }]
    },

    // ================= CATEGORY: GAME =================
    {
      name: 'Black Myth: Wukong', slug: 'black-myth-wukong', categoryId: categories['game'],
      description: 'Siêu phẩm hành động nhập vai AAA lấy cảm hứng từ Tây Du Ký. Key Steam Global.',
      thumbnail: 'https://tintuc-divineshop.cdn.vccloud.vn/wp-content/uploads/2024/08/blackmyth-1723969364570.jpg',
      isHot: true, avgRating: 5.0, keywordNames: ["wukong", "game", "steam"],
      variants: [{ name: 'Standard Edition', price: 1150000, orginalPrice: 1299000 }]
    },
    {
      name: 'GTA V Premium', slug: 'gta-5-premium', categoryId: categories['game'],
      description: 'Huyền thoại thế giới mở. Bao gồm GTA Online + Starter Pack.',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/vi/a/a5/Grand_Theft_Auto_V.png',
      isHot: true, avgRating: 4.9, keywordNames: ["gta", "game", "steam"],
      variants: [{ name: 'Premium Edition', price: 230000, orginalPrice: 450000 }]
    },
    {
      name: 'Minecraft Java & Bedrock', slug: 'minecraft-pc', categoryId: categories['game'],
      description: 'Game sinh tồn sáng tạo hay nhất. Key bản quyền Microsoft chính hãng.',
      thumbnail: 'https://news.vio.vn/wp-content/uploads/2025/03/minecraft-pe-la-gi-1-1.jpg',
      isHot: true, avgRating: 4.9, keywordNames: ["minecraft", "game"],
      variants: [{ name: 'Key Global', price: 490000, orginalPrice: 750000 }]
    },
    {
      name: 'Valorant Points (VP)', slug: 'valorant-points', categoryId: categories['game'],
      description: 'Nạp VP giá rẻ, uy tín qua Riot ID. An toàn tuyệt đối 100%.',
      thumbnail: 'https://seeklogo.com/images/V/valorant-logo-FAB2CA0E55-seeklogo.com.png',
      isHot: true, avgRating: 4.9, keywordNames: ["valorant", "game", "napthe"],
      variants: [{ name: '2000 VP', price: 400000, orginalPrice: 450000 }]
    },
    {
      name: 'Steam Wallet 10$', slug: 'steam-wallet-10', categoryId: categories['game'],
      description: 'Mã thẻ nạp tiền Steam 10 USD. Tự động quy đổi sang VNĐ. Code Global.',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Steam_icon_logo.svg/2048px-Steam_icon_logo.svg.png',
      isHot: true, avgRating: 5.0, keywordNames: ["steam", "game", "napthe"],
      variants: [{ name: '10 USD', price: 270000, orginalPrice: 300000 }]
    },
    {
      name: 'Roblox Robux 800', slug: 'roblox-robux-800', categoryId: categories['game'],
      description: 'Thẻ nạp 800 Robux chính hãng. Nạp code nhận ngay, không cần đưa nick.',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Roblox_player_icon_black.svg/1200px-Roblox_player_icon_black.svg.png',
      isHot: true, avgRating: 4.8, keywordNames: ["roblox", "game", "napthe"],
      variants: [{ name: '800 Robux', price: 210000, orginalPrice: 250000 }]
    },
    {
      name: 'Elden Ring', slug: 'elden-ring', categoryId: categories['game'],
      description: 'Game of The Year 2022. Thể loại Soul-like thế giới mở cực cuốn.',
      thumbnail: 'https://assets-prd.ignimgs.com/2021/06/12/elden-ring-button-03-1623460560664.jpg',
      isHot: false, avgRating: 4.9, keywordNames: ["game", "steam"],
      variants: [{ name: 'Standard Edition', price: 850000, orginalPrice: 1090000 }]
    },
    {
      name: 'FC 24 (FIFA 24)', slug: 'fc-24', categoryId: categories['game'],
      description: 'Game bóng đá đỉnh cao từ EA Sports. Chế độ Ultimate Team hấp dẫn.',
      thumbnail: 'https://media.contentapi.ea.com/content/dam/ea/fc/fc-24/common/fc24-logo-white-stacked.svg',
      isHot: true, avgRating: 4.7, keywordNames: ["fc24", "fifa", "game"],
      variants: [{ name: 'Standard Key', price: 650000, orginalPrice: 1500000 }]
    },
    {
      name: 'Cyberpunk 2077', slug: 'cyberpunk-2077', categoryId: categories['game'],
      description: 'Game nhập vai thế giới mở tương lai. Bao gồm bản cập nhật 2.0 mới nhất.',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/e/e6/Cyberpunk_2077_logo.svg',
      isHot: false, avgRating: 4.6, keywordNames: ["cyberpunk", "game", "steam"],
      variants: [{ name: 'Ultimate Edition', price: 890000, orginalPrice: 1800000 }]
    },
    {
      name: 'Xbox Game Pass Ultimate', slug: 'xbox-game-pass', categoryId: categories['game'],
      description: 'Chơi hơn 100 game đỉnh cao trên PC và Xbox. Bao gồm cả EA Play.',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Xbox_Game_Pass_logo.svg/2560px-Xbox_Game_Pass_logo.svg.png',
      isHot: true, avgRating: 4.9, keywordNames: ["xbox", "game"],
      variants: [{ name: 'Code 3 Tháng', price: 450000, orginalPrice: 890000 }]
    },
    {
      name: 'PUBG Plus', slug: 'pubg-plus', categoryId: categories['game'],
      description: 'Nâng cấp tài khoản PUBG Battlegrounds lên Plus. Mở khóa Ranked Mode và tạo Custom Match.',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/PUBG_logo.svg/2560px-PUBG_logo.svg.png',
      isHot: false, avgRating: 4.7, keywordNames: ["pubg", "game", "steam"],
      variants: [{ name: 'Key Vĩnh Viễn', price: 280000, orginalPrice: 350000 }]
    },

    // ================= CATEGORY: SOFTWARE =================
    {
      name: 'Windows 11 Pro', slug: 'windows-11-pro', categoryId: categories['software'],
      description: 'Key kích hoạt Windows 11 Pro bản quyền vĩnh viễn. Update thoải mái.',
      thumbnail: 'https://keyoff.net/wp-content/uploads/2021/10/Key-Windows-11-gia-re.jpg',
      isHot: true, avgRating: 4.9, keywordNames: ["windows", "key", "microsoft"],
      variants: [{ name: 'Key Vĩnh Viễn', price: 150000, orginalPrice: 3500000 }]
    },
    {
      name: 'Office 365 Family', slug: 'office-365', categoryId: categories['software'],
      description: 'Office bản quyền + 1TB OneDrive. Nâng cấp trên chính Email của bạn.',
      thumbnail: 'https://seeklogo.com/images/M/microsoft-office-365-logo-62374514EC-seeklogo.com.png',
      isHot: true, avgRating: 4.9, keywordNames: ["office", "microsoft", "google-drive"],
      variants: [{ name: '1 Năm (Slot)', price: 250000, orginalPrice: 1400000 }]
    },
    {
      name: 'IDM License Key', slug: 'idm-key', categoryId: categories['software'],
      description: 'Phần mềm tăng tốc download số 1 thế giới. Key chính hãng bảo hành trọn đời.',
      thumbnail: 'https://3.bp.blogspot.com/-UlQVjpBhT44/Th3BOsfBGQI/AAAAAAAAAFM/Ww2qhQgqKI8/s1600/Internet_Download_Manager.jpg',
      isHot: true, avgRating: 4.9, keywordNames: ["idm", "key"],
      variants: [{ name: 'Key Trọn Đời', price: 430000, orginalPrice: 600000 }]
    },
    {
      name: 'Google One 100GB', slug: 'google-one', categoryId: categories['software'],
      description: 'Nâng cấp dung lượng Google Drive, Gmail, Photos. Chính chủ, an toàn.',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Google_Drive_icon_%282020%29.svg/2295px-Google_Drive_icon_%282020%29.svg.png',
      isHot: false, avgRating: 4.8, keywordNames: ["google-drive", "software"],
      variants: [{ name: '100GB / 1 Năm', price: 350000, orginalPrice: 450000 }]
    },
    {
      name: 'WinRAR License', slug: 'winrar-license', categoryId: categories['software'],
      description: 'Phần mềm nén và giải nén file tốt nhất. Xóa bỏ thông báo dùng thử khó chịu.',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/7/70/WinRAR_5.0_icon.png',
      isHot: false, avgRating: 4.7, keywordNames: ["winrar", "software"],
      variants: [{ name: 'Key Vĩnh Viễn', price: 100000, orginalPrice: 500000 }]
    },
    {
      name: 'JetBrains All Products', slug: 'jetbrains-all', categoryId: categories['software'],
      description: 'Bộ công cụ lập trình đỉnh cao: IntelliJ IDEA, PyCharm, WebStorm. Gói Personal.',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/JetBrains_Logo_2016.svg/1200px-JetBrains_Logo_2016.svg.png',
      isHot: false, avgRating: 4.9, keywordNames: ["jetbrains", "software"],
      variants: [{ name: '1 Năm', price: 950000, orginalPrice: 6000000 }]
    },
    {
      name: 'VMware Workstation Pro', slug: 'vmware-pro', categoryId: categories['software'],
      description: 'Phần mềm tạo máy ảo tốt nhất cho Windows/Linux. Chạy nhiều hệ điều hành cùng lúc.',
      thumbnail: 'https://seeklogo.com/images/V/vmware-workstation-logo-8A87040E0C-seeklogo.com.png',
      isHot: false, avgRating: 4.8, keywordNames: ["vmware", "software"],
      variants: [{ name: 'Key Vĩnh Viễn', price: 250000, orginalPrice: 4000000 }]
    },
    {
      name: 'Windows 10 Pro', slug: 'windows-10-pro', categoryId: categories['software'],
      description: 'Hệ điều hành Win 10 ổn định. Key Retail kích hoạt online.',
      thumbnail: 'https://aiie.me/wp-content/uploads/2021/10/Windows-10-pro-1-e1633961713841.jpg',
      isHot: false, avgRating: 4.8, keywordNames: ["windows", "key"],
      variants: [{ name: 'Key Vĩnh Viễn', price: 120000, orginalPrice: 2500000 }]
    },
    {
      name: 'Office 2021 Pro Plus', slug: 'office-2021', categoryId: categories['software'],
      description: 'Bộ Office mua 1 lần dùng trọn đời. Key Bind vào tài khoản Microsoft.',
      thumbnail: 'https://productkey.vn/wp-content/uploads/2022/01/Office-2021-Professional-Plus.png',
      isHot: false, avgRating: 4.8, keywordNames: ["office", "key"],
      variants: [{ name: 'Key Bind Mail', price: 290000, orginalPrice: 5000000 }]
    },
    {
      name: 'WinZip Pro', slug: 'winzip-pro', categoryId: categories['software'],
      description: 'Công cụ nén file mạnh mẽ, hỗ trợ mã hóa và chia sẻ đám mây.',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/2/29/WinZip_Logo.png',
      isHot: false, avgRating: 4.5, keywordNames: ["winzip", "software"],
      variants: [{ name: 'Key Vĩnh Viễn', price: 150000, orginalPrice: 800000 }]
    },

    // ================= CATEGORY: EDUCATION & VPN =================
    {
      name: 'Duolingo Super', slug: 'duolingo-super', categoryId: categories['education'],
      description: 'Học ngoại ngữ không quảng cáo, trái tim vô hạn. Nâng cấp chính chủ.',
      thumbnail: 'https://banquyen88.vn/wp-content/uploads/2023/10/Nang-cap-Duolingo-Supper-1.png',
      isHot: true, avgRating: 4.9, keywordNames: ["duolingo", "study"],
      variants: [{ name: '1 Năm (Family)', price: 180000, orginalPrice: 1500000 }]
    },
    {
      name: 'NordVPN 1 Năm', slug: 'nord-vpn', categoryId: categories['education'],
      description: 'VPN bảo mật tốt nhất. Xem Netflix US mượt mà. 6 thiết bị.',
      thumbnail: 'https://i0.wp.com/software.centrix.asia/wp-content/uploads/unnamed.jpg?fit=512%2C512&ssl=1',
      isHot: true, avgRating: 4.7, keywordNames: ["nordvpn", "vpn", "ip"],
      variants: [{ name: 'Tài khoản 1 Năm', price: 250000, orginalPrice: 1400000 }]
    },
    {
      name: 'Coursera Plus', slug: 'coursera-plus', categoryId: categories['education'],
      description: 'Học không giới hạn 7000+ khóa học. Nhận chứng chỉ chuyên nghiệp.',
      thumbnail: 'https://seeklogo.com/images/C/coursera-logo-F763279530-seeklogo.com.png',
      isHot: false, avgRating: 4.8, keywordNames: ["coursera", "study"],
      variants: [{ name: '1 Năm', price: 1900000, orginalPrice: 9000000 }]
    },
    {
      name: 'Grammarly Premium', slug: 'grammarly-premium', categoryId: categories['education'],
      description: 'Sửa lỗi ngữ pháp tiếng Anh, check đạo văn. Cần thiết cho viết lách.',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Grammarly_logo.svg/1200px-Grammarly_logo.svg.png',
      isHot: false, avgRating: 4.8, keywordNames: ["grammarly", "study"],
      variants: [{ name: '6 Tháng', price: 350000, orginalPrice: 1500000 }]
    },
    {
      name: 'Zoom Pro', slug: 'zoom-pro', categoryId: categories['education'],
      description: 'Họp Online không giới hạn thời gian. 100 người tham gia.',
      thumbnail: 'https://stc-zalopay-landing.zg.vn/landing/office/2021/08/logo-zoom-2.png',
      isHot: false, avgRating: 4.6, keywordNames: ["zoom", "study"],
      variants: [{ name: '1 Tháng', price: 150000, orginalPrice: 350000 }]
    },
    {
      name: 'ExpressVPN', slug: 'express-vpn', categoryId: categories['education'],
      description: 'VPN tốc độ nhanh nhất thế giới. Bảo mật cấp quân sự.',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/ExpressVPN_Logo.svg/1200px-ExpressVPN_Logo.svg.png',
      isHot: false, avgRating: 4.8, keywordNames: ["expressvpn", "vpn"],
      variants: [{ name: 'Key Mobile 1 Năm', price: 350000, orginalPrice: 2000000 }]
    },
    {
      name: 'Udemy Credits', slug: 'udemy-credits', categoryId: categories['education'],
      description: 'Tài khoản Udemy có sẵn Credit để mua khóa học bất kỳ. Học IT, Business.',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Udemy_logo.svg/2560px-Udemy_logo.svg.png',
      isHot: false, avgRating: 4.7, keywordNames: ["udemy", "study"],
      variants: [{ name: 'Gói 5 Khóa', price: 400000, orginalPrice: 1500000 }]
    },
    {
      name: 'LinkedIn Learning', slug: 'linkedin-learning', categoryId: categories['education'],
      description: 'Kho khóa học kỹ năng mềm và chuyên môn từ LinkedIn. Nâng cao profile.',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/LinkedIn_Logo.svg/1200px-LinkedIn_Logo.svg.png',
      isHot: false, avgRating: 4.6, keywordNames: ["linkedin", "study"],
      variants: [{ name: '1 Năm', price: 550000, orginalPrice: 3000000 }]
    },
    {
      name: 'Skillshare Premium', slug: 'skillshare', categoryId: categories['education'],
      description: 'Học thiết kế, vẽ, nhiếp ảnh từ các chuyên gia hàng đầu.',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Skillshare_logo_2020.svg/1200px-Skillshare_logo_2020.svg.png',
      isHot: false, avgRating: 4.5, keywordNames: ["skillshare", "study"],
      variants: [{ name: '1 Năm', price: 290000, orginalPrice: 1800000 }]
    },
    {
      name: 'Elsa Speak Pro', slug: 'elsa-pro', categoryId: categories['education'],
      description: 'App luyện phát âm tiếng Anh chuẩn bản xứ với AI.',
      thumbnail: 'https://cdn.haitrieu.com/wp-content/uploads/2021/11/Logo-Elsa-Speak.png',
      isHot: true, avgRating: 4.8, keywordNames: ["elsa", "study"],
      variants: [{ name: 'Trọn Đời', price: 890000, orginalPrice: 2500000 }]
    },

    // ================= CATEGORY: DESIGN =================
    {
      name: 'Canva Pro', slug: 'canva-pro', categoryId: categories['design'],
      description: 'Tài khoản Canva Pro mở khóa full tính năng, xóa phông, template VIP.',
      thumbnail: 'https://digimarket.vn/thumbnails/products/large/uploads/canva-pro-icon-1.png.webp',
      isHot: true, avgRating: 4.9, keywordNames: ["canva", "design", "edit"],
      variants: [{ name: 'Nâng cấp Vĩnh Viễn', price: 150000, orginalPrice: 2000000 }]
    },
    {
      name: 'Adobe All Apps', slug: 'adobe-all-apps', categoryId: categories['design'],
      description: 'Trọn bộ Adobe Creative Cloud: Photoshop, AI, Premiere... Cloud 100GB.',
      thumbnail: 'https://s7494.pcdn.co/byod/files/2022/06/adobe-creative-cloud-300x250.png',
      isHot: true, avgRating: 4.8, keywordNames: ["adobe", "photoshop", "design"],
      variants: [{ name: '1 Năm (Chính chủ)', price: 1600000, orginalPrice: 8000000 }]
    },
    {
      name: 'CapCut Pro', slug: 'capcut-pro', categoryId: categories['design'],
      description: 'Mở khóa hiệu ứng, filter VIP. Xóa logo CapCut. Dùng trên PC/Mobile.',
      thumbnail: 'https://seeklogo.com/images/C/capcut-logo-698C2E5D06-seeklogo.com.png',
      isHot: true, avgRating: 4.9, keywordNames: ["capcut", "edit", "design"],
      variants: [{ name: '1 Năm', price: 350000, orginalPrice: 900000 }]
    },
    {
      name: 'Freepik Premium', slug: 'freepik-premium', categoryId: categories['design'],
      description: 'Tải Vector, PSD, Stock Photo không giới hạn.',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Freepik_logo.svg/2560px-Freepik_logo.svg.png',
      isHot: false, avgRating: 4.7, keywordNames: ["freepik", "design"],
      variants: [{ name: '1 Năm (ID riêng)', price: 750000, orginalPrice: 2500000 }]
    },
    {
      name: 'Envato Elements', slug: 'envato-elements', categoryId: categories['design'],
      description: 'Kho tài nguyên thiết kế lớn nhất: Web theme, Video template, Music.',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Envato_Logo.svg/2560px-Envato_Logo.svg.png',
      isHot: true, avgRating: 4.8, keywordNames: ["envato", "design"],
      variants: [{ name: '1 Tháng (Share)', price: 150000, orginalPrice: 800000 }]
    },
    {
      name: 'Motion Array', slug: 'motion-array', categoryId: categories['design'],
      description: 'Template Premiere Pro, After Effects, Stock footage chất lượng cao.',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Motion_Array_Logo.svg/2560px-Motion_Array_Logo.svg.png',
      isHot: false, avgRating: 4.6, keywordNames: ["motion", "design", "edit"],
      variants: [{ name: '1 Tháng', price: 180000, orginalPrice: 600000 }]
    },
    {
      name: 'Figma Professional', slug: 'figma-pro', categoryId: categories['design'],
      description: 'Công cụ thiết kế UI/UX hàng đầu. Nâng cấp Team plan đầy đủ tính năng.',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Figma-logo.svg/1667px-Figma-logo.svg.png',
      isHot: false, avgRating: 4.9, keywordNames: ["figma", "design"],
      variants: [{ name: 'Nâng cấp 1 Năm', price: 450000, orginalPrice: 3000000 }]
    },
    {
      name: 'Pikbest Premium', slug: 'pikbest', categoryId: categories['design'],
      description: 'Tải template Powerpoint, PSD, Video intro. Kho tài nguyên châu Á phong phú.',
      thumbnail: 'https://seeklogo.com/images/P/pikbest-logo-3841C52608-seeklogo.com.png',
      isHot: false, avgRating: 4.5, keywordNames: ["pikbest", "design"],
      variants: [{ name: '1 Năm', price: 390000, orginalPrice: 2000000 }]
    },
    {
      name: 'Lightroom Presets Pack', slug: 'lr-presets', categoryId: categories['design'],
      description: 'Bộ màu chỉnh ảnh chuyên nghiệp 5000+ Presets. Dùng cho Mobile/PC.',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Adobe_Photoshop_Lightroom_CC_logo.svg/2101px-Adobe_Photoshop_Lightroom_CC_logo.svg.png',
      isHot: false, avgRating: 4.7, keywordNames: ["lightroom", "edit"],
      variants: [{ name: 'Full Pack', price: 99000, orginalPrice: 500000 }]
    },
    {
      name: 'Storyblocks Unlimited', slug: 'storyblocks', categoryId: categories['design'],
      description: 'Kho video, audio stock không bản quyền. Tải xuống không giới hạn.',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Storyblocks_Logo.svg/2560px-Storyblocks_Logo.svg.png',
      isHot: false, avgRating: 4.6, keywordNames: ["design", "edit"],
      variants: [{ name: '1 Tháng', price: 200000, orginalPrice: 1000000 }]
    },

    // ================= CATEGORY: SECURITY =================
    {
      name: 'Kaspersky Total Security', slug: 'kaspersky-ts', categoryId: categories['security'],
      description: 'Phần mềm diệt virus tốt nhất. Bảo vệ thanh toán, chống ransomware.',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/25/Kaspersky_logo.svg/1200px-Kaspersky_logo.svg.png',
      isHot: true, avgRating: 4.9, keywordNames: ["kaspersky", "dietvirus", "security"],
      variants: [{ name: '1 Năm / 1 Thiết bị', price: 160000, orginalPrice: 300000 }]
    },
    {
      name: 'Bitdefender Total Security', slug: 'bitdefender-ts', categoryId: categories['security'],
      description: 'Bảo mật toàn diện, nhẹ máy. Chống theo dõi Webcam.',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/3/30/Bitdefender_Logo.svg',
      isHot: false, avgRating: 4.8, keywordNames: ["bitdefender", "dietvirus", "security"],
      variants: [{ name: '1 Năm / 5 Thiết bị', price: 250000, orginalPrice: 800000 }]
    },
    {
      name: 'Malwarebytes Premium', slug: 'malwarebytes', categoryId: categories['security'],
      description: 'Chuyên gia diệt Malware, phần mềm độc hại cứng đầu.',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/2/2b/Malwarebytes_logo.svg',
      isHot: false, avgRating: 4.7, keywordNames: ["malwarebytes", "dietvirus"],
      variants: [{ name: 'Key Vĩnh Viễn', price: 150000, orginalPrice: 1000000 }]
    },
    {
      name: 'Norton 360 Deluxe', slug: 'norton-360', categoryId: categories['security'],
      description: 'Bảo vệ đa lớp, tích hợp VPN và Cloud Backup 50GB.',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Norton_LifeLock_logo.svg/2560px-Norton_LifeLock_logo.svg.png',
      isHot: false, avgRating: 4.8, keywordNames: ["norton", "security"],
      variants: [{ name: '1 Năm / 3 Thiết bị', price: 290000, orginalPrice: 1200000 }]
    },
    {
      name: 'McAfee Total Protection', slug: 'mcafee-tp', categoryId: categories['security'],
      description: 'Diệt virus, bảo vệ danh tính, quản lý mật khẩu True Key.',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/McAfee_logo.svg/2560px-McAfee_logo.svg.png',
      isHot: false, avgRating: 4.6, keywordNames: ["mcafee", "security"],
      variants: [{ name: '1 Năm', price: 180000, orginalPrice: 900000 }]
    },
    {
      name: 'ESET NOD32 Antivirus', slug: 'eset-nod32', categoryId: categories['security'],
      description: 'Huyền thoại diệt virus nhẹ nhất thế giới. Dành cho game thủ.',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/ESET_logo.svg/2560px-ESET_logo.svg.png',
      isHot: false, avgRating: 4.8, keywordNames: ["eset", "dietvirus"],
      variants: [{ name: 'Key 1 Năm', price: 140000, orginalPrice: 400000 }]
    },
    {
      name: 'Avast Premium Security', slug: 'avast-premium', categoryId: categories['security'],
      description: 'Bảo vệ máy tính khỏi mọi mối đe dọa trực tuyến. Lá chắn Ransomware.',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Avast_logo.svg/2560px-Avast_logo.svg.png',
      isHot: false, avgRating: 4.7, keywordNames: ["dietvirus", "security"],
      variants: [{ name: 'Key 1 Năm', price: 190000, orginalPrice: 600000 }]
    },
    {
      name: 'AdGuard License', slug: 'adguard', categoryId: categories['security'],
      description: 'Chặn quảng cáo toàn hệ thống (Web, App). Chống theo dõi quyền riêng tư.',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/AdGuard_Logo.png/1200px-AdGuard_Logo.png',
      isHot: true, avgRating: 4.9, keywordNames: ["security"],
      variants: [{ name: 'Vĩnh Viễn / 1 PC', price: 250000, orginalPrice: 800000 }]
    },
    {
      name: 'Trend Micro Maximum', slug: 'trend-micro', categoryId: categories['security'],
      description: 'Bảo mật tối đa, tích hợp AI để chặn các mối đe dọa mới.',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Trend_Micro_logo.svg/2560px-Trend_Micro_logo.svg.png',
      isHot: false, avgRating: 4.6, keywordNames: ["security", "dietvirus"],
      variants: [{ name: '1 Năm', price: 150000, orginalPrice: 500000 }]
    },
    {
      name: 'BKAV Pro Internet Security', slug: 'bkav-pro', categoryId: categories['security'],
      description: 'Phần mềm diệt virus số 1 Việt Nam. Công nghệ điện toán đám mây.',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/vi/e/e8/Logo_Bkav.png',
      isHot: false, avgRating: 4.5, keywordNames: ["bkav", "dietvirus"],
      variants: [{ name: 'Thẻ 1 Năm', price: 220000, orginalPrice: 299000 }]
    }
  ];

  // --- 4. EXECUTE SEEDING ---
  for (const p of productsList) {
    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        description: p.description,
        thumbnail: p.thumbnail,
        isHot: p.isHot,
        categoryId: p.categoryId,
        avgRating: p.avgRating,
        keyword: getKeywordConnect(p.keywordNames),
        aiMetadata: {}, 
      },
      create: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        thumbnail: p.thumbnail,
        isHot: p.isHot,
        categoryId: p.categoryId,
        avgRating: p.avgRating,
        keyword: getKeywordConnect(p.keywordNames),
        aiMetadata: {},
      },
    });

    console.log(`📦 Product: ${product.name}`);

    // Create Variants & Stock
    for (const v of p.variants) {
      let variant = await prisma.productVariant.findFirst({
        where: { productId: product.id, name: v.name }
      });

      if (variant) {
        variant = await prisma.productVariant.update({
          where: { id: variant.id },
          data: { price: v.price, orginalPrice: v.orginalPrice }
        });
      } else {
        variant = await prisma.productVariant.create({
          data: {
            name: v.name,
            price: v.price,
            orginalPrice: v.orginalPrice,
            productId: product.id,
          }
        });
      }

      // 5 keys per variant
      const stockData: any[] = [];
      for(let i = 0; i < 5; i++) {
        const rawKey = `VTV-${p.slug.toUpperCase().slice(0,4)}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        const encryptedKey = encryptionService.encryptionCredential(rawKey);
        stockData.push({
            credential: encryptedKey,
            variantId: variant.id,
            status: StockStatus.AVAILABLE
        });
      }
      await prisma.stockItem.createMany({ data: stockData });
    }
  }

  // --- SYSTEM CONFIG ---
  await prisma.systemConfig.upsert({
    where: { id: 1 },
    update: {},
    create: {
      maintenanceMode: false,
      emailNotification: true,
      bankInfo: "MB BANK - 000011112222 - ADMIN DEP TRAI"
    }
  });

  console.log('✅ Seeding finished successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });