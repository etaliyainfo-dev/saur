import Link from "next/link";

export default function OfficeWearShoesPage() {
  return (
    <div className="section">
      <div className="container space-y-10">
        <div>
          <h1 className="text-3xl font-semibold text-brand-900">Office Wear Shoes</h1>
          <p className="mt-2 text-sm text-brand-600">
            Formal black leather shoes designed for corporate and hospitality professionals.
          </p>
          <Link href="/shop" className="mt-4 inline-flex rounded-full bg-brand-900 px-5 py-2 text-sm text-white">
            Explore office essentials
          </Link>
        </div>

        <article className="space-y-4 text-sm text-brand-700">
          <p>
            Pillaa office wear shoes deliver a refined, minimal silhouette that aligns with Indian corporate
            dress codes. From front-desk teams to executive meetings, the sleek black leather finish ensures you
            look polished while feeling comfortable. We combine premium leather with a cushioned insole to reduce
            fatigue, so your focus stays on your work, not on sore feet.
          </p>
          <p>
            The midsole uses layered cushioning that absorbs shock during long commutes, elevator trips, and
            extended standing in presentations or service areas. A structured heel cup keeps your posture steady,
            while the breathable lining helps manage heat in Indian summers. Each shoe is balanced for stability,
            making it dependable for both indoor and light outdoor use.
          </p>
          <p>
            Our office wear collection prioritizes durability. The outsole pattern is engineered to grip polished
            tiles without slipping, and the leather upper resists daily scuffs. These details make Pillaa a smart
            investment for professionals who wear the same pair five to six days a week.
          </p>
          <p>
            Shopping with Pillaa includes quick delivery in India, 30-day returns, and size exchanges. We also
            offer support for corporate orders and team uniforms. Choose Pillaa for office shoes that blend formal
            style with long-lasting comfort.
          </p>
        </article>

        <section className="rounded-2xl border border-brand-100 bg-brand-50 p-6">
          <h2 className="text-lg font-semibold text-brand-900">FAQs</h2>
          <div className="mt-4 space-y-4 text-sm text-brand-700">
            <div>
              <h3 className="font-semibold text-brand-900">Are these shoes suitable for hospitality staff?</h3>
              <p className="mt-1">Yes, they are designed for long standing hours and polished indoor floors.</p>
            </div>
            <div>
              <h3 className="font-semibold text-brand-900">How do I pick the right size?</h3>
              <p className="mt-1">Use our size guide or reach out to support for personalized assistance.</p>
            </div>
            <div>
              <h3 className="font-semibold text-brand-900">Do you provide easy exchanges?</h3>
              <p className="mt-1">Yes, exchanges are available within 30 days of delivery.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
