import Link from "next/link";

export default function CartPage() {
  return (
    <div className="section">
      <div className="container grid gap-10 lg:grid-cols-[1.5fr_1fr]">
        <div>
          <h1 className="text-3xl font-semibold text-brand-900">Your cart</h1>
          <div className="mt-6 space-y-4">
            {[1, 2].map((item) => (
              <div key={item} className="flex items-start gap-4 rounded-2xl border border-brand-100 p-4">
                <div className="h-24 w-24 rounded-xl bg-brand-50"></div>
                <div className="flex-1">
                  <h2 className="text-base font-semibold text-brand-900">Pillaa Elite Black Leather</h2>
                  <p className="text-sm text-brand-600">Size 9 · SKU PILLAA-EL-{item}</p>
                  <div className="mt-3 flex items-center gap-3">
                    <input
                      type="number"
                      min={1}
                      defaultValue={1}
                      className="w-20 rounded-lg border border-brand-200 px-3 py-2 text-sm"
                    />
                    <button className="text-xs text-brand-500 underline">Remove</button>
                  </div>
                </div>
                <div className="text-sm font-semibold text-brand-900">₹2,799</div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-3xl border border-brand-100 bg-brand-50 p-6">
          <h2 className="text-lg font-semibold text-brand-900">Order summary</h2>
          <div className="mt-4 space-y-3 text-sm text-brand-700">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹5,598</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>₹99</span>
            </div>
            <div className="flex justify-between">
              <span>Discount</span>
              <span>-₹200</span>
            </div>
            <div className="border-t border-brand-200 pt-3 font-semibold text-brand-900">
              <div className="flex justify-between">
                <span>Total</span>
                <span>₹5,497</span>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <label className="text-xs font-semibold uppercase text-brand-500">Coupon</label>
            <div className="mt-2 flex gap-2">
              <input
                type="text"
                placeholder="PILLAA200"
                className="w-full rounded-xl border border-brand-200 px-4 py-2 text-sm"
              />
              <button className="rounded-xl bg-brand-900 px-4 py-2 text-sm text-white">Apply</button>
            </div>
          </div>
          <Link
            href="/checkout"
            className="mt-6 inline-flex w-full justify-center rounded-full bg-brand-900 px-5 py-3 text-sm font-semibold text-white"
          >
            Proceed to checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
