import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { bestSellers } from "@/lib/mock-data";

export default function HomePage() {
  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Pillaa",
            url: "https://pillaa.com",
            logo: "https://pillaa.com/logo.png",
            sameAs: ["https://www.facebook.com/pillaa", "https://www.instagram.com/pillaa"],
            contactPoint: {
              "@type": "ContactPoint",
              telephone: "+91-90000-12345",
              contactType: "customer service",
              areaServed: "IN",
            },
          }),
        }}
      />
      <section className="section">
        <div className="container grid gap-10 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-sm font-semibold uppercase text-brand-500">Pillaa | Built for long shifts</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-brand-900 md:text-5xl">
              Premium black leather work shoes that keep you comfortable for 12-hour days.
            </h1>
            <p className="mt-4 text-base text-brand-600">
              Cushioning that lasts, genuine leather finish, anti-slip outsole, and breathable lining—crafted for
              office professionals, guards, and hospitality teams.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/shop"
                className="rounded-full bg-brand-900 px-6 py-3 text-sm font-semibold text-white"
              >
                Shop Now
              </Link>
              <Link
                href="/shop?sort=best-selling"
                className="rounded-full border border-brand-200 px-6 py-3 text-sm font-semibold text-brand-700"
              >
                Best Sellers
              </Link>
            </div>
            <div className="mt-8 flex items-center gap-6 text-xs text-brand-500">
              <div>✅ 30-day returns</div>
              <div>✅ Free shipping over ₹2499</div>
              <div>✅ COD available</div>
            </div>
          </div>
          <div className="rounded-3xl bg-brand-50 p-8 shadow-soft">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://res.cloudinary.com/demo/image/upload/v1699999999/pillaa/hero.jpg"
              alt="Pillaa black leather work shoes"
              className="w-full rounded-2xl object-cover"
            />
          </div>
        </div>
      </section>

      <section className="section bg-brand-50">
        <div className="container">
          <h2 className="text-2xl font-semibold text-brand-900">Shop by category</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-4">
            {[
              { title: "Men's Formal", href: "/mens-formal-shoes" },
              { title: "Security Guard", href: "/security-guard-shoes" },
              { title: "Office Wear", href: "/office-wear-shoes" },
              { title: "Loafers", href: "/loafers" },
            ].map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                className="rounded-2xl border border-brand-100 bg-white p-6 text-sm font-semibold text-brand-800 shadow-soft"
              >
                {cat.title}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-brand-900">Best sellers</h2>
            <Link href="/shop" className="text-sm font-semibold text-brand-700">
              View all
            </Link>
          </div>
          <div className="mt-6 grid gap-6 md:grid-cols-4">
            {bestSellers.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-brand-900 text-white">
        <div className="container grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Genuine leather",
              text: "Premium leather uppers with a formal finish that stays polished all day.",
            },
            {
              title: "Cushioned comfort",
              text: "High-rebound insole and arch support designed for 8-12 hour shifts.",
            },
            {
              title: "Anti-slip outsole",
              text: "Grip-first outsole for safety on polished floors, hotel lobbies, and outdoor duty.",
            },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-brand-700 bg-brand-800 p-6">
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-brand-100">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="container grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-semibold text-brand-900">Trusted by professionals</h2>
            <p className="mt-3 text-sm text-brand-600">
              Pillaa shoes are trusted by office teams, security personnel, and hospitality staff across India.
            </p>
            <div className="mt-6 space-y-4">
              {[
                {
                  name: "Ankit R.",
                  role: "Security Supervisor, Delhi",
                  quote: "Anti-slip grip is amazing. My team feels safer and more comfortable.",
                },
                {
                  name: "Kiran P.",
                  role: "Hotel Manager, Mumbai",
                  quote: "Formal look with real comfort. We stocked them for our entire team.",
                },
              ].map((testimonial) => (
                <div key={testimonial.name} className="rounded-2xl border border-brand-100 p-5">
                  <p className="text-sm text-brand-700">“{testimonial.quote}”</p>
                  <div className="mt-2 text-xs font-semibold text-brand-900">
                    {testimonial.name} · {testimonial.role}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-brand-100 bg-brand-50 p-8">
            <h3 className="text-xl font-semibold text-brand-900">Why Pillaa</h3>
            <ul className="mt-4 space-y-3 text-sm text-brand-600">
              <li>✔ Extra cushioning for long duty hours</li>
              <li>✔ Durable anti-slip outsole for safety</li>
              <li>✔ Genuine leather with premium shine</li>
              <li>✔ Easy exchange & COD available</li>
            </ul>
            <Link
              href="/shop"
              className="mt-6 inline-flex rounded-full bg-brand-900 px-5 py-3 text-sm font-semibold text-white"
            >
              Explore collection
            </Link>
          </div>
        </div>
      </section>

      <section className="section bg-brand-50">
        <div className="container">
          <h2 className="text-2xl font-semibold text-brand-900">FAQ</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {[
              {
                q: "Is COD available across India?",
                a: "Yes, COD is available for serviceable pincodes with delivery within 3-7 days.",
              },
              {
                q: "Do these shoes work for 10+ hour shifts?",
                a: "Yes. The insole is designed for long standing and walking hours.",
              },
              {
                q: "What is the return policy?",
                a: "30-day return and exchange on unused products with tags intact.",
              },
              {
                q: "Do you offer bulk orders?",
                a: "Yes, contact sales@pillaa.com for corporate pricing.",
              },
            ].map((faq) => (
              <div key={faq.q} className="rounded-2xl border border-brand-100 bg-white p-5">
                <h3 className="text-sm font-semibold text-brand-900">{faq.q}</h3>
                <p className="mt-2 text-sm text-brand-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
