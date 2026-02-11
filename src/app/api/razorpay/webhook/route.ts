import crypto from "crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("x-razorpay-signature") || "";
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET || "";

  const expected = crypto.createHmac("sha256", secret).update(body).digest("hex");
  if (signature !== expected) {
    return NextResponse.json({ error: "INVALID_SIGNATURE" }, { status: 400 });
  }

  const event = JSON.parse(body);
  if (event.event === "payment.captured") {
    const orderId = event.payload.payment.entity.notes?.receipt;
    if (orderId) {
      await prisma.order.update({
        where: { id: orderId },
        data: {
          status: "PAID",
          payment: {
            update: {
              status: "PAID",
              providerRef: event.payload.payment.entity.id,
            },
          },
        },
      });
    }
  }

  return NextResponse.json({ received: true });
}
