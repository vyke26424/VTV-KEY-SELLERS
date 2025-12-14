// prisma/seed.ts

import { PrismaClient, Role, StockStatus, Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Start seeding...');

  // --- 1. TẠO USER ADMIN ---
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
      balance: 99999999, // Tiền vô hạn để test
    },
  });
  console.log(`👤 Admin user ready: ${admin.email}`);

  // --- 2. DANH MỤC (CATEGORIES) ---
  const categoriesData = [
    { name: 'Trí tuệ nhân tạo (AI)', slug: 'ai' },
    { name: 'Giải Trí & Phim', slug: 'entertainment' },
    { name: 'Game Steam/Epic', slug: 'game' },
    { name: 'Phần mềm & Key Window', slug: 'software' },
    { name: 'Học tập & VPN', slug: 'education' },
  ];

  const categories = {};
  for (const cat of categoriesData) {
    const newCat = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    categories[cat.slug] = newCat.id;
    console.log(`📂 Category created: ${newCat.name}`);
  }

  // --- 3. SẢN PHẨM & GÓI (VARIANTS) ---
  const productsList = [
    {
      name: 'Tài khoản ChatGPT Plus',
      slug: 'chatgpt-plus',
      description: 'Truy cập GPT-4o, DALL-E 3, phân tích dữ liệu nâng cao. Tài khoản chính chủ, bảo hành trọn đời.',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg',
      isHot: true,
      categoryId: categories['ai'],
      avgRating: 4.9,
      variants: [
        { name: 'Tài khoản riêng (1 Tháng)', price: 450000, orginalPrice: 550000 },
        { name: 'Tài khoản share (1 Tháng)', price: 150000, orginalPrice: 200000 },
      ]
    },
    {
      name: 'Netflix Premium 4K (Chính chủ)',
      slug: 'netflix-premium',
      description: 'Xem phim không giới hạn, chất lượng 4K UHD. Hỗ trợ Tivi, Điện thoại, Máy tính.',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/7/75/Netflix_icon.svg',
      isHot: true,
      categoryId: categories['entertainment'],
      avgRating: 4.8,
      variants: [
        { name: '1 Tháng (Slot riêng)', price: 89000, orginalPrice: 260000 },
        { name: '1 Năm (Tiết kiệm)', price: 950000, orginalPrice: 3120000 },
      ]
    },
    {
      name: 'Spotify Premium',
      slug: 'spotify-premium',
      description: 'Nghe nhạc không quảng cáo, chất lượng cao, tải nhạc offline.',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg',
      isHot: false,
      categoryId: categories['entertainment'],
      avgRating: 4.7,
      variants: [
        { name: 'Gia hạn chính chủ (1 Năm)', price: 290000, orginalPrice: 590000 },
      ]
    },
    {
      name: 'Windows 11 Pro (Key Retail)',
      slug: 'windows-11-pro',
      description: 'Key kích hoạt bản quyền Windows 11 Pro vĩnh viễn. Update thoải mái.',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/e/e6/Windows_11_logo.svg',
      isHot: true,
      categoryId: categories['software'],
      avgRating: 5.0,
      variants: [
        { name: 'Key Vĩnh Viễn', price: 150000, orginalPrice: 4500000 },
      ]
    },
    {
      name: 'Elden Ring: Shadow of the Erdtree',
      slug: 'elden-ring-dlc',
      description: 'Siêu phẩm game hành động nhập vai. Bản quyền Steam Gift/Key global.',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/c/cc/Elden_Ring_logo.svg',
      isHot: true,
      categoryId: categories['game'],
      avgRating: 4.9,
      variants: [
        { name: 'Standard Edition', price: 890000, orginalPrice: 1200000 },
        { name: 'Deluxe Edition', price: 1150000, orginalPrice: 1500000 },
      ]
    },
    {
      name: 'Midjourney Pro',
      slug: 'midjourney-pro',
      description: 'Công cụ tạo ảnh AI tốt nhất thế giới hiện nay. Gói Pro tạo ảnh không giới hạn.',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/e/ed/Midjourney_Emblem.png',
      isHot: false,
      categoryId: categories['ai'],
      avgRating: 4.6,
      variants: [
        { name: 'Gói Standard (1 Tháng)', price: 650000, orginalPrice: 800000 },
      ]
    },
    {
      name: 'YouTube Premium',
      slug: 'youtube-premium',
      description: 'Xem YouTube không quảng cáo, nghe nhạc nền, YouTube Music Premium.',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg',
      isHot: true,
      categoryId: categories['entertainment'],
      avgRating: 4.9,
      variants: [
        { name: 'Nâng cấp chính chủ (6 Tháng)', price: 150000, orginalPrice: 350000 },
        { name: 'Nâng cấp chính chủ (1 Năm)', price: 280000, orginalPrice: 700000 },
      ]
    },
  ];

  for (const p of productsList) {
    // 1. Tạo sản phẩm
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

    console.log(`📦 Product created: ${product.name}`);

    // 2. Tạo Variants & Stock cho sản phẩm đó
    for (const v of p.variants) {
        // Tạo variant
        const variant = await prisma.productVariant.create({
            data: {
                name: v.name,
                price: v.price,
                orginalPrice: v.orginalPrice,
                productId: product.id,
            }
        });

        // --- 4. NẠP STOCK (KEY) CHO TỪNG VARIANT ---
        // SỬA Ở ĐÂY: Thêm : any[]
        const stockData: any[] = []; 
        
        for(let i = 0; i < 20; i++) {
            // Key giả: VTV-KEY-[ProductSlug]-[Random]
            const fakeKey = `VTV-${p.slug.toUpperCase().slice(0,5)}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
            
            stockData.push({
                credential: fakeKey,
                variantId: variant.id,
                status: StockStatus.AVAILABLE // Đảm bảo StockStatus đã được import ở trên cùng
            });
        }

        await prisma.stockItem.createMany({ data: stockData });
        console.log(`   -> Created Variant: ${v.name} (+20 keys)`);
    }
  }

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