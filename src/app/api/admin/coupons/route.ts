import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { couponSchema } from "@/lib/validators";
import { requireAdmin } from "@/lib/admin";

export async function GET() {
  await requireAdmin();
  const coupons = await prisma.coupon.findMany();
  return NextResponse.json(coupons);
}

export async function POST(request: Request) {
  await requireAdmin();
  const body = await request.json();
  const parsed = couponSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const coupon = await prisma.coupon.create({
    data: {
      code: parsed.data.code.toUpperCase(),
      type: parsed.data.type,
      value: parsed.data.value,
      minCart: parsed.data.minCart ?? 0,
      expiryDate: new Date(parsed.data.expiryDate),
    },
  });

  return NextResponse.json(coupon, { status: 201 });
}
