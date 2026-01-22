import Link from "next/link";

export default function LoafersPage() {
  return (
    <div className="section">
      <div className="container space-y-10">
        <div>
          <h1 className="text-3xl font-semibold text-brand-900">Loafers</h1>
          <p className="mt-2 text-sm text-brand-600">
            Easy slip-on black leather loafers for travel, office, and daily professional wear.
          </p>
          <Link href="/shop" className="mt-4 inline-flex rounded-full bg-brand-900 px-5 py-2 text-sm text-white">
            Shop loafers
          </Link>
        </div>

        <article className="space-y-4 text-sm text-brand-700">
          <p>
            Pillaa loafers are designed for professionals who want a smart look with the convenience of slip-on
            comfort. The clean black leather upper matches office and uniform requirements while providing a
            lightweight feel for daily commutes. These loafers are especially popular with retail teams, travel
            professionals, and shift workers who want to move quickly without compromising on style.
          </p>
          <p>
            Inside, our cushioned insole supports the arch and heel, reducing fatigue during long standing hours.
            The outsole uses a flexible, anti-slip pattern for traction on smooth floors, staircases, and outdoor
            walkways. This makes the loafer an ideal option for people who shift between indoor and outdoor
            environments throughout the day.
          </p>
          <p>
            Each pair is crafted with durable stitching and easy-to-clean leather that keeps its shine for longer.
            Our loafers are also built on Indian sizing with a comfortable toe box so you can wear them for 10+
            hours without pressure. Pair them with formal trousers or smart-casual wear for a versatile look.
          </p>
          <p>
            Pillaa offers fast delivery across India, easy exchanges, and responsive customer support. For team
            or bulk orders, reach out to our sales team for customized pricing. These loafers deliver the comfort
            and convenience that busy professionals expect.
          </p>
        </article>

        <section className="rounded-2xl border border-brand-100 bg-brand-50 p-6">
          <h2 className="text-lg font-semibold text-brand-900">FAQs</h2>
          <div className="mt-4 space-y-4 text-sm text-brand-700">
            <div>
              <h3 className="font-semibold text-brand-900">Are loafers suitable for long shifts?</h3>
              <p className="mt-1">Yes, the cushioned insole is made for 8-10 hour comfort.</p>
            </div>
            <div>
              <h3 className="font-semibold text-brand-900">Do loafers have anti-slip soles?</h3>
              <p className="mt-1">Yes, the outsole is designed for grip on polished floors.</p>
            </div>
            <div>
              <h3 className="font-semibold text-brand-900">Is return available?</h3>
              <p className="mt-1">Returns and exchanges are available within 30 days.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
