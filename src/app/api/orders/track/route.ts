import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { trackOrderSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = trackOrderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { orderId, contact } = parsed.data;
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      OR: [{ guestEmail: contact }, { shippingPhone: contact }],
    },
    include: { tracking: true },
  });

  if (!order) {
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  }

  return NextResponse.json({
    status: order.status,
    tracking: order.tracking,
  });
}
