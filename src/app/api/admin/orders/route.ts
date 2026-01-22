import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

export async function GET() {
  await requireAdmin();
  const orders = await prisma.order.findMany({
    include: { items: true, payment: true, tracking: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(orders);
}

export async function PATCH(request: Request) {
  await requireAdmin();
  const body = await request.json();
  const { orderId, status, trackingNo, courier, trackingUrl } = body;

  const order = await prisma.order.update({
    where: { id: orderId },
    data: {
      status,
      tracking: {
        upsert: {
          create: { courier, trackingNo, trackingUrl },
          update: { courier, trackingNo, trackingUrl },
        },
      },
    },
  });

  return NextResponse.json(order);
}
