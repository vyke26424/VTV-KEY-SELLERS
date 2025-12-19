// prisma/seed.ts

import { PrismaClient, Role, StockStatus, Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
// Ensure this path is correct relative to your project structure
import { EncryptionService } from '../admin/utils/encryption/encryption.service';

// 1. Load environment variables
dotenv.config();

const prisma = new PrismaClient();

// 2. Mock ConfigService to satisfy EncryptionService (Since seed runs outside NestJS context)
const mockConfigService: any = {
  get: (key: string) => process.env[key],
  getOrThrow: (key: string) => {
    const value = process.env[key];
    if (!value) {
      throw new Error(`❌ Missing environment variable: ${key} in .env file`);
    }
    return value;
  },
};

// 3. Initialize Encryption Service
const encryptionService = new EncryptionService(mockConfigService);

async function main() {
  console.log('🌱 Start seeding...');

  // --- TẠO ADMIN ---
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const adminEmail = 'admin@vtvkeys.com';

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      password: hashedPassword,
      fullName: 'Quản Trị Viên',
      role: Role.ADMIN,
      balance: 999999, // Đại gia
    },
  });
  console.log(`👤 Admin ready: ${admin.email}`);

  // --- CATEGORIES ---
  const categoriesData = [
    { name: 'Trí tuệ nhân tạo (AI)', slug: 'ai' },
    { name: 'Giải Trí & Phim', slug: 'entertainment' },
    { name: 'Game Steam/Epic', slug: 'game' },
    { name: 'Phần mềm & Key Window', slug: 'software' },
    { name: 'Học tập & VPN', slug: 'education' },
    { name: 'Design & Đồ họa', slug: 'design' },
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

  // --- KEYWORDS ---
  const allKeywordNames = [
    "robot", "trí tuệ nhân tạo", "chatchit", "grok", "ai", "entertainment", "game",
    "chatgpt", "gpt-4o", "netflix", "4k", "spotify", "âm nhạc", "windows", "key",
    "elden-ring", "steam", "dlc", "midjourney", "tạo ảnh", "youtube", "premium",
    "wukong", "tayduky", "vpn", "design", "office", "adobe", "study", "security"
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
      .filter(k => k)
      .map(k => ({ id: k.id }))
  });

  // --- PRODUCTS LIST ---
  const productsList = [
    // AI
    {
      name: 'ChatGPT Plus (GPT-4)',
      slug: 'chatgpt-plus',
      description: 'Truy cập GPT-4o, DALL-E 3, Data Analysis. Tài khoản chính chủ.',
      thumbnail: 'https://shop.activeitfirm.com/wp-content/uploads/2025/01/Chat-GPT-Plus-1-600x600.png',
      isHot: true, categoryId: categories['ai'], avgRating: 4.9,
      keywordNames: ["chatgpt", "gpt-4o", "ai", "trí tuệ nhân tạo", "chatchit"],
      aiMetadata: { genre: ["Trí tuệ nhân tạo", "Chatbot"], platform: ["Web", "Mobile"], seoScore: 99 },
      variants: [{ name: '1 Tháng (Riêng)', price: 450000, orginalPrice: 550000 }, { name: '1 Tháng (Share)', price: 150000, orginalPrice: 200000 }]
    },
    {
      name: 'Midjourney Pro',
      slug: 'midjourney-pro',
      description: 'Tạo ảnh nghệ thuật AI đỉnh cao. Gói Pro không giới hạn fast hours.',
      thumbnail: 'https://registry.npmmirror.com/@lobehub/icons-static-png/1.75.0/files/dark/midjourney.png',
      isHot: true, categoryId: categories['ai'], avgRating: 4.8,
      keywordNames: ["midjourney", "tạo ảnh", "ai", "trí tuệ nhân tạo"],
      aiMetadata: { genre: ["AI Art", "Generative AI"], platform: ["Discord"], seoScore: 85 },
      variants: [{ name: 'Standard 1 Tháng', price: 650000, orginalPrice: 800000 }]
    },
    {
      name: 'Grok AI Bản Quyền',
      slug: 'grok-ai-ban-quyen',
      description: 'Sản phẩm AI tiên tiến từ X Corp, tích hợp với các nền tảng giải trí và game.',
      thumbnail: 'https://svgstack.com/media/img/grok-ai-app-logo-ohHJ386070.webp',
      isHot: true, categoryId: categories['ai'], avgRating: 5.0,
      keywordNames: ["robot", "trí tuệ nhân tạo", "chatchit", "grok", "ai"],
      aiMetadata: { generatedBy: "X-Corp", seoScore: 95, targetCategories: ['entertainment', 'game'] },
      variants: [{ name: 'Gói 1 Tháng', price: 100000, orginalPrice: 150000 }]
    },
    {
      name: 'Claude 3 Opus',
      slug: 'claude-3-opus',
      description: 'AI thông minh nhất hiện nay từ Anthropic. Xử lý văn bản dài cực tốt.',
      thumbnail: 'https://pbs.twimg.com/media/GH6cqzWXkAApxQl.jpg',
      isHot: false, categoryId: categories['ai'], avgRating: 4.7,
      keywordNames: ["ai", "trí tuệ nhân tạo", "chatchit"],
      aiMetadata: { genre: ["LLM", "Chatbot"], platform: ["Web"], seoScore: 92 },
      variants: [{ name: 'Tài khoản riêng', price: 500000, orginalPrice: 600000 }]
    },
    {
        name: 'GitHub Copilot',
        slug: 'github-copilot',
        description: 'Trợ lý lập trình AI, code nhanh hơn 55%.',
        thumbnail: 'https://github.gallerycdn.vsassets.io/extensions/github/copilotvs/1.206.0.0/1719349649662/Microsoft.VisualStudio.Services.Icons.Default',
        isHot: false, categoryId: categories['ai'], avgRating: 4.9,
        keywordNames: ["ai", "robot", "trí tuệ nhân tạo"],
        aiMetadata: { genre: ["Coding AI"], platform: ["VS Code", "JetBrains"], seoScore: 96 },
        variants: [{ name: 'Gói 1 Năm', price: 900000, orginalPrice: 2400000 }]
    },
    // ENTERTAINMENT
    {
      name: 'Netflix Premium 4K',
      slug: 'netflix-premium',
      description: 'Xem phim 4K HDR không quảng cáo. Hỗ trợ mọi thiết bị.',
      thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGZhYUrmk6vDmi1-Pj7oI-HzTpQDCi9-IFTA&s',
      isHot: true, categoryId: categories['entertainment'], avgRating: 4.8,
      keywordNames: ["netflix", "4k", "entertainment", "phim"],
      aiMetadata: { features: ["4K UHD", "Đa thiết bị"], suitable_for: ["Gia đình", "Cá nhân"], seoScore: 92 },
      variants: [{ name: '1 Tháng (Slot)', price: 89000, orginalPrice: 260000 }, { name: '1 Năm (Slot)', price: 950000, orginalPrice: 3120000 }]
    },
    {
      name: 'Spotify Premium',
      slug: 'spotify-premium',
      description: 'Nghe nhạc chất lượng cao, không quảng cáo.',
      thumbnail: 'https://m.media-amazon.com/images/I/31B2Nyzd8XL.png',
      isHot: false, categoryId: categories['entertainment'], avgRating: 4.7,
      keywordNames: ["entertainment", "music", "spotify", "âm nhạc"],
      aiMetadata: { features: ["Nghe nhạc không quảng cáo", "Chất lượng cao"], suitable_for: ["Cá nhân", "Gia đình"], seoScore: 90 },
      variants: [{ name: 'Gia hạn 1 Năm', price: 290000, orginalPrice: 590000 }]
    },
    {
      name: 'YouTube Premium',
      slug: 'youtube-premium',
      description: 'Xem YouTube không quảng cáo + YouTube Music.',
      thumbnail: 'https://file.hstatic.net/200000061442/article/youtube_15d1e937db924cecb271594febec2780_1024x1024.png',
      isHot: true, categoryId: categories['entertainment'], avgRating: 4.9,
      keywordNames: ["youtube", "premium", "entertainment", "music"],
      aiMetadata: { features: ["Không quảng cáo", "Nghe nhạc nền"], suitable_for: ["Cá nhân"], seoScore: 94 },
      variants: [{ name: '6 Tháng', price: 150000, orginalPrice: 350000 }, { name: '1 Năm', price: 280000, orginalPrice: 700000 }]
    },
    {
        name: 'Disney+ Hotstar',
        slug: 'disney-plus',
        description: 'Kho phim Marvel, Disney, Pixar khổng lồ.',
        thumbnail: 'https://cdn.mos.cms.futurecdn.net/v2/t:0,l:420,cw:1080,ch:1080,q:80,w:1080/c6fFaJ2NrD7u2g8TP2u2iY.jpg',
        isHot: false, categoryId: categories['entertainment'], avgRating: 4.5,
        keywordNames: ["entertainment", "phim"],
        aiMetadata: { features: ["Full HD", "Disney Originals"], seoScore: 88 },
        variants: [{ name: '1 Năm', price: 350000, orginalPrice: 800000 }]
    },
    // SOFTWARE
    {
      name: 'Windows 11 Pro Key',
      slug: 'windows-11-pro',
      description: 'Key Retail bản quyền vĩnh viễn. Update thoải mái.',
      thumbnail: 'https://keyoff.net/wp-content/uploads/2021/10/Key-Windows-11-gia-re.jpg',
      isHot: true, categoryId: categories['software'], avgRating: 5.0,
      keywordNames: ["windows", "key", "phần mềm", "office"],
      aiMetadata: { genre: ["Hệ điều hành", "Key bản quyền"], platform: ["PC"], seoScore: 95 },
      variants: [{ name: 'Key Vĩnh Viễn', price: 150000, orginalPrice: 4500000 }]
    },
    {
        name: 'Windows 10 Pro Key',
        slug: 'windows-10-pro',
        description: 'Bản quyền Windows 10 Pro giá rẻ, ổn định.',
        thumbnail: 'https://aiie.me/wp-content/uploads/2021/10/Windows-10-pro-1-e1633961713841.jpg',
        isHot: false, categoryId: categories['software'], avgRating: 4.8,
        keywordNames: ["windows", "key"],
        aiMetadata: { genre: ["Hệ điều hành"], platform: ["PC"], seoScore: 90 },
        variants: [{ name: 'Key Vĩnh Viễn', price: 120000, orginalPrice: 3500000 }]
    },
    {
        name: 'Office 365 Family',
        slug: 'office-365',
        description: 'Full bộ Office (Word, Excel...) + 1TB OneDrive.',
        thumbnail: 'https://hieucomvn.s3.ap-southeast-1.amazonaws.com/wp-content/uploads/2020/05/07202309/0000287_office-365-business-essentials_550.jpeg',
        isHot: true, categoryId: categories['software'], avgRating: 4.9,
        keywordNames: ["office", "key", "phần mềm"],
        aiMetadata: { genre: ["Productivity"], platform: ["Multi-device"], seoScore: 93 },
        variants: [{ name: 'Tài khoản 1 Năm', price: 250000, orginalPrice: 1700000 }]
    },
    {
        name: 'Internet Download Manager (IDM)',
        slug: 'idm-key',
        description: 'Tăng tốc download file cực nhanh. Key trọn đời.',
        thumbnail: 'https://3.bp.blogspot.com/-UlQVjpBhT44/Th3BOsfBGQI/AAAAAAAAAFM/Ww2qhQgqKI8/s1600/Internet_Download_Manager.jpg',
        isHot: false, categoryId: categories['software'], avgRating: 4.7,
        keywordNames: ["key", "phần mềm"],
        aiMetadata: { genre: ["Utility"], platform: ["Windows"], seoScore: 85 },
        variants: [{ name: 'Key trọn đời', price: 450000, orginalPrice: 600000 }]
    },
    // GAME
    {
      name: 'Elden Ring: Shadow of Erdtree',
      slug: 'elden-ring-dlc',
      description: 'Game of the Year. Bản quyền Steam Global.',
      thumbnail: 'https://assets-prd.ignimgs.com/2021/06/12/elden-ring-button-03-1623460560664.jpg',
      isHot: true, categoryId: categories['game'], avgRating: 4.9,
      keywordNames: ["elden-ring", "steam", "dlc", "game", "souls"],
      aiMetadata: { genre: ["Action RPG", "DLC"], platform: ["Steam"], seoScore: 97 },
      variants: [{ name: 'Standard Edition', price: 890000, orginalPrice: 1200000 }]
    },
    {
        name: 'Black Myth: Wukong',
        slug: 'black-myth-wukong',
        description: 'Siêu phẩm hành động nhập vai Tôn Ngộ Không.',
        thumbnail: 'https://tintuc-divineshop.cdn.vccloud.vn/wp-content/uploads/2024/08/blackmyth-1723969364570.jpg',
        isHot: true, categoryId: categories['game'], avgRating: 5.0,
        keywordNames: ["game", "steam", "wukong", "tayduky"],
        aiMetadata: { genre: ["Action RPG", "Souls-like"], platform: ["Steam", "PC"], seoScore: 98 },
        variants: [{ name: 'Pre-order Steam', price: 1200000, orginalPrice: 1500000 }]
    },
    {
        name: 'Grand Theft Auto VI',
        slug: 'gta-vi',
        description: 'Huyền thoại thế giới mở. Bao gồm GTA Online.',
        thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJ_QP0rztAn1qL1P7xdj2nc-ayDpUCOm901g&s',
        isHot: false, categoryId: categories['game'], avgRating: 4.8,
        keywordNames: ["game", "steam"],
        aiMetadata: { genre: ["Open World"], platform: ["Rockstar", "Steam"], seoScore: 92 },
        variants: [{ name: 'Premium Edition', price: 250000, orginalPrice: 600000 }]
    },
    {
        name: 'Minecraft Java & Bedrock',
        slug: 'minecraft-pc',
        description: 'Game sinh tồn sáng tạo nhất thế giới.',
        thumbnail: 'https://news.vio.vn/wp-content/uploads/2025/03/minecraft-pe-la-gi-1-1.jpg',
        isHot: false, categoryId: categories['game'], avgRating: 4.9,
        keywordNames: ["game"],
        aiMetadata: { genre: ["Sandbox"], platform: ["PC"], seoScore: 94 },
        variants: [{ name: 'Key Global', price: 550000, orginalPrice: 750000 }]
    },
    // DESIGN
    {
        name: 'Canva Pro',
        slug: 'canva-pro',
        description: 'Thiết kế đồ họa đơn giản cho mọi người. Full tính năng Pro.',
        thumbnail: 'https://digimarket.vn/thumbnails/products/large/uploads/canva-pro-icon-1.png.webp',
        isHot: true, categoryId: categories['design'], avgRating: 4.8,
        keywordNames: ["design", "tạo ảnh"],
        aiMetadata: { genre: ["Design Tool"], platform: ["Web", "Mobile"], seoScore: 95 },
        variants: [{ name: 'Nâng cấp chính chủ (Vĩnh viễn)', price: 190000, orginalPrice: 2000000 }]
    },
    {
        name: 'Adobe Creative Cloud',
        slug: 'adobe-cc',
        description: 'Full bộ ứng dụng Adobe (Photoshop, AI, Pre...). 100GB Cloud.',
        thumbnail: 'https://s7494.pcdn.co/byod/files/2022/06/adobe-creative-cloud-300x250.png',
        isHot: false, categoryId: categories['design'], avgRating: 4.7,
        keywordNames: ["adobe", "design"],
        aiMetadata: { genre: ["Creative Suite"], platform: ["Windows", "Mac"], seoScore: 90 },
        variants: [{ name: 'Gói 1 Năm', price: 1800000, orginalPrice: 8000000 }]
    },
    // VPN & EDUCATION
    {
        name: 'NordVPN',
        slug: 'nord-vpn',
        description: 'VPN bảo mật nhất thế giới. Tốc độ cao.',
        thumbnail: 'https://i0.wp.com/software.centrix.asia/wp-content/uploads/unnamed.jpg?fit=512%2C512&ssl=1',
        isHot: false, categoryId: categories['education'], avgRating: 4.6,
        keywordNames: ["vpn", "security"],
        aiMetadata: { genre: ["Security"], platform: ["Multi-platform"], seoScore: 88 },
        variants: [{ name: 'Tài khoản 1 Năm', price: 250000, orginalPrice: 1200000 }]
    },
    {
        name: 'Duolingo Super',
        slug: 'duolingo-super',
        description: 'Học ngoại ngữ không quảng cáo, trái tim vô hạn.',
        thumbnail: 'https://banquyen88.vn/wp-content/uploads/2023/10/Nang-cap-Duolingo-Supper-1.png',
        isHot: false, categoryId: categories['education'], avgRating: 4.8,
        keywordNames: ["study"],
        aiMetadata: { genre: ["Education"], platform: ["Mobile"], seoScore: 91 },
        variants: [{ name: 'Gói Family 1 Năm', price: 190000, orginalPrice: 2000000 }]
    },
    {
        name: 'Coursera Plus',
        slug: 'coursera-plus',
        description: 'Học không giới hạn 7000+ khóa học từ các đại học hàng đầu.',
        thumbnail: 'https://www.ueh.edu.vn/images/upload/editer/nhung%20website%20can%20biet%20%E1%BA%A3nh%202%20-%20logo%20Coursera.png',
        isHot: false, categoryId: categories['education'], avgRating: 4.9,
        keywordNames: ["study"],
        aiMetadata: { genre: ["Education"], platform: ["Web"], seoScore: 93 },
        variants: [{ name: 'Gói 1 Năm', price: 2500000, orginalPrice: 9000000 }]
    }
  ];

  // --- SAVE TO DB ---
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
        aiMetadata: p.aiMetadata as Prisma.JsonObject,
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
        aiMetadata: p.aiMetadata as Prisma.JsonObject,
      },
    });

    console.log(`📦 Product: ${product.name}`);

    for (const v of p.variants) {
        const existingVariant = await prisma.productVariant.findFirst({
            where: { productId: product.id, name: v.name }
        });

        let variant;
        if (existingVariant) {
            variant = await prisma.productVariant.update({
                where: { id: existingVariant.id },
                data: {
                    price: v.price,
                    orginalPrice: v.orginalPrice
                }
            });
            console.log(`   -> Variant: ${v.name} (Updated)`);
        } else {
            variant = await prisma.productVariant.create({
                data: {
                    name: v.name,
                    price: v.price,
                    orginalPrice: v.orginalPrice,
                    productId: product.id,
                }
            });
            console.log(`   -> Variant: ${v.name} (Created)`);
        }

        // --- ENCRYPT KEYS (5 Per Variant) ---
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
        console.log(`      (+5 keys encrypted)`);
    }
  }

  // --- SYSTEM CONFIG ---
  await prisma.systemConfig.upsert({
    where: { id: 1 },
    update: {},
    create: {
      maintenanceMode: false,
      emailNotification: true,
      bankInfo: "MB BANK - 000011112222 - HOANG VU ADMIN"
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