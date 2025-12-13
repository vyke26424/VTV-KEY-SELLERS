// prisma/seed.ts

import { PrismaClient, Role, StockStatus, Prisma } from '@prisma/client'; // 
import * as bcrypt from 'bcrypt';
const prisma = new PrismaClient(); // 

// --- NEW HELPER FUNCTION: Replaces upsertProductVariant for non-compound-unique models ---
// This function manually implements the upsert logic for ProductVariant
async function upsertProductVariant(productId: number, variantData: any) {
    // 1. Try to FIND the variant based on the product ID and variant name
    const existingVariant = await prisma.productVariant.findFirst({
        where: {
            productId: productId,
            name: variantData.name,
        },
    });

    if (existingVariant) {
        // 2. If FOUND, UPDATE it
        return prisma.productVariant.update({
            where: { id: existingVariant.id },
            data: {
                price: variantData.price,
                orginalPrice: variantData.orginalPrice,
            },
        });
    } else {
        // 3. If NOT FOUND, CREATE it
        return prisma.productVariant.create({
            data: {
                ...variantData,
                productId: productId,
            }
        });
    }
}
// ----------------------------------------------------------------------------------------

// Helper to ensure a Keyword exists and return its connection object
async function upsertKeyword(name: string) {
    const keyword = await prisma.keywords.upsert({
        where: { name: name },
        update: {},
        create: { name: name },
    });
    return { id: keyword.id }; // [cite: 5]
}

async function main() {
    console.log('🌱 Start seeding...'); // [cite: 6]

    // --- 0. TẠO USER ADMIN (From original seed.ts) --- [cite: 6]
    const hashedPassword = await bcrypt.hash('admin123', 10); // [cite: 6]
    const adminEmail = 'admin@vtvkeys.com'; // [cite: 7]

    const admin = await prisma.user.upsert({
        where: { email: adminEmail },
        update: {},
        create: {
            email: adminEmail,
            password: hashedPassword,
            fullName: 'Quản Trị Viên',
            role: Role.ADMIN,
            balance: 99999999, // Tiền vô hạn để test [cite: 8]
        },
    });
    console.log(`👤 Admin user ready: ${admin.email}`); // [cite: 9]
    // ----------------------------------------------------------------

    // --- 1. DANH MỤC (CATEGORIES) ---
    const categoriesData = [
        { name: 'Trí tuệ nhân tạo (AI)', slug: 'ai' },
        { name: 'Giải Trí & Phim', slug: 'entertainment' },
        { name: 'Game Steam/Epic', slug: 'game' },
        { name: 'Phần mềm & Key Window', slug: 'software' },
        { name: 'Học tập & VPN', slug: 'education' }, // [cite: 10]
    ];

    const categories = {};
    for (const cat of categoriesData) { // [cite: 11]
        const newCat = await prisma.category.upsert({
            where: { slug: cat.slug },
            update: {},
            create: cat,
        });
        categories[cat.slug] = newCat; // Store the full object (including ID) [cite: 12]
        console.log(`📂 Category created: ${newCat.name}`); // [cite: 12]
    } // [cite: 13]
    // ----------------------------------------------------------------

    // --- 2. KEYWORDS ---
    const allKeywordNames = [
        "robot", "trí tuệ nhân tạo", "chatchit", "grok", "ai", "entertainment", "game",
        "chatgpt", "gpt-4o", "netflix", "4k", "spotify", "âm nhạc", "windows", "key",
        "elden-ring", "steam", "dlc", "midjourney", "tạo ảnh", "youtube", "premium",
        "wukong", "tayduky"
    ];

    const createdKeywords: any = {}; // Use an object for quick lookup [cite: 14]
    for (const name of allKeywordNames) {
        const keyword = await prisma.keywords.upsert({
            where: { name: name },
            update: {},
            create: { name: name },
        });
        createdKeywords[name] = keyword; // [cite: 15]
    }
    console.log('📝 Created essential Keywords.'); // [cite: 15]

    const getKeywordConnect = (names: string[]) => ({ // [cite: 16]
        connect: names
            .map(name => createdKeywords[name])
            .filter(k => k) // Filter out any names not found [cite: 16]
            .map(k => ({ id: k.id })) // [cite: 16]
    }); // [cite: 16]
    // ---------------------------------------------------------------- [cite: 17]

    // --- 3. DỮ LIỆU SẢN PHẨM HỢP NHẤT --- [cite: 17]
    const productsList = [
        // ... (product data remains the same) ... [cite: 17] through [cite: 43]
        {
            name: 'Tài khoản ChatGPT Plus',
            slug: 'chatgpt-plus',
            description: 'Truy cập GPT-4o, DALL-E 3, phân tích dữ liệu nâng cao. Tài khoản chính chủ, bảo hành trọn đời.', // [cite: 18]
            thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg',
            isHot: true,
            categorySlug: 'ai',
            avgRating: 4.9,
            keywordNames: ["chatgpt", "gpt-4o", "ai", "trí tuệ nhân tạo", "chatchit"],
            aiMetadata: { genre: ["Trí tuệ nhân tạo", "Chatbot"], platform: ["Web", "Mobile"], seoScore: 99 }, // [cite: 19]
            variants: [
                { name: 'Tài khoản riêng (1 Tháng)', price: 450000, orginalPrice: 550000 },
                { name: 'Tài khoản share (1 Tháng)', price: 150000, orginalPrice: 200000 },
            ]
        },
        {
            name: 'Netflix Premium 4K (Chính chủ)', // [cite: 20]
            slug: 'netflix-premium',
            description: 'Xem phim không giới hạn, chất lượng 4K UHD. Hỗ trợ Tivi, Điện thoại, Máy tính.', // [cite: 21]
            thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/7/75/Netflix_icon.svg',
            isHot: true,
            categorySlug: 'entertainment',
            avgRating: 4.8,
            keywordNames: ["netflix", "4k", "entertainment", "phim"],
            aiMetadata: { features: ["4K UHD", "Đa thiết bị"], suitable_for: ["Gia đình", "Cá nhân"], seoScore: 92 }, // [cite: 22]
            variants: [
                { name: '1 Tháng (Slot riêng)', price: 89000, orginalPrice: 260000 },
                { name: '1 Năm (Tiết kiệm)', price: 950000, orginalPrice: 3120000 },
            ]
        },
        {
            name: 'Black Myth: Wukong (Steam Key)', // [cite: 23]
            slug: 'black-myth-wukong-steam-key',
            description: 'Key bản quyền Steam cho game hành động nhập vai lấy cảm hứng từ Tây Du Ký.',
            thumbnail: 'https://tintuc-divineshop.cdn.vccloud.vn/wp-content/uploads/2024/08/blackmyth-1723969364570.jpg',
            isHot: true,
            categorySlug: 'game', // [cite: 24]
            avgRating: 4.9,
            keywordNames: ["game", "steam", "wukong", "tayduky"],
            aiMetadata: { genre: ["Action RPG", "Souls-like"], platform: ["Steam", "PC"], seoScore: 98 },
            variants: [
                { name: 'Bản Tiêu Chuẩn (Standard)', price: 1299999.00, orginalPrice: 1350000.00, },
                { name: 'Bản Digital Deluxe Edition', price: 1599999.00, orginalPrice: 1700000.00, }, // [cite: 25]
            ],
        },
        {
            name: 'Spotify Premium (Bản Quyền)',
            slug: 'spotify-premium-ban-quyen',
            description: 'Tài khoản nghe nhạc chất lượng cao, không quảng cáo trên mọi thiết bị.', // [cite: 26]
            thumbnail: 'https://m.media-amazon.com/images/I/31B2Nyzd8XL.png',
            isHot: true,
            categorySlug: 'entertainment',
            avgRating: 4.7,
            keywordNames: ["entertainment", "music", "spotify", "âm nhạc"],
            aiMetadata: { features: ["Nghe nhạc không quảng cáo", "Chất lượng cao"], suitable_for: ["Cá nhân", "Gia đình"], seoScore: 90 }, // [cite: 27]
            variants: [
                { name: 'Gói 1 Tháng', price: 69000.00, orginalPrice: 90000.00, },
                { name: 'Gói 3 Tháng', price: 69000.00 * 3 * 0.95, orginalPrice: 270000.00, },
                { name: 'Gói 6 Tháng (Tiết kiệm)', price: 69000.00 * 6 * 0.9, orginalPrice: 540000.00, }, // [cite: 28]
            ],
        },
        {
            name: 'Windows 11 Pro (Key Retail)',
            slug: 'windows-11-pro',
            description: 'Key kích hoạt bản quyền Windows 11 Pro vĩnh viễn. Update thoải mái.', // [cite: 29, 30]
            thumbnail: 'https://keyoff.net/wp-content/uploads/2021/10/Key-Windows-11-gia-re.jpg',
            isHot: true,
            categorySlug: 'software',
            avgRating: 5.0,
            keywordNames: ["windows", "key", "phần mềm", "office"],
            aiMetadata: { genre: ["Hệ điều hành", "Key bản quyền"], platform: ["PC"], seoScore: 95 },
            variants: [
                { name: 'Key Vĩnh Viễn', price: 150000, orginalPrice: 4500000 }, // [cite: 31]
            ]
        },
        {
            name: 'Elden Ring: Shadow of the Erdtree',
            slug: 'elden-ring-dlc', // [cite: 32]
            description: 'Siêu phẩm game hành động nhập vai. Bản quyền Steam Gift/Key global.', // [cite: 33]
            thumbnail: 'https://assets-prd.ignimgs.com/2021/06/12/elden-ring-button-03-1623460560664.jpg',
            isHot: true,
            categorySlug: 'game',
            avgRating: 4.9,
            keywordNames: ["elden-ring", "steam", "dlc", "game", "souls"],
            aiMetadata: { genre: ["Action RPG", "DLC"], platform: ["Steam"], seoScore: 97 },
            variants: [
                { name: 'Standard Edition', price: 890000, orginalPrice: 1200000 },
                { name: 'Deluxe Edition', price: 1150000, orginalPrice: 1500000 }, // [cite: 34]
            ]
        },
        {
            name: 'Midjourney Pro', // [cite: 35]
            slug: 'midjourney-pro',
            description: 'Công cụ tạo ảnh AI tốt nhất thế giới hiện nay. Gói Pro tạo ảnh không giới hạn.', // [cite: 36]
            thumbnail: 'https://brandlogos.net/wp-content/uploads/2024/04/midjourney-logo_brandlogos.net_nlkh1-768x641.png',
            isHot: false,
            categorySlug: 'ai',
            avgRating: 4.6,
            keywordNames: ["midjourney", "tạo ảnh", "ai", "trí tuệ nhân tạo"],
            aiMetadata: { genre: ["AI Art", "Generative AI"], platform: ["Discord"], seoScore: 85 }, // [cite: 37]
            variants: [
                { name: 'Gói Standard (1 Tháng)', price: 650000, orginalPrice: 800000 },
            ]
        },
        {
            name: 'YouTube Premium',
            slug: 'youtube-premium', // [cite: 38]
            description: 'Xem YouTube không quảng cáo, nghe nhạc nền, YouTube Music Premium.',
            thumbnail: 'https://file.hstatic.net/200000061442/article/youtube_15d1e937db924cecb271594febec2780_1024x1024.png',
            isHot: true,
            categorySlug: 'entertainment',
            avgRating: 4.9,
            keywordNames: ["youtube", "premium", "entertainment", "music"],
            aiMetadata: { features: ["Không quảng cáo", "Nghe nhạc nền"], suitable_for: ["Cá nhân"], seoScore: 94 }, // [cite: 39]
            variants: [
                { name: 'Nâng cấp chính chủ (6 Tháng)', price: 150000, orginalPrice: 350000 },
                { name: 'Nâng cấp chính chủ (1 Năm)', price: 280000, orginalPrice: 700000 }, // [cite: 40]
            ]
        },
        {
            name: 'Grok AI Bản Quyền',
            slug: 'grok-ai-ban-quyen',
            description: 'Sản phẩm AI tiên tiến từ X Corp, tích hợp với các nền tảng giải trí và game.',
            thumbnail: 'https://svgstack.com/media/img/grok-ai-app-logo-ohHJ386070.webp', // [cite: 41]
            isHot: true,
            categorySlug: 'ai',
            avgRating: 5.0,
            keywordNames: ["robot", "trí tuệ nhân tạo", "chatchit", "grok", "ai"],
            aiMetadata: { generatedBy: "X-Corp", seoScore: 95, targetCategories: ['entertainment', 'game'] },
            variants: [
                { name: 'Gói 1 Tháng', price: 100000.00, orginalPrice: 150000.00, }, // [cite: 42]
                { name: 'Gói 3 Tháng', price: 100000.00 * 3 * 0.9, orginalPrice: 400000.00, },
                { name: 'Gói 6 Tháng', price: 100000.00 * 6 * 0.85, orginalPrice: 750000.00, },
            ],
        },
    ]; // [cite: 43]
    // ----------------------------------------------------------------

    // --- 4. TẠO SẢN PHẨM, VARIANTS (UPSERT), VÀ STOCK (1 KEY) --- [cite: 43]
    for (const p of productsList) {
        // 1. Tạo hoặc Cập nhật sản phẩm (Product)
        const product = await prisma.product.upsert({
            where: { slug: p.slug },
            update: {
                // Chỉ cập nhật các trường không ảnh hưởng đến mối quan hệ [cite: 44]
                name: p.name,
                description: p.description,
                thumbnail: p.thumbnail,
                isHot: p.isHot,
                avgRating: p.avgRating,
                // FIX: categoryId is an Int [cite: 64]
                categoryId: categories[p.categorySlug].id, // [cite: 45]
            },
            create: {
                name: p.name,
                slug: p.slug,
                description: p.description,
                thumbnail: p.thumbnail, // [cite: 46]
                isHot: p.isHot,
                // FIX: categoryId is an Int [cite: 64]
                categoryId: categories[p.categorySlug].id,
                avgRating: p.avgRating,
                // Kết nối Keywords và Metadata khi tạo mới
                keyword: getKeywordConnect(p.keywordNames), // [cite: 47]
                aiMetadata: p.aiMetadata as Prisma.JsonObject, // [cite: 47]
            },
            include: { variants: true } // [cite: 47]
        });

        // 2. Cập nhật Keywords và Metadata (Nếu sản phẩm đã tồn tại) [cite: 48]
        if (product.createdAt.getTime() !== product.updatedAt.getTime()) { // [cite: 48]
            await prisma.product.update({
                where: { id: product.id }, // ID is Int [cite: 68]
                data: {
                    keyword: getKeywordConnect(p.keywordNames),
                    aiMetadata: p.aiMetadata as Prisma.JsonObject, // [cite: 49]
                }
            });
        } // [cite: 50]

        console.log(`📦 Product upserted: ${product.name}`); // [cite: 50]

        // 3. Tạo/Cập nhật Variants (Sử dụng hàm upsert thủ công) [cite: 51]
        for (const v of p.variants) {
            // FIX: product.id is an Int[cite: 68], so we pass number here
            const variant = await upsertProductVariant(product.id, v); // [cite: 51]

            // 4. NẠP STOCK (KEY) CHO TỪNG VARIANT (TẠO 1 KEY MỚI MỖI LẦN CHẠY) [cite: 52]
            // LƯU Ý: Đây là logic TẠO MỚI. [cite: 52]
            // Để đơn giản theo yêu cầu (tạo 1 key), ta thực hiện CREATE. [cite: 54]

            // Key giả: VTV-[ProductSlug]-[VariantName]-[Random] [cite: 55]
            const keyPrefix = `${p.slug.toUpperCase().slice(0, 5)}-${v.name.toUpperCase().slice(0, 5)}`.replace(/[^A-Z0-9-]/g, ''); // [cite: 55]
            const fakeKey = `VTV-${keyPrefix}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`; // [cite: 56]

            await prisma.stockItem.create({
                data: {
                    credential: fakeKey,
                    variantId: variant.id, // variant.id is Int [cite: 69]
                    status: StockStatus.AVAILABLE // Đảm bảo StockStatus đã được import [cite: 57]
                }
            });

            console.log(`   -> Upserted Variant: ${v.name} (+1 key: ${fakeKey})`); // [cite: 58]
        } // [cite: 59]
    }

    console.log('✅ Seeding finished successfully. Stock now adds 1 key per variant per run.'); // [cite: 60]
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });