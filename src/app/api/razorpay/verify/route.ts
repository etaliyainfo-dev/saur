import crypto from "crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const body = await request.json();
  const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = body;

  const secret = process.env.RAZORPAY_KEY_SECRET || "";
  const payload = `${razorpayOrderId}|${razorpayPaymentId}`;
  const expected = crypto.createHmac("sha256", secret).update(payload).digest("hex");

  if (expected !== razorpaySignature) {
    return NextResponse.json({ error: "INVALID_SIGNATURE" }, { status: 400 });
  }

  const order = await prisma.order.update({
    where: { id: orderId },
    data: {
      status: "PAID",
      payment: {
        update: {
          status: "PAID",
          providerRef: razorpayPaymentId,
        },
      },
    },
  });

  return NextResponse.json({ success: true, orderId: order.id });
}
