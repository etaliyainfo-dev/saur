import { z } from "zod";

export const checkoutSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string(),
      variantId: z.string(),
      quantity: z.number().min(1),
    })
  ),
  address: z.object({
    name: z.string().min(2),
    phone: z.string().min(10),
    line1: z.string().min(5),
    line2: z.string().optional(),
    city: z.string().min(2),
    state: z.string().min(2),
    pincode: z.string().min(6),
  }),
  email: z.string().email().optional(),
  coupon: z.string().optional(),
  paymentMethod: z.enum(["RAZORPAY", "COD"]),
});

export const trackOrderSchema = z.object({
  orderId: z.string(),
  contact: z.string(),
});

export const productSchema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3),
  description: z.string().min(10),
  price: z.number().min(1),
  compareAtPrice: z.number().optional().nullable(),
  categoryId: z.string(),
  material: z.string(),
  soleType: z.string(),
  useCase: z.string(),
  tags: z.array(z.string()),
  highlights: z.array(z.string()),
  images: z.array(z.string()),
  variants: z.array(z.object({ size: z.string(), stock: z.number(), sku: z.string() })),
});

export const couponSchema = z.object({
  code: z.string().min(3),
  type: z.enum(["FIXED", "PERCENT"]),
  value: z.number().min(1),
  minCart: z.number().optional(),
  expiryDate: z.string(),
});

export const reviewSchema = z.object({
  reviewId: z.string(),
  isVisible: z.boolean(),
});
