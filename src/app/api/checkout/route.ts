import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { prisma } from "@/lib/prisma";
import { checkoutSchema } from "@/lib/validators";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "",
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = checkoutSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { items, address, email, coupon, paymentMethod } = parsed.data;

  const orderResult = await prisma.$transaction(async (tx) => {
    const productIds = items.map((item) => item.productId);
    const products = await tx.product.findMany({
      where: { id: { in: productIds } },
      include: { variants: true },
    });

    const variantMap = new Map(products.flatMap((product) => product.variants.map((variant) => [variant.id, variant])));

    let subtotal = 0;
    for (const item of items) {
      const variant = variantMap.get(item.variantId);
      if (!variant || variant.stock < item.quantity) {
        throw new Error("OUT_OF_STOCK");
      }
      const product = products.find((p) => p.id === item.productId);
      if (!product) {
        throw new Error("INVALID_PRODUCT");
      }
      subtotal += product.price * item.quantity;
    }

    let discount = 0;
    let couponId: string | undefined;

    if (coupon) {
      const couponRecord = await tx.coupon.findFirst({
        where: { code: coupon.toUpperCase(), isActive: true, expiryDate: { gte: new Date() } },
      });
      if (couponRecord && subtotal >= couponRecord.minCart) {
        discount = couponRecord.type === "FIXED" ? couponRecord.value : Math.floor((subtotal * couponRecord.value) / 100);
        couponId = couponRecord.id;
      }
    }

    const shippingFee = subtotal - discount >= 2499 ? 0 : 99;
    const total = subtotal - discount + shippingFee;

    const order = await tx.order.create({
      data: {
        userId: null,
        guestEmail: email,
        status: paymentMethod === "COD" ? "COD_PENDING" : "PENDING",
        totalAmount: total,
        couponId,
        discount,
        shippingFee,
        shippingName: address.name,
        shippingPhone: address.phone,
        shippingLine1: address.line1,
        shippingLine2: address.line2,
        shippingCity: address.city,
        shippingState: address.state,
        shippingPin: address.pincode,
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            quantity: item.quantity,
            price: products.find((p) => p.id === item.productId)?.price || 0,
          })),
        },
        payment: {
          create: {
            provider: paymentMethod === "COD" ? "COD" : "RAZORPAY",
            amount: total,
            status: paymentMethod === "COD" ? "PENDING" : "PENDING",
          },
        },
      },
      include: { payment: true },
    });

    for (const item of items) {
      await tx.variant.update({
        where: { id: item.variantId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    return { order, total };
  });

  if (paymentMethod === "COD") {
    return NextResponse.json({ orderId: orderResult.order.id, status: "COD_PENDING" });
  }

  const razorpayOrder = await razorpay.orders.create({
    amount: orderResult.total * 100,
    currency: "INR",
    receipt: orderResult.order.id,
  });

  await prisma.order.update({
    where: { id: orderResult.order.id },
    data: { razorpayOrder: razorpayOrder.id },
  });

  return NextResponse.json({ orderId: orderResult.order.id, razorpayOrder });
}
