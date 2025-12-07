// prisma/seed.ts

import { PrismaClient, Role, StockStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // 1. Create Default Admin User
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
      balance: 1000000,
    },
  });
  console.log(`Created/updated Admin user: ${admin.email}`);

  // 2. Define and Create Categories (Matches Home.jsx CATEGORIES)
  const categoriesToCreate = [
    { name: 'Sản Phẩm AI', slug: 'ai' },
    { name: 'Giải Trí', slug: 'entertainment' },
    { name: 'Steam game', slug: 'game' },
  ];

  const categories = {};
  for (const cat of categoriesToCreate) {
    const newCat = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    categories[cat.slug] = newCat;
    console.log(`Created Category: ${newCat.name}`);
  }

  // 3. Create Sample Products
  // Note: 'isHot: true' ensures it shows up in the 'HOT TREND' shelf in Home.jsx

  const chatGpt = await prisma.product.upsert({
    where: { slug: 'chatgpt-plus-1-thang' },
    update: {},
    create: {
      name: 'Tài khoản ChatGPT Plus 1 Tháng',
      slug: 'chatgpt-plus-1-thang',
      description: 'Truy cập GPT-4, DALL-E 3 và các công cụ phân tích dữ liệu tiên tiến.',
      thumbnail: 'https://placehold.co/400x400/10a37f/white/png?text=AI', // Placeholder URL
      isHot: true, // Shows up in HOT TREND
      categoryId: categories['ai'].id,
      avgRating: 4.8,
    },
  });
  console.log(`Created Product: ${chatGpt.name}`);

  const netflix = await prisma.product.upsert({
    where: { slug: 'netflix-premium-1-nam' },
    update: {},
    create: {
      name: 'Netflix Premium 1 Năm (4K)',
      slug: 'netflix-premium-1-nam',
      description: 'Tài khoản xem phim chất lượng cao 4K trên mọi thiết bị.',
      thumbnail: 'https://placehold.co/400x400/E50914/white/png?text=NETFLIX',
      isHot: true, // Shows up in HOT TREND
      categoryId: categories['entertainment'].id,
      avgRating: 4.5,
    },
  });
  console.log(`Created Product: ${netflix.name}`);

  // START: Added Minecraft Product (isHot: false)
  const minecraft = await prisma.product.upsert({
    where: { slug: 'minecraft-og' },
    update: {},
    create: {
      name: 'Minecraft OG (Bản Quyền)',
      slug: 'minecraft-og',
      description: 'Game xây dựng và phiêu lưu sinh tồn nổi tiếng thế giới.',
      thumbnail: 'https://placehold.co/400x400/0078D4/white/png?text=MINECRAFT',
      isHot: false, // NOT Hot
      categoryId: categories['game'].id,
      avgRating: 4.9,
    },
  });
  console.log(`Created Product: ${minecraft.name}`);
  // END: Added Minecraft Product

  // START: Added Roblox Product (isHot: true)
  const roblox = await prisma.product.upsert({
    where: { slug: 'roblox-premium' },
    update: {},
    create: {
      name: 'Roblox Premium (Tài Khoản)',
      slug: 'roblox-premium',
      description: 'Tài khoản Premium để truy cập các tính năng độc quyền trong Roblox.',
      thumbnail: 'https://placehold.co/400x400/000000/white/png?text=ROBLOX',
      isHot: true, // IS Hot
      categoryId: categories['game'].id,
      avgRating: 4.2,
    },
  });
  console.log(`Created Product: ${roblox.name}`);
  // END: Added Roblox Product


  // 4. Create Product Variants (The actual packages)

  const chatGptVariant = await prisma.productVariant.create({
    data: {
      name: 'Gói 1 Tháng',
      price: 250000.00,
      orginalPrice: 300000.00,
      productId: chatGpt.id,
    },
  });

  const netflixVariant = await prisma.productVariant.create({
    data: {
      name: 'Gói 1 Năm',
      price: 1500000.00,
      orginalPrice: 1800000.00,
      productId: netflix.id,
    },
  });

  // START: Added Netflix 1 Month Variant
  const netflixVariant1Month = await prisma.productVariant.create({
    data: {
      name: 'Gói 1 Tháng',
      price: 200000.00,
      orginalPrice: 200000.00, // Assuming final price is 200k, and original price is also 200k if no sale.
      productId: netflix.id,
    },
  });
  // END: Added Netflix 1 Month Variant

  // START: Added Minecraft and Roblox Variants
  const minecraftVariant = await prisma.productVariant.create({
    data: {
      name: 'Key Game',
      price: 625000.00,
      orginalPrice: 730000.00,
      productId: minecraft.id,
    },
  });

  const robloxVariant = await prisma.productVariant.create({
    data: {
      name: 'Tài Khoản',
      price: 200000.00,
      orginalPrice: 100000.00,
      productId: roblox.id,
    },
  });
  // END: Added Minecraft and Roblox Variants

  console.log('Created Product Variants.');


  // 5. Create Stock Items (The keys/accounts to be sold)

  await prisma.stockItem.createMany({
    data: [
      {
        credential: 'GPT-Key-12345-admin@key.com',
        variantId: chatGptVariant.id,
        status: StockStatus.AVAILABLE,
      },
      {
        credential: 'GPT-Key-54321-user@key.com',
        variantId: chatGptVariant.id,
        status: StockStatus.AVAILABLE,
      },
      {
        credential: 'NFLX-PREM-1YR-A1B2C3D4',
        variantId: netflixVariant.id,
        status: StockStatus.AVAILABLE,
      },
      // START: Added Stock for new variants
      {
        credential: 'NFLX-PREM-1MO-A5B6C7D8',
        variantId: netflixVariant1Month.id,
        status: StockStatus.AVAILABLE,
      },
      {
        credential: 'MC-KEY-1111',
        variantId: minecraftVariant.id,
        status: StockStatus.AVAILABLE,
      },
      {
        credential: 'RB-ACCT-9999',
        variantId: robloxVariant.id,
        status: StockStatus.AVAILABLE,
      },
      // END: Added Stock for new variants
    ],
  });
  console.log('Added Stock Items (Keys).');

  console.log('Seeding finished successfully.');

}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });