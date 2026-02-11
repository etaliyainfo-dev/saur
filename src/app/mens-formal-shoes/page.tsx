import Link from "next/link";

export default function MensFormalShoesPage() {
  return (
    <div className="section">
      <div className="container space-y-10">
        <div>
          <h1 className="text-3xl font-semibold text-brand-900">Men's Formal Shoes</h1>
          <p className="mt-2 text-sm text-brand-600">
            Explore Pillaa's collection of premium black leather formal shoes designed for Indian professionals.
          </p>
          <Link href="/shop" className="mt-4 inline-flex rounded-full bg-brand-900 px-5 py-2 text-sm text-white">
            Shop the collection
          </Link>
        </div>

        <article className="space-y-4 text-sm text-brand-700">
          <p>
            Pillaa men's formal shoes are crafted for the realities of Indian workdays—long hours, hot climates,
            and polished interiors where traction matters. Each pair combines a genuine leather upper with a
            premium shine that looks boardroom-ready while maintaining breathability for all-day wear. The
            silhouette is sleek and understated, so it pairs with formal trousers, suits, and security uniforms
            without standing out in the wrong way.
          </p>
          <p>
            Comfort begins at the base. Our cushioned insole uses multi-density foam that supports the arch and
            reduces fatigue during 8- to 12-hour shifts. The lining is moisture-wicking, which keeps feet fresh
            during humid commutes or long standing hours. Anti-slip outsole patterns are tested for slick floors
            commonly found in offices, hotels, malls, and retail spaces. The result is a steady, confident step
            and fewer aches after a full day on duty.
          </p>
          <p>
            Every Pillaa formal shoe is engineered with everyday Indian needs in mind: easy to clean, scuff
            resistant, and built to hold its shape. We keep the color story focused on black leather because it
            matches most uniforms and dress codes in India. You'll also find size options tailored for Indian
            sizing, along with reliable stock updates and fast dispatch.
          </p>
          <p>
            For bulk purchases, Pillaa offers corporate pricing and faster replacements for teams. Our after-sales
            support includes 30-day returns, size exchanges, and dedicated assistance for delivery tracking. Shop
            with confidence knowing each pair is backed by our comfort guarantee and quality checks.
          </p>
        </article>

        <section className="rounded-2xl border border-brand-100 bg-brand-50 p-6">
          <h2 className="text-lg font-semibold text-brand-900">FAQs</h2>
          <div className="mt-4 space-y-4 text-sm text-brand-700">
            <div>
              <h3 className="font-semibold text-brand-900">Are Pillaa formal shoes suitable for daily office use?</h3>
              <p className="mt-1">
                Yes. They are built for daily wear with cushioned insoles, anti-slip soles, and a durable leather
                upper.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-brand-900">Do you offer COD for formal shoe orders?</h3>
              <p className="mt-1">COD is available for most serviceable pincodes across India.</p>
            </div>
            <div>
              <h3 className="font-semibold text-brand-900">What is the return window?</h3>
              <p className="mt-1">Returns and exchanges are accepted within 30 days of delivery.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
