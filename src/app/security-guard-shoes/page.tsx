import Link from "next/link";

export default function SecurityGuardShoesPage() {
  return (
    <div className="section">
      <div className="container space-y-10">
        <div>
          <h1 className="text-3xl font-semibold text-brand-900">Security Guard Shoes</h1>
          <p className="mt-2 text-sm text-brand-600">
            Built for long standing hours, patrolling shifts, and reliable traction.
          </p>
          <Link href="/shop" className="mt-4 inline-flex rounded-full bg-brand-900 px-5 py-2 text-sm text-white">
            Shop security-ready shoes
          </Link>
        </div>

        <article className="space-y-4 text-sm text-brand-700">
          <p>
            Security professionals across India need shoes that can handle 8-12 hour shifts with minimal fatigue.
            Pillaa security guard shoes focus on cushioning and stability without compromising a formal, uniform-
            friendly look. The polished black leather upper maintains a smart appearance while resisting scuffs
            from daily patrols or crowd control duties.
          </p>
          <p>
            The outsole is engineered with deep traction grooves for anti-slip performance on tiles, concrete,
            and outdoor pavements. This provides confident movement when guarding high-traffic venues such as
            malls, offices, hotels, and residential complexes. The midsole uses shock-absorbing foam that keeps
            knees and heels supported during long standing sessions or repeated walking rounds.
          </p>
          <p>
            Ventilation is also prioritized. The breathable lining reduces heat build-up, which is essential for
            warm climates and night shifts. Our size range is designed around Indian sizing, and the toe box offers
            ample room so you can stay comfortable even with thick socks. Each pair is quality-checked for
            durability and consistent grip.
          </p>
          <p>
            Pillaa supports bulk uniform orders with faster dispatch options. We also provide a no-hassle 30-day
            return policy, quick size exchanges, and responsive customer support. If you're equipping a full team,
            our corporate pricing and warranty support ensure a dependable experience.
          </p>
        </article>

        <section className="rounded-2xl border border-brand-100 bg-brand-50 p-6">
          <h2 className="text-lg font-semibold text-brand-900">FAQs</h2>
          <div className="mt-4 space-y-4 text-sm text-brand-700">
            <div>
              <h3 className="font-semibold text-brand-900">Are these shoes anti-slip for outdoor duty?</h3>
              <p className="mt-1">
                Yes. The outsole is designed for grip on polished floors and outdoor pavements.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-brand-900">Do you have bulk purchase options?</h3>
              <p className="mt-1">Yes, contact sales@pillaa.com for corporate pricing and bulk delivery.</p>
            </div>
            <div>
              <h3 className="font-semibold text-brand-900">Is COD available?</h3>
              <p className="mt-1">COD is available for serviceable pincodes.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
