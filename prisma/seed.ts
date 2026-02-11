import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.variant.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.pincodeServiceability.deleteMany();
  await prisma.user.deleteMany();

  const categories = await prisma.category.createMany({
    data: [
      { name: "Men's Formal Shoes", slug: "mens-formal" },
      { name: "Security Guard Shoes", slug: "security-guard" },
      { name: "Office Wear Shoes", slug: "office-wear" },
      { name: "Loafers", slug: "loafers" },
    ],
  });

  const categoryList = await prisma.category.findMany();
  const categoryMap = new Map(categoryList.map((cat) => [cat.slug, cat.id]));

  const productsData = [
    {
      title: "Pillaa Elite Black Leather",
      slug: "pillar-elite-black",
      description: "Premium black leather formal shoes with cushioned sole and anti-slip grip.",
      price: 2799,
      compareAtPrice: 3499,
      category: "mens-formal",
      material: "Genuine leather",
      soleType: "Anti-slip rubber",
      useCase: "Office",
      tags: ["formal", "leather", "cushioned"],
      highlights: ["Cushioned sole", "Anti-slip", "Genuine leather"],
    },
    {
      title: "Pillaa Guard Pro",
      slug: "pillar-guard-pro",
      description: "Durable black leather shoes made for security guards and long patrols.",
      price: 2599,
      compareAtPrice: 3199,
      category: "security-guard",
      material: "Genuine leather",
      soleType: "High-grip rubber",
      useCase: "Security",
      tags: ["security", "anti-slip", "durable"],
      highlights: ["Shock absorbing", "High grip", "Long shift ready"],
    },
    {
      title: "Pillaa Office Slim",
      slug: "pillar-office-slim",
      description: "Slim profile formal shoes for office professionals and hospitality teams.",
      price: 2399,
      compareAtPrice: 2999,
      category: "office-wear",
      material: "Genuine leather",
      soleType: "Anti-slip rubber",
      useCase: "Office",
      tags: ["office", "formal", "sleek"],
      highlights: ["Polished finish", "Soft insole", "Breathable"],
    },
    {
      title: "Pillaa Travel Loafer",
      slug: "pillar-travel-loafer",
      description: "Slip-on loafer with comfort cushioning and anti-slip outsole.",
      price: 2199,
      compareAtPrice: 2799,
      category: "loafers",
      material: "Genuine leather",
      soleType: "Flexible rubber",
      useCase: "Travel",
      tags: ["loafer", "travel", "slip-on"],
      highlights: ["Slip-on", "Flexible sole", "Lightweight"],
    },
  ];

  const sizes = ["6", "7", "8", "9", "10", "11", "12"];

  for (const product of productsData) {
    const created = await prisma.product.create({
      data: {
        title: product.title,
        slug: product.slug,
        description: product.description,
        price: product.price,
        compareAtPrice: product.compareAtPrice,
        categoryId: categoryMap.get(product.category) || categoryList[0].id,
        material: product.material,
        soleType: product.soleType,
        useCase: product.useCase,
        tags: product.tags,
        highlights: product.highlights,
        images: {
          create: [
            {
              url: "https://res.cloudinary.com/demo/image/upload/v1699999999/pillaa/elite-black.jpg",
              altText: product.title,
            },
          ],
        },
        variants: {
          create: sizes.map((size) => ({
            size,
            stock: 20,
            sku: `${product.slug}-${size}`,
          })),
        },
      },
    });

    await prisma.review.create({
      data: {
        productId: created.id,
        rating: 5,
        title: "Comfortable and premium",
        content: "Great comfort for long shifts and looks very premium.",
        isVisible: true,
      },
    });
  }

  await prisma.product.createMany({
    data: Array.from({ length: 8 }).map((_, index) => ({
      title: `Pillaa Comfort ${index + 1}`,
      slug: `pillaa-comfort-${index + 1}`,
      description: "Cushioned black leather shoes for long working hours.",
      price: 1999 + index * 100,
      compareAtPrice: 2599 + index * 100,
      categoryId: categoryList[index % categoryList.length].id,
      material: "Genuine leather",
      soleType: "Anti-slip rubber",
      useCase: "Office",
      tags: ["comfort", "black", "work"],
      highlights: ["Cushioned sole", "Anti-slip", "Durable build"],
    })),
  });

  const allProducts = await prisma.product.findMany();
  for (const product of allProducts) {
    const existing = await prisma.variant.findFirst({ where: { productId: product.id } });
    if (!existing) {
      await prisma.variant.createMany({
        data: sizes.map((size) => ({
          size,
          stock: 15,
          sku: `${product.slug}-${size}`,
          productId: product.id,
        })),
      });
      await prisma.productImage.create({
        data: {
          url: "https://res.cloudinary.com/demo/image/upload/v1699999999/pillaa/elite-black.jpg",
          altText: product.title,
          productId: product.id,
        },
      });
    }
  }

  const reviewTargets = allProducts.slice(0, 5);
  for (const product of reviewTargets) {
    await prisma.review.create({
      data: {
        productId: product.id,
        rating: 4,
        title: "Solid daily wear",
        content: "Good cushioning and formal finish for daily use.",
        isVisible: true,
      },
    });
  }

  const adminPassword = await bcrypt.hash("Pillaa@123", 10);
  await prisma.user.create({
    data: {
      email: "admin@pillaa.com",
      name: "Pillaa Admin",
      passwordHash: adminPassword,
      role: "ADMIN",
    },
  });

  await prisma.coupon.createMany({
    data: [
      {
        code: "PILLAA200",
        type: "FIXED",
        value: 200,
        minCart: 1999,
        expiryDate: new Date(new Date().setMonth(new Date().getMonth() + 3)),
      },
      {
        code: "WORK10",
        type: "PERCENT",
        value: 10,
        minCart: 2999,
        expiryDate: new Date(new Date().setMonth(new Date().getMonth() + 2)),
      },
      {
        code: "GUARD15",
        type: "PERCENT",
        value: 15,
        minCart: 3999,
        expiryDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      },
    ],
  });

  const pincodes = Array.from({ length: 50 }).map((_, index) => {
    const base = 560001 + index;
    return {
      pincode: base.toString(),
      city: "Bengaluru",
      state: "Karnataka",
      zone: "South",
      etaDays: 3 + (index % 4),
      isCod: index % 3 !== 0,
    };
  });

  await prisma.pincodeServiceability.createMany({ data: pincodes });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
