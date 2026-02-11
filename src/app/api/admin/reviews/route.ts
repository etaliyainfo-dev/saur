import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { reviewSchema } from "@/lib/validators";
import { requireAdmin } from "@/lib/admin";

export async function GET() {
  await requireAdmin();
  const reviews = await prisma.review.findMany({ include: { product: true, user: true } });
  return NextResponse.json(reviews);
}

export async function PATCH(request: Request) {
  await requireAdmin();
  const body = await request.json();
  const parsed = reviewSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const review = await prisma.review.update({
    where: { id: parsed.data.reviewId },
    data: { isVisible: parsed.data.isVisible },
  });

  return NextResponse.json(review);
}
