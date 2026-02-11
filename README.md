# Pillaa - Shoes E-commerce (India)

Production-ready Next.js App Router build for Pillaa (pillaa.com).

## Tech Stack
- Next.js (App Router) + TypeScript
- Tailwind CSS + shadcn/ui (Radix primitives + Tailwind)
- Prisma + PostgreSQL
- NextAuth (Email/Password + optional Google)
- Razorpay payments (test/live)
- Cloudinary storage
- Resend/SMTP for emails

## Project Structure
```
prisma/
  schema.prisma
  seed.ts
public/
src/
  app/
    api/
    admin/
    account/
    blog/
    cart/
    checkout/
    contact/
    mens-formal-shoes/
    office-wear-shoes/
    order-success/
    privacy-policy/
    product/[slug]/
    return-refund/
    security-guard-shoes/
    shipping-policy/
    shop/
    size-guide/
    terms/
    track-order/
  components/
  lib/
  styles/
```

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create `.env` from `.env.example` and fill values.
3. Run migrations:
   ```bash
   npm run prisma:migrate
   ```
4. Seed data:
   ```bash
   npm run db:seed
   ```
5. Run dev server:
   ```bash
   npm run dev
   ```

## Build
```bash
npm run build
```

## Deployment
- Frontend: Vercel
- Database: Neon (recommended for Postgres)

### Vercel Steps
1. Connect repo to Vercel.
2. Add environment variables from `.env.example`.
3. Build command: `npm run build`
4. Output: `.next`

### Database
- Use Neon/Supabase/Railway for PostgreSQL.
- Update `DATABASE_URL` in Vercel dashboard.

## Payment Flow
- Create DB order -> create Razorpay order -> payment -> verify signature -> mark paid.
- COD flow marks order as `COD_PENDING`.
- Webhooks handle payment updates.

## Testing Checklist
- Checkout with Razorpay test key
- COD flow
- Order tracking
- Coupon validation
- Admin access (role-based)
- Stock checks + out-of-stock handling

## Common Issues
- **CORS/Signature errors**: ensure Razorpay webhook secret matches env.
- **Invalid env**: restart Next.js after env changes.
- **Missing images**: confirm Cloudinary URL whitelisting in `next.config.mjs`.
