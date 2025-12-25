// prisma/seed.ts

import { PrismaClient, StockStatus } from '@prisma/client';
import * as dotenv from 'dotenv';
import { EncryptionService } from '../../src/admin/utils/encryption/encryption.service'; // Chú ý đường dẫn import
// Import data
import { productsPart1 } from './seed-data/part1';
import { productsPart2 } from './seed-data/part2';
import { productsPart3 } from './seed-data/part3';

// 1. Load environment variables
dotenv.config();

const prisma = new PrismaClient();

// 2. Mock ConfigService
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

async function seedProducts(products: any[], categories: Record<string, number>, createdKeywords: Record<string, any>) {
  for (const p of products) {
    if (!categories[p.categorySlug]) {
      console.warn(`⚠️ Category not found for product: ${p.name} (${p.categorySlug})`);
      continue;
    }

    // Helper connect keyword
    const getKeywordConnect = (names: string[]) => ({
      connect: (names || [])
        .map(name => createdKeywords[name])
        .filter(k => k)
        .map(k => ({ id: k.id }))
    });

    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        name: p.name,
        description: p.description,
        thumbnail: p.thumbnail,
        isHot: p.isHot,
        categoryId: categories[p.categorySlug],
        avgRating: p.avgRating,
        keyword: getKeywordConnect(p.keywordNames),
        aiMetadata: p.aiMetadata || {}, // Cập nhật AI Metadata
      },
      create: {
        name: p.name,
        slug: p.slug,
        description: p.description,
        thumbnail: p.thumbnail,
        isHot: p.isHot,
        categoryId: categories[p.categorySlug],
        avgRating: p.avgRating,
        keyword: getKeywordConnect(p.keywordNames),
        aiMetadata: p.aiMetadata || {},
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

      // Check stock exists to avoid spamming database
      const existingStock = await prisma.stockItem.count({ where: { variantId: variant.id }});
      if (existingStock < 5) {
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
  }
}

async function main() {
  console.log('🌱 Start seeding VTV Key Sellers Data (Modular)...');

  // --- 1. CATEGORIES ---
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

  // --- 2. KEYWORDS ---
  const allKeywordNames = [
    // AI
    "chatgpt", "gpt-4o", "openai", "midjourney", "claude", "gemini", "google", "copilot", "quillbot", "ai", "bot", "jasper", "perplexity", "trợ lý ảo", "viết code", "gpt-4", "vẽ tranh ai", "tạo ảnh", "nghệ thuật số", "google ai", "gemini ultra", "google one",
    // Entertainment
    "netflix", "youtube", "spotify", "k+", "vieon", "fpt", "hbo", "disney", "phim", "nhạc", "4k", "amazon", "apple", "tidal", "crunchyroll", "premium", "youtube không quảng cáo", "youtube music", "nâng cấp mail chính chủ", "ytb premium", "xem phim 4k", "phim mỹ", "nghe nhạc", "âm thanh chất lượng cao",
    // Game
    "steam", "valorant", "lienminh", "gta", "minecraft", "roblox", "wukong", "fc24", "fifa", "game", "napthe", "xbox", "playstation", "cyberpunk", "pubg", "game hành động", "nhập vai", "tây du ký", "souls-like", "nạp game", "skin súng", "riot games", "nạp steam", "mua game bản quyền", "thẻ steam",
    // Software
    "windows", "office", "microsoft", "idm", "winrar", "driver", "key", "banquyen", "google-drive", "jetbrains", "vmware", "winzip", "key win 11", "bản quyền windows", "hệ điều hành", "word", "excel", "powerpoint", "lưu trữ đám mây", "tải nhanh", "bắt link video", "download manager",
    // Education & VPN
    "duolingo", "coursera", "udemy", "grammarly", "zoom", "elsa", "vpn", "nordvpn", "expressvpn", "ip", "skillshare", "linkedin", "scribd", "study", "học tiếng anh", "ngoại ngữ", "app học tập", "fake ip", "bảo mật internet", "riêng tư",
    // Design
    "canva", "adobe", "photoshop", "capcut", "freepik", "envato", "lightroom", "edit", "figma", "motion", "pikbest", "thiết kế online", "xóa phông", "làm slide", "chỉnh sửa ảnh", "dựng phim", "đồ họa",
    // Security
    "kaspersky", "bitdefender", "malwarebytes", "virus", "dietvirus", "bao-mat", "norton", "bkav", "eset", "mcafee", "diệt virus", "bảo mật", "chống hacker", "chặn quảng cáo", "lọc web", "quyền riêng tư"
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

  // --- 3. RUN BATCHES ---
  console.log('--- Batch 1: AI & Entertainment ---');
  await seedProducts(productsPart1, categories, createdKeywords);

  console.log('--- Batch 2: Game & Software ---');
  await seedProducts(productsPart2, categories, createdKeywords);

  console.log('--- Batch 3: Education, Design & Security ---');
  await seedProducts(productsPart3, categories, createdKeywords);

  // --- 4. SYSTEM CONFIG ---
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