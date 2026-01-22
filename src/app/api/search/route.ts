import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");
  if (!query) {
    return NextResponse.json([]);
  }

  const products = await prisma.product.findMany({
    where: {
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { tags: { has: query.toLowerCase() } },
        { category: { name: { contains: query, mode: "insensitive" } } },
      ],
    },
    include: { images: true },
    take: 10,
  });

  return NextResponse.json(products);
}
