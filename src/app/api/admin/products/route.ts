import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { productSchema } from "@/lib/validators";
import { requireAdmin } from "@/lib/admin";

export async function GET() {
  await requireAdmin();
  const products = await prisma.product.findMany({
    include: { images: true, variants: true, category: true },
  });
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  await requireAdmin();
  const body = await request.json();
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const product = await prisma.product.create({
    data: {
      title: parsed.data.title,
      slug: parsed.data.slug,
      description: parsed.data.description,
      price: parsed.data.price,
      compareAtPrice: parsed.data.compareAtPrice,
      categoryId: parsed.data.categoryId,
      material: parsed.data.material,
      soleType: parsed.data.soleType,
      useCase: parsed.data.useCase,
      tags: parsed.data.tags,
      highlights: parsed.data.highlights,
      images: { create: parsed.data.images.map((url) => ({ url })) },
      variants: { create: parsed.data.variants },
    },
  });

  return NextResponse.json(product, { status: 201 });
}

export async function PATCH(request: Request) {
  await requireAdmin();
  const body = await request.json();
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const product = await prisma.product.update({
    where: { slug: parsed.data.slug },
    data: {
      title: parsed.data.title,
      description: parsed.data.description,
      price: parsed.data.price,
      compareAtPrice: parsed.data.compareAtPrice,
      categoryId: parsed.data.categoryId,
      material: parsed.data.material,
      soleType: parsed.data.soleType,
      useCase: parsed.data.useCase,
      tags: parsed.data.tags,
      highlights: parsed.data.highlights,
      images: {
        deleteMany: {},
        create: parsed.data.images.map((url) => ({ url })),
      },
      variants: {
        deleteMany: {},
        create: parsed.data.variants,
      },
    },
  });

  return NextResponse.json(product);
}

export async function DELETE(request: Request) {
  await requireAdmin();
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get(\"slug\");
  if (!slug) {
    return NextResponse.json({ error: \"SLUG_REQUIRED\" }, { status: 400 });
  }

  await prisma.product.delete({ where: { slug } });
  return NextResponse.json({ success: true });
}
