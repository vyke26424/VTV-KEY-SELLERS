import { PrismaClient, StockStatus, OrderStatus, InteractionType, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Hàm tạo thời gian ngẫu nhiên trong X ngày gần đây
function getRandomDateInPastDays(days: number): Date {
  const now = new Date();
  const pastDate = new Date();
  pastDate.setDate(now.getDate() - Math.floor(Math.random() * days));
  pastDate.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));
  return pastDate;
}

async function main() {
  console.log('⏳ Đang bắt đầu seed người dùng và đơn hàng với thời gian ngẫu nhiên...');

  const allVariants = await prisma.productVariant.findMany({
    include: { product: true }
  });

  if (allVariants.length === 0) {
    throw new Error("❌ Không tìm thấy ProductVariant nào. Vui lòng chạy file seed.ts trước!");
  }

  const passwordHash = await bcrypt.hash('password123', 10);
  const users: User[] = [];

  for (let i = 1; i <= 10; i++) {
    const user = await prisma.user.upsert({
      where: { email: `user${i}@example.com` },
      update: {},
      create: {
        email: `user${i}@example.com`,
        password: passwordHash,
        fullName: `Khách hàng mẫu ${i}`,
        balance: 1000000,
        role: 'USER',
      },
    });
    users.push(user);
    console.log(`👤 Đã tạo User: ${user.email}`);
  }

  for (const user of users) {
    const numOrders = Math.floor(Math.random() * 3) + 1;

    for (let j = 0; j < numOrders; j++) {
      const orderCode = `#ORD-SEED-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      const randomVariant = allVariants[Math.floor(Math.random() * allVariants.length)];
      const quantity = 1;
      const price = randomVariant.price;

      // Tạo thời gian ngẫu nhiên cho đơn hàng này
      const randomCreatedDate = getRandomDateInPastDays(7);

      const availableStock = await prisma.stockItem.findMany({
        where: {
          variantId: randomVariant.id,
          status: StockStatus.AVAILABLE,
        },
        take: quantity,
      });

      if (availableStock.length >= quantity) {
        await prisma.$transaction(async (tx) => {
          // 1. Tạo Order với createdAt ngẫu nhiên 
          const order = await tx.order.create({
            data: {
              code: orderCode,
              totalAmount: price.toNumber() * quantity,
              status: OrderStatus.COMPLETED,
              userId: user.id,
              createdAt: randomCreatedDate,
              updatedAt: randomCreatedDate,
              items: {
                create: {
                  variantId: randomVariant.id,
                  quantity: quantity,
                  price: price,
                  stockItems: {
                    connect: availableStock.map(s => ({ id: s.id }))
                  }
                }
              }
            }
          });

          // 2. Cập nhật trạng thái Stock kèm thời gian 
          await tx.stockItem.updateMany({
            where: { id: { in: availableStock.map(s => s.id) } },
            data: { 
              status: StockStatus.SOLD,
              updatedAt: randomCreatedDate 
            }
          });

          // 3. Tạo Interaction kèm thời gian để AI phân tích theo timeline 
          await tx.userInteraction.create({
            data: {
              userId: user.id,
              productId: randomVariant.productId,
              type: InteractionType.PURCHASE,
              score: 10,
              createdAt: randomCreatedDate
            }
          });

          console.log(`🛒 User ${user.email} đã đặt đơn ${order.code} lúc ${randomCreatedDate.toLocaleString()}`);
        });
      } else {
        console.log(`⚠️ Hết hàng cho sản phẩm: ${randomVariant.product.name}`);
      }
    }
  }

  console.log('✅ Quá trình seed đơn hàng hoàn tất!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });