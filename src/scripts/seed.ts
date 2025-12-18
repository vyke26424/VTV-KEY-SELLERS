// prisma/seed.ts

import { PrismaClient, Role, StockStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';
// Import EncryptionService để mã hóa key (đường dẫn có thể khác tùy máy bạn)
import { EncryptionService } from '../admin/utils/encryption/encryption.service';

// 1. Load biến môi trường (.env)
dotenv.config();

const prisma = new PrismaClient();

// 2. Mock ConfigService để nuôi EncryptionService (Vì seed chạy ngoài NestJS context)
const mockConfigService = {
  getOrThrow: (key: string) => {
    const value = process.env[key];
    if (!value) {
      throw new Error(`❌ Missing environment variable: ${key} in .env file`);
    }
    return value;
  },
} as any;

// 3. Khởi tạo Service Mã hóa
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

  // --- DANH MỤC (CATEGORIES) ---
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

  // --- DANH SÁCH 25 SẢN PHẨM MẪU ---
  const productsList = [
    // --- AI ---
    {
      name: 'ChatGPT Plus (GPT-4)',
      slug: 'chatgpt-plus',
      description: 'Truy cập GPT-4o, DALL-E 3, Data Analysis. Tài khoản chính chủ.',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg',
      isHot: true, categoryId: categories['ai'], avgRating: 4.9,
      variants: [{ name: '1 Tháng (Riêng)', price: 450000, orginalPrice: 550000 }, { name: '1 Tháng (Share)', price: 150000, orginalPrice: 200000 }]
    },
    {
      name: 'Midjourney Pro',
      slug: 'midjourney-pro',
      description: 'Tạo ảnh nghệ thuật AI đỉnh cao. Gói Pro không giới hạn fast hours.',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/e/ed/Midjourney_Emblem.png',
      isHot: true, categoryId: categories['ai'], avgRating: 4.8,
      variants: [{ name: 'Standard 1 Tháng', price: 650000, orginalPrice: 800000 }]
    },
    {
      name: 'Claude 3 Opus',
      slug: 'claude-3-opus',
      description: 'AI thông minh nhất hiện nay từ Anthropic. Xử lý văn bản dài cực tốt.',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Anthropic_logo.svg/2048px-Anthropic_logo.svg.png',
      isHot: false, categoryId: categories['ai'], avgRating: 4.7,
      variants: [{ name: 'Tài khoản riêng', price: 500000, orginalPrice: 600000 }]
    },
    {
        name: 'GitHub Copilot',
        slug: 'github-copilot',
        description: 'Trợ lý lập trình AI, code nhanh hơn 55%.',
        thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/2/29/GitHub_logo_2013.svg',
        isHot: false, categoryId: categories['ai'], avgRating: 4.9,
        variants: [{ name: 'Gói 1 Năm', price: 900000, orginalPrice: 2400000 }]
    },

    // --- GIẢI TRÍ ---
    {
      name: 'Netflix Premium 4K',
      slug: 'netflix-premium',
      description: 'Xem phim 4K HDR không quảng cáo. Hỗ trợ mọi thiết bị.',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/7/75/Netflix_icon.svg',
      isHot: true, categoryId: categories['entertainment'], avgRating: 4.8,
      variants: [{ name: '1 Tháng (Slot)', price: 89000, orginalPrice: 260000 }, { name: '1 Năm (Slot)', price: 950000, orginalPrice: 3120000 }]
    },
    {
      name: 'Spotify Premium',
      slug: 'spotify-premium',
      description: 'Nghe nhạc chất lượng cao, không quảng cáo.',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg',
      isHot: false, categoryId: categories['entertainment'], avgRating: 4.7,
      variants: [{ name: 'Gia hạn chính chủ 1 Năm', price: 290000, orginalPrice: 590000 }]
    },
    {
      name: 'YouTube Premium',
      slug: 'youtube-premium',
      description: 'Xem YouTube không quảng cáo + YouTube Music.',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg',
      isHot: true, categoryId: categories['entertainment'], avgRating: 4.9,
      variants: [{ name: '6 Tháng', price: 150000, orginalPrice: 350000 }, { name: '1 Năm', price: 280000, orginalPrice: 700000 }]
    },
    {
        name: 'Disney+ Hotstar',
        slug: 'disney-plus',
        description: 'Kho phim Marvel, Disney, Pixar khổng lồ.',
        thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney%2B_logo.svg',
        isHot: false, categoryId: categories['entertainment'], avgRating: 4.5,
        variants: [{ name: '1 Năm', price: 350000, orginalPrice: 800000 }]
    },

    // --- SOFTWARE & WINDOWS ---
    {
      name: 'Windows 11 Pro Key',
      slug: 'windows-11-pro',
      description: 'Key Retail bản quyền vĩnh viễn. Update thoải mái.',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/e/e6/Windows_11_logo.svg',
      isHot: true, categoryId: categories['software'], avgRating: 5.0,
      variants: [{ name: 'Key Vĩnh Viễn', price: 150000, orginalPrice: 4500000 }]
    },
    {
        name: 'Windows 10 Pro Key',
        slug: 'windows-10-pro',
        description: 'Bản quyền Windows 10 Pro giá rẻ, ổn định.',
        thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/8/87/Windows_logo_-_2021.svg',
        isHot: false, categoryId: categories['software'], avgRating: 4.8,
        variants: [{ name: 'Key Vĩnh Viễn', price: 120000, orginalPrice: 3500000 }]
    },
    {
        name: 'Office 365 Family',
        slug: 'office-365',
        description: 'Full bộ Office (Word, Excel...) + 1TB OneDrive.',
        thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/5/5f/Microsoft_Office_logo_%282019%E2%80%93present%29.svg',
        isHot: true, categoryId: categories['software'], avgRating: 4.9,
        variants: [{ name: 'Tài khoản 1 Năm', price: 250000, orginalPrice: 1700000 }]
    },
    {
        name: 'Internet Download Manager (IDM)',
        slug: 'idm-key',
        description: 'Tăng tốc download file cực nhanh. Key trọn đời.',
        thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Internet_Download_Manager_logo.png/600px-Internet_Download_Manager_logo.png',
        isHot: false, categoryId: categories['software'], avgRating: 4.7,
        variants: [{ name: 'Key trọn đời', price: 450000, orginalPrice: 600000 }]
    },

    // --- GAME ---
    {
      name: 'Elden Ring: Shadow of Erdtree',
      slug: 'elden-ring-dlc',
      description: 'Game of the Year. Bản quyền Steam Global.',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/c/cc/Elden_Ring_logo.svg',
      isHot: true, categoryId: categories['game'], avgRating: 4.9,
      variants: [{ name: 'Standard Edition', price: 890000, orginalPrice: 1200000 }]
    },
    {
        name: 'Black Myth: Wukong',
        slug: 'black-myth-wukong',
        description: 'Siêu phẩm hành động nhập vai Tôn Ngộ Không.',
        thumbnail: 'https://upload.wikimedia.org/wikipedia/en/4/47/Black_Myth_Wukong_cover_art.jpg', // Placeholder link
        isHot: true, categoryId: categories['game'], avgRating: 5.0,
        variants: [{ name: 'Pre-order Steam', price: 1200000, orginalPrice: 1500000 }]
    },
    {
        name: 'Grand Theft Auto V',
        slug: 'gta-v',
        description: 'Huyền thoại thế giới mở. Bao gồm GTA Online.',
        thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/7/70/Grand_Theft_Auto_V_logo.png',
        isHot: false, categoryId: categories['game'], avgRating: 4.8,
        variants: [{ name: 'Premium Edition', price: 250000, orginalPrice: 600000 }]
    },
    {
        name: 'Minecraft Java & Bedrock',
        slug: 'minecraft-pc',
        description: 'Game sinh tồn sáng tạo nhất thế giới.',
        thumbnail: 'https://upload.wikimedia.org/wikipedia/en/5/51/Minecraft_cover.png',
        isHot: false, categoryId: categories['game'], avgRating: 4.9,
        variants: [{ name: 'Key Global', price: 550000, orginalPrice: 750000 }]
    },

    // --- DESIGN ---
    {
        name: 'Canva Pro',
        slug: 'canva-pro',
        description: 'Thiết kế đồ họa đơn giản cho mọi người. Full tính năng Pro.',
        thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Canva_icon_2021.svg',
        isHot: true, categoryId: categories['design'], avgRating: 4.8,
        variants: [{ name: 'Nâng cấp chính chủ (Vĩnh viễn)', price: 190000, orginalPrice: 2000000 }]
    },
    {
        name: 'Adobe Creative Cloud',
        slug: 'adobe-cc',
        description: 'Full bộ ứng dụng Adobe (Photoshop, AI, Pre...). 100GB Cloud.',
        thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/4/42/Adobe_Creative_Cloud_rainbow_icon.png',
        isHot: false, categoryId: categories['design'], avgRating: 4.7,
        variants: [{ name: 'Gói 1 Năm', price: 1800000, orginalPrice: 8000000 }]
    },

    // --- VPN & EDUCATION ---
    {
        name: 'NordVPN',
        slug: 'nord-vpn',
        description: 'VPN bảo mật nhất thế giới. Tốc độ cao.',
        thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/3/3f/NordVPN-logo.svg',
        isHot: false, categoryId: categories['education'], avgRating: 4.6,
        variants: [{ name: 'Tài khoản 1 Năm', price: 250000, orginalPrice: 1200000 }]
    },
    {
        name: 'Duolingo Super',
        slug: 'duolingo-super',
        description: 'Học ngoại ngữ không quảng cáo, trái tim vô hạn.',
        thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/1/15/Duolingo_logo_2019.svg',
        isHot: false, categoryId: categories['education'], avgRating: 4.8,
        variants: [{ name: 'Gói Family 1 Năm', price: 190000, orginalPrice: 2000000 }]
    },
    {
        name: 'Coursera Plus',
        slug: 'coursera-plus',
        description: 'Học không giới hạn 7000+ khóa học từ các đại học hàng đầu.',
        thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/9/97/Coursera-Logo_600x600.svg',
        isHot: false, categoryId: categories['education'], avgRating: 4.9,
        variants: [{ name: 'Gói 1 Năm', price: 2500000, orginalPrice: 9000000 }]
    }
  ];

  // --- LƯU VÀO DB ---
  for (const p of productsList) {
    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        thumbnail: p.thumbnail,
        isHot: p.isHot,
        categoryId: p.categoryId,
        avgRating: p.avgRating,
      },
    });

    console.log(`📦 Product: ${product.name}`);

    for (const v of p.variants) {
        // Kiểm tra xem variant đã tồn tại chưa để tránh tạo trùng lặp khi chạy lại seed
        const existingVariant = await prisma.productVariant.findFirst({
            where: { productId: product.id, name: v.name }
        });

        if (existingVariant) {
            console.log(`   -> Variant: ${v.name} (Already exists - Skipping)`);
            continue;
        }

        const variant = await prisma.productVariant.create({
            data: {
                name: v.name,
                price: v.price,
                orginalPrice: v.orginalPrice,
                productId: product.id,
            }
        });

        // --- NẠP STOCK VÀ MÃ HÓA ---
        const stockData: any[] = [];
        
        for(let i = 0; i < 5; i++) {
            // Key giả: [SLUG]-[RANDOM]
            const rawKey = `KEY-${p.slug.toUpperCase().slice(0,4)}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
            
            // Mã hóa key
            const encryptedKey = encryptionService.encryptionCredential(rawKey);

            stockData.push({
                credential: encryptedKey, // Lưu key đã mã hóa
                variantId: variant.id,
                status: StockStatus.AVAILABLE
            });
        }

        await prisma.stockItem.createMany({ data: stockData });
        console.log(`   -> Variant: ${v.name} (+5 keys encrypted)`);
    }
  }
  await prisma.systemConfig.upsert({
    where: { id: 1 },
    update: {},
    create: {
      maintenanceMode: false,
      emailNotification: true,
      bankInfo: "MB BANK - 000011112222 - ANH VYKE ADMIN"
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